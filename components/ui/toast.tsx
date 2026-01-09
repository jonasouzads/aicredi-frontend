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
        return 'bg-white border-green-500 text-green-700';
      case 'error':
        return 'bg-white border-red-500 text-red-700';
      case 'warning':
        return 'bg-white border-yellow-500 text-yellow-700';
      case 'info':
        return 'bg-white border-brand text-brand-700';
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { icon: 'fi-rr-check-circle', color: 'text-green-500' };
      case 'error':
        return { icon: 'fi-rr-cross-circle', color: 'text-red-500' };
      case 'warning':
        return { icon: 'fi-rr-exclamation', color: 'text-yellow-500' };
      case 'info':
        return { icon: 'fi-rr-info', color: 'text-brand' };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container - Canto Inferior Direito */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => {
          const iconData = getToastIcon(toast.type);
          return (
            <div
              key={toast.id}
              className={`
                ${getToastStyles(toast.type)}
                border-l-4 rounded-lg px-3 py-2.5 shadow-lg backdrop-blur-sm
                animate-in slide-in-from-bottom-5 duration-300
                flex items-center gap-2.5
              `}
            >
              <i className={`fi ${iconData.icon} ${iconData.color} text-lg flex-shrink-0`} aria-hidden="true"></i>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs text-gray-900">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-gray-600 mt-0.5">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar notificação"
              >
                <i className="fi fi-rr-cross text-xs" aria-hidden="true"></i>
              </button>
            </div>
          );
        })}
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
