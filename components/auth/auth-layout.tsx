'use client';

import { Logo } from '@/components/shared/logo';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Aba Lateral Esquerda - Informações do AICredy */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand to-brand-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Padrão de fundo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-16">
            <img 
              src="/logo-white.svg" 
              alt="AICredy" 
              width={140} 
              height={40}
              className="h-10"
            />
          </div>

          {/* Headline e Descrição */}
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Seu novo vendedor de crédito 24 horas por dia
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Para corban que atende CLT, FGTS e contas de energia.
              <br />
              <span className="font-medium">
                O AiCredy responde, coleta dados e fecha propostas sozinho.
              </span>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-white/80">Disponível</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-sm text-white/80">Automático</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">∞</div>
            <div className="text-sm text-white/80">Atendimentos</div>
          </div>
        </div>
      </div>

      {/* Área do Formulário - Direita */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-2xl p-8">
            {children}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-text-secondary mt-6">
            © 2025 AICredy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
