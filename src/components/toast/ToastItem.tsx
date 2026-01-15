import React, { useEffect, useState, useCallback } from 'react';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimes,
} from 'react-icons/fa';
import { Toast } from '../../utils/types';
import { toast } from '../../utils/toastStore';

interface ToastItemProps {
    toast: Toast;
}

const ICONS = {
    success: FaCheckCircle,
    error: FaTimesCircle,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
};

const ToastItem: React.FC<ToastItemProps> = ({ toast: toastData }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    const Icon = ICONS[toastData.type];

    // Handle dismiss with animation
    const handleDismiss = useCallback(() => {
        setIsExiting(true);
        // Wait for animation to complete before removing
        setTimeout(() => {
            toast.dismiss(toastData.id);
        }, 300); // Match CSS animation duration
    }, [toastData.id]);

    // Progress bar animation
    useEffect(() => {
        if (toastData.persistent || toastData.duration === 0) {
            return;
        }

        const startTime = toastData.createdAt;
        const endTime = startTime + toastData.duration;

        const updateProgress = () => {
            const now = Date.now();
            const remaining = endTime - now;
            const percentage = (remaining / toastData.duration) * 100;

            if (percentage <= 0) {
                setProgress(0);
            } else {
                setProgress(percentage);
                window.requestAnimationFrame(updateProgress);
            }
        };

        const animationFrame = window.requestAnimationFrame(updateProgress);

        return () => window.cancelAnimationFrame(animationFrame);
    }, [toastData.createdAt, toastData.duration, toastData.persistent]);

    // Auto-dismiss with exit animation
    useEffect(() => {
        if (toastData.persistent || toastData.duration === 0) {
            return;
        }

        // Start exit animation slightly before actual dismiss
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, toastData.duration - 300);

        return () => clearTimeout(exitTimer);
    }, [toastData.duration, toastData.persistent]);

    return (
        <div
            className={`toast-item toast-item--${toastData.type} ${isExiting ? 'toast-item--exiting' : ''}`}
            role="alert"
            aria-live={toastData.type === 'error' ? 'assertive' : 'polite'}
        >
            <div className="toast-item__icon">
                <Icon />
            </div>

            <div className="toast-item__content">
                <p className="toast-item__message">{toastData.message}</p>
            </div>

            <button
                type="button"
                className="toast-item__close"
                onClick={handleDismiss}
                aria-label="Dismiss notification"
            >
                <FaTimes />
            </button>

            {/* Progress bar for non-persistent toasts */}
            {!toastData.persistent && toastData.duration > 0 && (
                <div
                    className="toast-item__progress"
                    style={{ width: `${progress}%` }}
                />
            )}
        </div>
    );
};

export default ToastItem;
