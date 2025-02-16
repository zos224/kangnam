"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from './ui/toast';

interface ToastContextProps {
    showToast: (text: string, status: 'success' | 'error') => void;
    hideToast: () => void;
}

interface ToastProviderProps {
    children: React.ReactNode;
}

interface ToastState {
    isOpen: boolean;
    text: string;
    status: 'success' | 'error';
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<ToastState>({
        isOpen: false,
        text: '',
        status: 'success',
    });

    useEffect(() => {
        if (toast.isOpen) {
            setTimeout(() => {
                hideToast()
            }, 5000)
        }
    }, [toast])

    const showToast = (text: string, status: 'success' | 'error') => {
        setToast({ isOpen: true, text, status });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50">
                <Toast 
                    text={toast.text}
                    status={toast.status}
                    open={toast.isOpen}
                    close={hideToast}
                />
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
