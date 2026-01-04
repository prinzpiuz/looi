/**
 * Creates a debounced function that delays invoking the provided function
 * until after `wait` milliseconds have elapsed since the last invocation.
 */
export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number,
): {
    (...args: Parameters<T>): void;
    cancel: () => void;
    flush: () => void;
} {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;

    const debounced = (...args: Parameters<T>): void => {
        lastArgs = args;

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            if (lastArgs) {
                func(...lastArgs);
            }
            timeoutId = null;
            lastArgs = null;
        }, wait);
    };

    debounced.cancel = (): void => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            lastArgs = null;
        }
    };

    debounced.flush = (): void => {
        if (timeoutId && lastArgs) {
            clearTimeout(timeoutId);
            func(...lastArgs);
            timeoutId = null;
            lastArgs = null;
        }
    };

    return debounced;
}
