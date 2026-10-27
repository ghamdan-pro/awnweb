import { Listing } from '../data/mockListings';
import { Category } from '../data/categoriesData';

const DB_NAME = 'AwnYemenOfflineDB';
const DB_VERSION = 1;

export class LocalCacheDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB not supported in this environment');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains('listings')) {
          const store = db.createObjectStore('listings', { keyPath: 'id' });
          store.createIndex('categoryId', 'categoryId', { unique: false });
          store.createIndex('subCategoryId', 'subCategoryId', { unique: false });
          store.createIndex('sectionType', 'sectionType', { unique: false });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db!);
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }

  async getAllListings(): Promise<Listing[]> {
    try {
      const db = await this.init();
      return new Promise((resolve) => {
        const tx = db.transaction('listings', 'readonly');
        const store = tx.objectStore('listings');
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async putListings(listings: Listing[]): Promise<void> {
    try {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('listings', 'readwrite');
        const store = tx.objectStore('listings');
        for (const item of listings) {
          store.put(item);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to cache in IndexedDB:', e);
    }
  }
}

export const localCacheDb = new LocalCacheDB();
