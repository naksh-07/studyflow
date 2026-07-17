export type SyncState =
  | 'AUTH_REQUIRED'
  | 'OFFLINE'
  | 'PENDING'
  | 'SYNCING_UPLOAD'
  | 'SYNCING_DOWNLOAD'
  | 'MERGING'
  | 'FAILED'
  | 'SYNCED';

export interface SyncStatusPayload {
  state: SyncState;
  lastError?: string;
  timestamp: number;
}

class SyncStatusTracker {
  private currentState: SyncState = 'SYNCED';
  private lastError: string | undefined = undefined;
  private listeners = new Set<(payload: SyncStatusPayload) => void>();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('studyflow_sync_status_v1');
        this.channel.onmessage = (event) => {
          if (event.data && typeof event.data.state === 'string') {
            const payload = event.data as SyncStatusPayload;
            this.setStateInternal(payload.state, payload.lastError, false);
          }
        };
      } catch (e) {
        console.error('BroadcastChannel failed to initialize:', e);
      }
    }
  }

  getState(): SyncState {
    return this.currentState;
  }

  getLastError(): string | undefined {
    return this.lastError;
  }

  setState(state: SyncState, lastError?: string) {
    this.setStateInternal(state, lastError, true);
  }

  private setStateInternal(state: SyncState, lastError: string | undefined, broadcast: boolean) {
    this.currentState = state;
    this.lastError = lastError;

    const payload: SyncStatusPayload = {
      state,
      lastError,
      timestamp: Date.now(),
    };

    // Notify local listeners
    this.listeners.forEach((listener) => listener(payload));

    // Broadcast to other tabs
    if (broadcast && this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (e) {
        // Ignore broadcast errors in closed tabs or environments
      }
    }
  }

  subscribe(listener: (payload: SyncStatusPayload) => void): () => void {
    this.listeners.add(listener);
    // Notify immediately with current state
    listener({
      state: this.currentState,
      lastError: this.lastError,
      timestamp: Date.now(),
    });
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const syncStatusTracker = new SyncStatusTracker();
