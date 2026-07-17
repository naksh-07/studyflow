import { syncSnapshot, ApiError } from '@/api/client';
import { deleteSyncOperation, readSyncQueue, writeSyncOperation } from '@/storage/indexed-db';
import { StudyFlowSnapshot, SyncOperation } from '@/storage/types';
import { connectivityService } from '@/services/connectivity.service';
import { runExclusive } from './sync-lock';
import { syncStatusTracker } from './sync-status';

const MAX_ATTEMPTS = 5;

function createOperation(snapshot: StudyFlowSnapshot): SyncOperation {
  return {
    id: crypto.randomUUID(),
    type: 'SYNC_STATE',
    payload: snapshot,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };
}

export class SyncQueue {
  private isFlushing = false;
  private retryTimeoutId: any = null;

  async enqueueSnapshot(snapshot: StudyFlowSnapshot): Promise<void> {
    try {
      const operations = await readSyncQueue();
      for (const op of operations) {
        if (op.type === 'SYNC_STATE') {
          await deleteSyncOperation(op.id);
        }
      }
    } catch (err) {
      console.error('Failed to coalesce sync queue:', err);
    }

    await writeSyncOperation(createOperation(snapshot));
    
    // Explicit transition to PENDING on new local changes (waiting to upload)
    syncStatusTracker.setState('PENDING');

    await this.flush();
  }

  async flush(): Promise<void> {
    if (this.isFlushing) {
      return;
    }

    if (!connectivityService.isOnline()) {
      const remaining = await readSyncQueue();
      if (remaining.length > 0) {
        syncStatusTracker.setState('PENDING');
      } else {
        syncStatusTracker.setState('OFFLINE');
      }
      return;
    }

    this.isFlushing = true;

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }

    try {
      await runExclusive('studyflow_sync_lock', async () => {
        await this.flushInternal();
      });
    } finally {
      this.isFlushing = false;
    }
  }

  private async flushInternal(): Promise<void> {
    let operations = await readSyncQueue();
    if (operations.length === 0) {
      syncStatusTracker.setState('SYNCED');
      return;
    }

    // Active upload in progress
    syncStatusTracker.setState('SYNCING_UPLOAD');

    // 1. Safe deduplication: Keep only the latest SYNC_STATE operation and discard any older ones
    const syncStateOps = operations.filter(op => op.type === 'SYNC_STATE');

    if (syncStateOps.length > 1) {
      // Sort descending by createdAt to find the latest
      syncStateOps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const latestOp = syncStateOps[0];
      const toDelete = syncStateOps.slice(1);

      for (const op of toDelete) {
        try {
          await deleteSyncOperation(op.id);
        } catch (e) {
          console.error('Failed to delete deduplicated operation:', e);
        }
      }
      // Re-read queue after deleting duplicates
      operations = await readSyncQueue();
    }

    let hasFailure = false;
    let authExpired = false;
    let failureMsg = '';

    // 2. Process operations in FIFO order (sorted by readSyncQueue)
    for (const operation of operations) {
      // Respect backoff of the oldest operation
      if (operation.nextAttemptAt && new Date(operation.nextAttemptAt).getTime() > Date.now()) {
        hasFailure = true;
        failureMsg = operation.lastError || 'Backoff retry active';
        break;
      }

      try {
        if (operation.type === 'SYNC_STATE') {
          await syncSnapshot(operation.payload as StudyFlowSnapshot);
        }

        await deleteSyncOperation(operation.id);
      } catch (error) {
        hasFailure = true;
        const isAuthError = error instanceof ApiError && (error.status === 401 || error.status === 403);
        if (isAuthError) {
          authExpired = true;
        }
        failureMsg = error instanceof Error ? error.message : 'Unknown sync error';

        const attempts = operation.attempts + 1;
        const backoffMs = Math.pow(2, attempts) * 1000; // 2s, 4s, 8s, 16s...
        const nextAttemptAt = new Date(Date.now() + backoffMs).toISOString();

        if (attempts >= MAX_ATTEMPTS) {
          console.error(`Operation ${operation.id} failed after ${attempts} attempts. Discarding poison operation.`, error);
          await deleteSyncOperation(operation.id);
          // Poison operation discarded, don't consider block-failing queue anymore
          hasFailure = false;
        } else {
          await writeSyncOperation({
            ...operation,
            attempts,
            lastError: failureMsg,
            nextAttemptAt,
          });
        }

        // Strict FIFO boundary: halt processing on any failure to maintain order and wait for backoff
        break;
      }
    }

    // Verify actual remaining queue state to finalize deterministic status reporting
    const remainingOps = await readSyncQueue();
    if (remainingOps.length === 0) {
      syncStatusTracker.setState('SYNCED');
    } else if (authExpired) {
      syncStatusTracker.setState('AUTH_REQUIRED', failureMsg);
    } else if (hasFailure) {
      syncStatusTracker.setState('FAILED', failureMsg);
    } else if (!connectivityService.isOnline()) {
      syncStatusTracker.setState('PENDING');
    } else {
      syncStatusTracker.setState('FAILED', failureMsg || 'Retry pending');
    }

    // 3. Auto-scheduling retries: If there are still items in the queue, schedule the next flush
    if (remainingOps.length > 0 && connectivityService.isOnline()) {
      const nextOp = remainingOps[0];
      const delay = nextOp.nextAttemptAt
        ? Math.max(500, new Date(nextOp.nextAttemptAt).getTime() - Date.now())
        : 2000;
      this.retryTimeoutId = setTimeout(() => {
        void this.flush();
      }, delay);
    }
  }

  bindNetworkEvents(): () => void {
    const flush = () => {
      void this.flush();
    };

    const unsubscribe = connectivityService.onOnline(() => {
      // Reconnected!
      // Trigger a flush. If there are operations, it will go PENDING -> UPLOAD -> SYNCED
      void this.flush();
    });

    return () => {
      unsubscribe();
    };
  }
}

export const syncQueue = new SyncQueue();

