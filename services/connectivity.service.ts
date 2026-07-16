export interface ConnectivityService {
  isOnline(): boolean;
  onOnline(callback: () => void): () => void;
  onOffline(callback: () => void): () => void;
}

class BrowserConnectivityService implements ConnectivityService {
  private listeners: { online: Set<() => void>; offline: Set<() => void> } = {
    online: new Set(),
    offline: new Set(),
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.listeners.online.forEach((cb) => cb());
      });
      window.addEventListener('offline', () => {
        this.listeners.offline.forEach((cb) => cb());
      });
    }
  }

  isOnline(): boolean {
    if (typeof navigator === 'undefined') {
      return true; // Assume online in SSR context
    }
    return navigator.onLine;
  }

  onOnline(callback: () => void): () => void {
    this.listeners.online.add(callback);
    return () => {
      this.listeners.online.delete(callback);
    };
  }

  onOffline(callback: () => void): () => void {
    this.listeners.offline.add(callback);
    return () => {
      this.listeners.offline.delete(callback);
    };
  }
}

export const connectivityService = new BrowserConnectivityService();
