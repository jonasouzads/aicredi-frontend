import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, Zap, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section className="container mx-auto px-6 py-24 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand px-6 py-3 rounded-pill mb-8">
          <Zap className="w-4 h-4" />
          <span className="font-medium">Plataforma Multi-Agent com IA</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
          Automatize seu atendimento com{' '}
          <span className="text-brand">Inteligência Artificial</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
          Crie agents inteligentes que conversam, analisam documentos e processam propostas automaticamente. 
          Integração completa com WhatsApp e APIs financeiras.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth/sign-up">
            <Button className="bg-brand hover:bg-brand-700 text-white rounded-pill px-12 py-6 text-lg">
              Começar Agora
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" className="rounded-pill px-12 py-6 text-lg border-2">
              Ver Demonstração
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand mb-2">99%</div>
            <div className="text-text-secondary">Precisão</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand mb-2">24/7</div>
            <div className="text-text-secondary">Disponível</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand mb-2">10x</div>
            <div className="text-text-secondary">Mais Rápido</div>
          </div>
        </div>
      </div>
    </section>
  );
}
