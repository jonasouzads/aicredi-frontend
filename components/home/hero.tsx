import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-brand rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-800 px-5 py-2.5 rounded-full mb-8 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Inteligência Artificial para CORBAN</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6 leading-tight">
            Seu vendedor de crédito{' '}
            <span className="text-brand">24/7</span> com Inteligência Artificial
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
            O AiCredy atende seus clientes sozinho, filtra quem realmente tem acesso a crédito e envia propostas automaticamente. 
            <span className="font-semibold text-text-primary"> Ideal para CORBAN que querem vender no automático.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/sign-up">
              <Button className="bg-brand hover:bg-brand-600 text-white rounded-xl px-10 h-14 text-lg font-semibold">
                Começar Agora
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" className="rounded-xl px-10 h-14 text-lg font-semibold hover:bg-brand-50 hover:text-brand hover:border-brand">
                Ver Demonstração
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-white">
              <div className="text-4xl md:text-5xl font-bold text-brand mb-2">99%</div>
              <div className="text-text-secondary font-medium">Filtragem de Perfil</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white">
              <div className="text-4xl md:text-5xl font-bold text-brand mb-2">24/7</div>
              <div className="text-text-secondary font-medium">Atendendo por você</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white">
              <div className="text-4xl md:text-5xl font-bold text-accent-600 mb-2">10x</div>
              <div className="text-text-secondary font-medium">Mais Conversões</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
