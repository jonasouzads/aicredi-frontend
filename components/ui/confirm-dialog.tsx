'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Button } from './button';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true);
    }
    setIsOpen(false);
    setOptions(null);
    setResolvePromise(null);
  };

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false);
    }
    setIsOpen(false);
    setOptions(null);
    setResolvePromise(null);
  };

  const getIcon = () => {
    switch (options?.type) {
      case 'danger':
        return 'fi-rr-trash';
      case 'warning':
        return 'fi-rr-exclamation';
      default:
        return 'fi-rr-info';
    }
  };

  const getIconColor = () => {
    switch (options?.type) {
      case 'danger':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-brand bg-brand-50';
    }
  };

  const getConfirmButtonClass = () => {
    switch (options?.type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-brand hover:bg-brand-700 text-white';
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Modal Overlay - só renderiza se estiver aberto */}
      {isOpen && options && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-surface rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl ${getIconColor()} flex items-center justify-center mx-auto mb-6`}>
            <i className={`fi ${getIcon()} text-3xl`}></i>
          </div>

          {/* Title */}
          <h3 className="text-title text-text-primary text-center mb-3">
            {options.title}
          </h3>

          {/* Message */}
          <p className="text-body text-text-secondary text-center mb-8">
            {options.message}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              {options.cancelText || 'Cancelar'}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 rounded-xl ${getConfirmButtonClass()}`}
            >
              {options.confirmText || 'Confirmar'}
            </Button>
          </div>
        </div>
      </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
}

// Componente standalone para uso direto
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return 'fi-rr-trash';
      case 'warning':
        return 'fi-rr-exclamation';
      default:
        return 'fi-rr-info';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-brand bg-brand-50';
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-brand hover:bg-brand-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-surface rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl ${getIconColor()} flex items-center justify-center mx-auto mb-6`}>
          <i className={`fi ${getIcon()} text-3xl`}></i>
        </div>

        {/* Title */}
        <h3 className="text-title text-text-primary text-center mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-body text-text-secondary text-center mb-8">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-xl"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 rounded-xl ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
