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
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-surface"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <i className="fi fi-rr-cross text-xl text-text-primary"></i>
        ) : (
          <i className="fi fi-rr-menu-burger text-xl text-text-primary"></i>
        )}
      </button>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
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
        <nav className="flex-1 p-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-5 py-3 rounded-xl transition-all
                  ${isActive
                    ? 'bg-brand text-white font-medium'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                  }
                `}
              >
                <i className={`fi ${item.icon} text-xl leading-none flex items-center`}></i>
                <span className="text-[15px] leading-none">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 rounded-xl w-full text-text-secondary hover:bg-background hover:text-text-primary transition-all"
          >
            <i className="fi fi-rr-sign-out-alt text-xl leading-none flex items-center"></i>
            <span className="text-[15px] leading-none">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
