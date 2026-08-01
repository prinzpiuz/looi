import { getCachedFavicon, setCachedFavicon } from './faviconCache';

/** Extract a normalized domain (no www, no protocol) from any URL. */
export function getDomain(url: string): string {
    try {
        const normalized = url.startsWith('http') ? url : `https://${url}`;
        return new URL(normalized).hostname.replace(/^www\./, '');
    } catch {
        return '';
    }
}

export function iconHorseUrl(domain: string): string {
    return `https://icon.horse/icon/${domain}`;
}

export function googleFaviconUrl(domain: string, size = 64): string {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/** Fetch a URL and convert the image response to a base64 data URL. */
async function fetchAsDataUrl(url: string): Promise<string | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;

        const blob = await res.blob();
        // Guard against empty responses or non-images
        if (blob.size === 0 || !blob.type.startsWith('image/')) return null;

        return await blobToDataUrl(blob);
    } catch {
        return null;
    }
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () =>
            reject(reader.error ?? new Error('Failed to read blob'));
        reader.readAsDataURL(blob);
    });
}

/**
 * Resolve a favicon for a domain:
 * 1. Return from cache if present.
 * 2. Otherwise walk the source chain (custom -> icon.horse -> Google),
 *    cache the first success, and return it.
 * 3. Return null if everything fails (caller shows a letter avatar).
 */
export async function resolveFavicon(
    domain: string,
    customIcon?: string,
): Promise<string | null> {
    if (!domain) return null;

    const cached = await getCachedFavicon(domain);
    if (cached) return cached;

    // A custom icon (if it isn't just an icon.horse URL) goes first.
    const sources: string[] = [];
    if (customIcon && !customIcon.includes('icon.horse')) {
        sources.push(customIcon);
    }
    sources.push(iconHorseUrl(domain), googleFaviconUrl(domain));

    for (const src of sources) {
        const dataUrl = await fetchAsDataUrl(src);
        if (dataUrl) {
            await setCachedFavicon(domain, dataUrl);
            return dataUrl;
        }
    }

    return null;
}

/** Fire-and-forget prefetch, e.g. when a bookmark is saved. */
export function prefetchFavicon(domain: string, customIcon?: string): void {
    void resolveFavicon(domain, customIcon);
}
