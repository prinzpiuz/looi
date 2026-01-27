import { Toast, ToastOptions, ToastType, ToastListener } from './types';

const DEFAULT_DURATION = 5000;

class ToastStore {
    private toasts: Toast[] = [];
    private listeners: Set<ToastListener> = new Set();
    private timers: Map<string, NodeJS.Timeout> = new Map();

    subscribe(listener: ToastListener): () => void {
        this.listeners.add(listener);
        listener(this.toasts);

        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify(): void {
        const currentToasts = [...this.toasts];
        this.listeners.forEach((listener) => listener(currentToasts));
    }

    private generateId(): string {
        return `toast-${Date.now()}-${crypto.randomUUID()}`;
    }

    private addToast(
        type: ToastType,
        message: string,
        options: ToastOptions = {},
    ): string {
        const id = options.id || this.generateId();

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

        if (!toast.persistent && toast.duration > 0) {
            const timer = setTimeout(() => {
                this.dismiss(id);
            }, toast.duration);
            this.timers.set(id, timer);
        }

        return id;
    }

    dismiss(id: string): void {
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }

        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
    }

    dismissAll(): void {
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers.clear();

        this.toasts = [];
        this.notify();
    }

    getToasts(): Toast[] {
        return [...this.toasts];
    }

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

const toastStore = new ToastStore();

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
