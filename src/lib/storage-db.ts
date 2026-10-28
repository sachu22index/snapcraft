/**
 * SnapCraft Persistent Client Storage Engine
 * Backed by IndexedDB with in-memory caching and cross-tab synchronization.
 * Solves browser localStorage 5MB quota exhaustion for high-resolution images.
 */

const DB_NAME = "snapcraft_local_db";
const DB_VERSION = 1;
const STORE_PRODUCTS = "products";
const STORE_CATEGORIES = "categories";
const STORE_MEDIA = "media";

let dbPromise: Promise<IDBDatabase> | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function getDb(): Promise<IDBDatabase> {
  if (!isBrowser()) {
    return Promise.reject(new Error("IndexedDB is only available in browser environments"));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
          db.createObjectStore(STORE_PRODUCTS, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
          db.createObjectStore(STORE_CATEGORIES, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_MEDIA)) {
          db.createObjectStore(STORE_MEDIA, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

// -----------------------------------------------------------------------------
// Cross-Tab & Cross-Window Notification Channel
// -----------------------------------------------------------------------------
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && typeof window.BroadcastChannel !== "undefined") {
  try {
    broadcastChannel = new BroadcastChannel("snapcraft_channel");
  } catch {
    // Ignore BroadcastChannel errors in restrictive environments
  }
}

export function broadcastSyncEvent(eventType: "products" | "categories" | "media") {
  if (typeof window === "undefined") return;

  // 1. Dispatch custom event on current window
  window.dispatchEvent(new CustomEvent(`snapcraft:${eventType}-updated`));

  // 2. Broadcast to other open tabs / windows
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: eventType, timestamp: Date.now() });
    } catch {
      // Ignore
    }
  }

  // 3. Fallback: update storage key to trigger cross-tab storage event
  try {
    localStorage.setItem(`snapcraft_sync_${eventType}`, String(Date.now()));
  } catch {
    // Ignore localStorage errors
  }
}

export function listenToSyncEvents(callback: (eventType: string) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustom = (e: Event) => {
    const custom = e as CustomEvent;
    callback(custom.type);
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data && e.data.type) {
      callback(e.data.type);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key && e.key.startsWith("snapcraft_sync_")) {
      const type = e.key.replace("snapcraft_sync_", "");
      callback(type);
    }
  };

  window.addEventListener("snapcraft:products-updated", handleCustom);
  window.addEventListener("snapcraft:categories-updated", handleCustom);
  window.addEventListener("snapcraft:media-updated", handleCustom);

  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", handleBroadcast);
  }

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("snapcraft:products-updated", handleCustom);
    window.removeEventListener("snapcraft:categories-updated", handleCustom);
    window.removeEventListener("snapcraft:media-updated", handleCustom);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", handleBroadcast);
    }
    window.removeEventListener("storage", handleStorage);
  };
}

// -----------------------------------------------------------------------------
// IndexedDB Operations
// -----------------------------------------------------------------------------

export async function idbGetAll<T>(storeName: string): Promise<T[]> {
  if (!isBrowser()) return [];
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as T[]) || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`idbGetAll failed for ${storeName}:`, err);
    return [];
  }
}

export async function idbGet<T>(storeName: string, id: string): Promise<T | null> {
  if (!isBrowser()) return null;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as T) || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`idbGet failed for ${storeName}/${id}:`, err);
    return null;
  }
}

export async function idbPut<T>(storeName: string, item: T): Promise<void> {
  if (!isBrowser()) return;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`idbPut failed for ${storeName}:`, err);
  }
}

export async function idbPutAll<T>(storeName: string, items: T[]): Promise<void> {
  if (!isBrowser()) return;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.clear();
      for (const item of items) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error(`idbPutAll failed for ${storeName}:`, err);
  }
}

export async function idbDelete(storeName: string, id: string): Promise<void> {
  if (!isBrowser()) return;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`idbDelete failed for ${storeName}/${id}:`, err);
  }
}

export async function idbClear(storeName: string): Promise<void> {
  if (!isBrowser()) return;
  try {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error(`idbClear failed for ${storeName}:`, err);
  }
}
