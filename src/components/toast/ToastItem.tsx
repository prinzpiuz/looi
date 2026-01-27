import React, { useEffect, useState, useCallback } from 'react';
import {
    FaCheck,
    FaTimes,
    FaExclamationTriangle,
    FaInfoCircle,
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { ToastItemProps } from '../../utils/types';
import { toast } from '../../utils/toastStore';

const ICONS = {
    success: FaCheck,
    error: FaTimes,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
};

const ToastItem: React.FC<ToastItemProps> = ({ toast: toastData }) => {
    const [isExiting, setIsExiting] = useState(false);
    const Icon = ICONS[toastData.type];

    const handleDismiss = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => toast.dismiss(toastData.id), 200);
    }, [toastData.id]);

    useEffect(() => {
        if (toastData.persistent || toastData.duration === 0) return;

        const timer = setTimeout(() => {
            setIsExiting(true);
        }, toastData.duration - 200);

        return () => clearTimeout(timer);
    }, [toastData.duration, toastData.persistent]);

    return (
        <div
            className={`toast-item toast-item--${toastData.type} ${isExiting ? 'toast-item--exiting' : ''}`}
            role="alert"
        >
            <span className="toast-item__icon">
                <Icon />
            </span>
            <p className="toast-item__message">{toastData.message}</p>
            <button
                type="button"
                className="toast-item__close"
                onClick={handleDismiss}
                aria-label="Close"
            >
                <IoClose size={16} />
            </button>
        </div>
    );
};

export default ToastItem;
