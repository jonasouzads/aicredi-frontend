'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/shared/logo';
import { createClient } from '@/lib/supabase/client';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'fi-rr-home' },
  { name: 'Kanban', href: '/dashboard/kanban', icon: 'fi-rr-dashboard' },
  { name: 'Agents', href: '/dashboard/agents', icon: 'fi-rr-brain' },
  { name: 'Canais', href: '/dashboard/channels', icon: 'fi-rr-messages' },
  { name: 'Credenciais', href: '/dashboard/credentials', icon: 'fi-rr-key' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevenir scroll quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-surface shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
        aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <i className="fi fi-rr-cross text-xl text-text-primary" aria-hidden="true"></i>
        ) : (
          <i className="fi fi-rr-menu-burger text-xl text-text-primary" aria-hidden="true"></i>
        )}
      </button>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-surface flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-8 pl-9">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-1" role="navigation" aria-label="Menu principal">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50
                  ${isActive
                    ? 'bg-brand-50 text-brand font-medium border-l-4 border-brand'
                    : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                  }
                `}
              >
                <i className={`fi ${item.icon} text-lg leading-none flex items-center`} aria-hidden="true"></i>
                <span className="text-sm leading-none">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="p-6 space-y-1 border-t border-border">
          <Link
            href="/dashboard/settings"
            className={`
              flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50
              ${pathname.startsWith('/dashboard/settings')
                ? 'bg-brand-50 text-brand font-medium border-l-4 border-brand'
                : 'text-text-secondary hover:bg-muted hover:text-text-primary'
              }
            `}
          >
            <i className="fi fi-rr-settings text-lg leading-none flex items-center" aria-hidden="true"></i>
            <span className="text-sm leading-none">Configurações</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-text-secondary hover:bg-muted hover:text-text-primary transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            aria-label="Sair da conta"
          >
            <i className="fi fi-rr-sign-out-alt text-lg leading-none flex items-center" aria-hidden="true"></i>
            <span className="text-sm leading-none">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
