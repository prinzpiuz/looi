import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ToastItem from './ToastItem';
import '../../assets/css/toast.css';
import { Toast } from '../../utils/types';
import { toastStore } from '../../utils/toastStore';

const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        return toastStore.subscribe(setToasts);
    }, []);

    if (toasts.length === 0) return null;

    return createPortal(
        <div className="toast-container">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} />
            ))}
        </div>,
        document.body,
    );
};

export default ToastContainer;
