const DB_NAME = 'looi-favicons';
const STORE_NAME = 'favicons';
const DB_VERSION = 1;

// Optional: refetch favicons older than this. Set to 0 to never expire.
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

interface FaviconRecord {
    domain: string;
    dataUrl: string;
    fetchedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'domain' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
            reject(
                request.error ?? new Error('Failed to open favicon database'),
            );
    });

    return dbPromise;
}

export async function getCachedFavicon(domain: string): Promise<string | null> {
    try {
        const db = await openDB();
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const request = tx.objectStore(STORE_NAME).get(domain);

            request.onsuccess = () => {
                const record = request.result as FaviconRecord | undefined;
                if (!record) return resolve(null);

                // Expire stale entries
                if (
                    MAX_AGE_MS > 0 &&
                    Date.now() - record.fetchedAt > MAX_AGE_MS
                ) {
                    return resolve(null);
                }
                resolve(record.dataUrl);
            };
            request.onerror = () =>
                reject(
                    request.error ?? new Error('Failed to read favicon cache'),
                );
        });
    } catch {
        return null;
    }
}

export async function setCachedFavicon(
    domain: string,
    dataUrl: string,
): Promise<void> {
    try {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put({
                domain,
                dataUrl,
                fetchedAt: Date.now(),
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () =>
                reject(tx.error ?? new Error('Failed to write favicon cache'));
        });
    } catch {
        // Caching is best-effort; ignore write failures.
    }
}

export async function clearFaviconCache(): Promise<void> {
    try {
        const db = await openDB();
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () =>
                reject(tx.error ?? new Error('Failed to clear favicon cache'));
        });
    } catch {
        // ignore
    }
}
