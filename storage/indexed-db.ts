import { StudyFlowSnapshot, SyncOperation } from './types';

const DB_NAME = 'studyflow';
const DB_VERSION = 1;
const SNAPSHOTS_STORE = 'snapshots';
const SYNC_QUEUE_STORE = 'syncQueue';

type StoreName = typeof SNAPSHOTS_STORE | typeof SYNC_QUEUE_STORE;

let databasePromise: Promise<IDBDatabase> | null = null;

function ensureBrowser() {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment.');
  }
}

export function openStudyFlowDb(): Promise<IDBDatabase> {
  ensureBrowser();

  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(SNAPSHOTS_STORE)) {
        db.createObjectStore(SNAPSHOTS_STORE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id' });
      }
    };

    request.onerror = () => reject(request.error ?? new Error('Unable to open local database.'));
    request.onsuccess = () => resolve(request.result);
  });

  return databasePromise;
}

function withStore<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T | undefined> {
  return openStudyFlowDb().then((db) => (
    new Promise<T | undefined>((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = callback(store);
      let result: T | undefined;

      if (request) {
        request.onsuccess = () => {
          result = request.result;
        };
        request.onerror = () => reject(request.error ?? new Error('Local database request failed.'));
      }

      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error ?? new Error('Local database transaction failed.'));
      transaction.onabort = () => reject(transaction.error ?? new Error('Local database transaction aborted.'));
    })
  ));
}

export async function readSnapshot(): Promise<StudyFlowSnapshot | null> {
  const snapshot = await withStore<StudyFlowSnapshot>(SNAPSHOTS_STORE, 'readonly', (store) => store.get('default'));
  return snapshot ?? null;
}

export async function writeSnapshot(snapshot: StudyFlowSnapshot): Promise<void> {
  await withStore(SNAPSHOTS_STORE, 'readwrite', (store) => {
    store.put(snapshot);
  });
}

export async function readSyncQueue(): Promise<SyncOperation[]> {
  const operations = await withStore<SyncOperation[]>(SYNC_QUEUE_STORE, 'readonly', (store) => store.getAll());
  return operations ?? [];
}

export async function writeSyncOperation(operation: SyncOperation): Promise<void> {
  await withStore(SYNC_QUEUE_STORE, 'readwrite', (store) => {
    store.put(operation);
  });
}

export async function deleteSyncOperation(operationId: string): Promise<void> {
  await withStore(SYNC_QUEUE_STORE, 'readwrite', (store) => {
    store.delete(operationId);
  });
}
