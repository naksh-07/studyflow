import { syncSnapshot } from '@/api/client';
import { deleteSyncOperation, readSyncQueue, writeSyncOperation } from '@/storage/indexed-db';
import { StudyFlowSnapshot, SyncOperation } from '@/storage/types';
import { connectivityService } from '@/services/connectivity.service';

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

  async enqueueSnapshot(snapshot: StudyFlowSnapshot): Promise<void> {
    await writeSyncOperation(createOperation(snapshot));
    await this.flush();
  }

  async flush(): Promise<void> {
    if (this.isFlushing || !connectivityService.isOnline()) {
      return;
    }

    this.isFlushing = true;

    try {
      const operations = await readSyncQueue();

      for (const operation of operations) {
        try {
          if (operation.type === 'SYNC_STATE') {
            await syncSnapshot(operation.payload as StudyFlowSnapshot);
          }

          await deleteSyncOperation(operation.id);
        } catch (error) {
          const attempts = operation.attempts + 1;

          if (attempts >= MAX_ATTEMPTS) {
            await writeSyncOperation({
              ...operation,
              attempts,
              lastError: error instanceof Error ? error.message : 'Unknown sync error',
            });
            continue;
          }

          await writeSyncOperation({
            ...operation,
            attempts,
            lastError: error instanceof Error ? error.message : 'Unknown sync error',
          });
        }
      }
    } finally {
      this.isFlushing = false;
    }
  }

  bindNetworkEvents(): () => void {
    const flush = () => {
      void this.flush();
    };

    const unsubscribe = connectivityService.onOnline(flush);

    return () => {
      unsubscribe();
    };
  }
}

export const syncQueue = new SyncQueue();

