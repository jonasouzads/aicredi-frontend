'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook para criar trap de foco em modais
 * Mantém o foco dentro do elemento especificado
 */
export function useFocusTrap(isActive: boolean = true) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !elementRef.current) return;

    const element = elementRef.current;
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focar no primeiro elemento ao abrir
    firstFocusable?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Disparar evento customizado para fechar o modal
        element.dispatchEvent(new CustomEvent('modal-close'));
      }
    };

    element.addEventListener('keydown', handleTabKey);
    element.addEventListener('keydown', handleEscapeKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
      element.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return elementRef;
}
