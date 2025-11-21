'use client';

import { ToastProvider } from '@/components/ui/toast';
import { ConfirmProvider } from '@/components/ui/confirm-dialog';
import { ReactNode } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>
        {children}
      </ConfirmProvider>
    </ToastProvider>
  );
}
