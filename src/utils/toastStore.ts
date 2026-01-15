import { Toast, ToastOptions, ToastType, ToastListener } from './types';

// Default duration: 5 seconds
const DEFAULT_DURATION = 5000;

class ToastStore {
    private toasts: Toast[] = [];
    private listeners: Set<ToastListener> = new Set();
    private timers: Map<string, NodeJS.Timeout> = new Map();

    /**
     * Subscribe to toast changes
     */
    subscribe(listener: ToastListener): () => void {
        this.listeners.add(listener);
        // Immediately call with current toasts
        listener(this.toasts);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Notify all listeners of changes
     */
    private notify(): void {
        const currentToasts = [...this.toasts];
        this.listeners.forEach((listener) => listener(currentToasts));
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Add a new toast
     */
    private addToast(
        type: ToastType,
        message: string,
        options: ToastOptions = {},
    ): string {
        const id = options.id || this.generateId();

        // If toast with same ID exists, remove it first
        if (options.id && this.toasts.some((t) => t.id === id)) {
            this.dismiss(id);
        }

        const toast: Toast = {
            id,
            type,
            message,
            duration: options.duration ?? DEFAULT_DURATION,
            persistent: options.persistent ?? false,
            createdAt: Date.now(),
        };

        this.toasts.push(toast);
        this.notify();

        // Set auto-dismiss timer if not persistent
        if (!toast.persistent && toast.duration > 0) {
            const timer = setTimeout(() => {
                this.dismiss(id);
            }, toast.duration);
            this.timers.set(id, timer);
        }

        return id;
    }

    /**
     * Dismiss a toast by ID
     */
    dismiss(id: string): void {
        // Clear timer if exists
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }

        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
    }

    /**
     * Dismiss all toasts
     */
    dismissAll(): void {
        // Clear all timers
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers.clear();

        this.toasts = [];
        this.notify();
    }

    /**
     * Get current toasts
     */
    getToasts(): Toast[] {
        return [...this.toasts];
    }

    // Convenience methods for each type
    success(message: string, options?: ToastOptions): string {
        return this.addToast('success', message, options);
    }

    error(message: string, options?: ToastOptions): string {
        return this.addToast('error', message, options);
    }

    warning(message: string, options?: ToastOptions): string {
        return this.addToast('warning', message, options);
    }

    info(message: string, options?: ToastOptions): string {
        return this.addToast('info', message, options);
    }
}

// Create singleton instance
const toastStore = new ToastStore();

// Export the store instance and convenience functions
export { toastStore };

export const toast = {
    success: (message: string, options?: ToastOptions) =>
        toastStore.success(message, options),
    error: (message: string, options?: ToastOptions) =>
        toastStore.error(message, options),
    warning: (message: string, options?: ToastOptions) =>
        toastStore.warning(message, options),
    info: (message: string, options?: ToastOptions) =>
        toastStore.info(message, options),
    dismiss: (id: string) => toastStore.dismiss(id),
    dismissAll: () => toastStore.dismissAll(),
};
