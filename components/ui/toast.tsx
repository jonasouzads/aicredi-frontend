'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, type, title, message };
    
    setToasts((prev) => [...prev, toast]);

    // Auto remove após 5 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast('error', title, message);
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast('warning', title, message);
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast('info', title, message);
  }, [showToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-brand-50 border-brand-200 text-brand-800';
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'fi-rr-check-circle';
      case 'error':
        return 'fi-rr-cross-circle';
      case 'warning':
        return 'fi-rr-exclamation';
      case 'info':
        return 'fi-rr-info';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              ${getToastStyles(toast.type)}
              border-2 rounded-xl p-4 shadow-lg
              animate-in slide-in-from-top-5 duration-300
              flex items-start gap-3
            `}
          >
            <i className={`fi ${getToastIcon(toast.type)} text-xl flex-shrink-0 mt-0.5`}></i>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{toast.title}</h4>
              {toast.message && (
                <p className="text-sm opacity-90">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <i className="fi fi-rr-cross text-base"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
