import { useState, useCallback, useEffect, useRef } from "react";

const DB_NAME = "agent-builder";
const DB_VERSION = 1;
const STORE_NAME = "keyval";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getValue<T>(db: IDBDatabase, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

function setValue<T>(db: IDBDatabase, key: string, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function useIndexedDB<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const dbRef = useRef<IDBDatabase | null>(null);

  // Load from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;
    openDB()
      .then(async (db) => {
        dbRef.current = db;
        const stored = await getValue<T>(db, key);
        if (!cancelled && stored !== undefined) {
          setStoredValue(stored);
        }
      })
      .catch((err) => {
        console.error(`Failed to open IndexedDB for key "${key}"`, err);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setValueFn = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        // Persist to IndexedDB (fire-and-forget)
        const db = dbRef.current;
        if (db) {
          setValue(db, key, nextValue).catch((err) => {
            console.error(`Failed to save to IndexedDB key "${key}"`, err);
          });
        }
        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValueFn];
}
