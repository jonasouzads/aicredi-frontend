'use client';

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-text-secondary hover:text-text-primary transition-colors">
              Recursos
            </Link>
            <Link href="#pricing" className="text-text-secondary hover:text-primary transition-colors">
              Preços
            </Link>
            <Link href="#docs" className="text-text-secondary hover:text-text-primary transition-colors">
              Documentação
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="rounded-pill">
                Entrar
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-brand hover:bg-brand-700 text-white rounded-pill px-8">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
