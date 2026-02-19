'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import styles from '@/components/Toast/Toast.module.css';
import { Check } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 3000, action = null) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, action }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <div key={toast.id} className={styles.toast}>
                        <div className={styles.icon}>
                            <Check size={12} />
                        </div>
                        <span style={{ flex: 1 }}>{toast.message}</span>
                        {toast.action && (
                            <button
                                onClick={toast.action.onClick}
                                className={styles.actionButton}
                            >
                                {toast.action.label}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
