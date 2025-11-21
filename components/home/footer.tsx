import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-text-secondary max-w-sm">
              Plataforma multi-agent com IA para automatizar atendimento e processar propostas financeiras.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-text-secondary hover:text-text-primary transition-colors">
                  Recursos
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">
                  Preços
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-text-secondary hover:text-text-primary transition-colors">
                  Documentação
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-text-primary transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-text-primary transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background pt-8 text-center text-text-secondary">
          <p>© 2025 AICredy. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
