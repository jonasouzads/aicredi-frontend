'use client';

import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 lg:ml-0">
        {children}
      </main>
    </div>
  );
}
