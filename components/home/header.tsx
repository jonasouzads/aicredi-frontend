'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-text-secondary hover:text-brand transition-colors font-medium">
              Recursos
            </Link>
            <Link href="#pricing" className="text-text-secondary hover:text-brand transition-colors font-medium">
              Preços
            </Link>
            <Link href="#docs" className="text-text-secondary hover:text-brand transition-colors font-medium">
              Documentação
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-text-primary hover:text-brand">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-brand hover:bg-brand-600 text-white rounded-xl px-6 h-11">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
