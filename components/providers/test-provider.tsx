'use client';

import { useEffect } from 'react';

export function TestProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('✅ TestProvider montado!');
  }, []);

  return <>{children}</>;
}
