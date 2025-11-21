import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <Logo className="mb-6" />
            <p className="text-text-secondary max-w-md text-lg leading-relaxed">
              Plataforma multi-agent com IA para CORBAN vender crédito 24/7 no WhatsApp.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-bold text-text-primary mb-4 text-lg">Produto</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-text-secondary hover:text-brand transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-text-secondary hover:text-brand transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-text-secondary hover:text-brand transition-colors">
                  Documentação
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-bold text-text-primary mb-4 text-lg">Empresa</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-brand transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-brand transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-brand transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-text-secondary">© 2025 AICredy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
