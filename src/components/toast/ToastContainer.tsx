import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toastStore } from '../../utils/toastStore';
import { Toast } from '../../utils/types';
import ToastItem from './ToastItem';
import '../../assets/css/toast.css';

const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        // Subscribe to toast store
        const unsubscribe = toastStore.subscribe(setToasts);
        return () => unsubscribe();
    }, []);

    if (toasts.length === 0) {
        return null;
    }

    return createPortal(
        <div
            className="toast-container"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>,
        document.body,
    );
};

export default ToastContainer;
