import { Bot, MessageSquare, FileText, Zap, Shield, BarChart } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Agents Inteligentes',
    description: 'Crie agents personalizados com instruções específicas e ferramentas customizadas.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Integrado',
    description: 'Atendimento automático via WhatsApp com histórico de conversas completo.',
  },
  {
    icon: FileText,
    title: 'Análise de Documentos',
    description: 'Extração automática de dados de RG, CNH, CPF e comprovantes com Vision AI.',
  },
  {
    icon: Zap,
    title: 'Processamento Rápido',
    description: 'Workers assíncronos processam milhares de mensagens simultaneamente.',
  },
  {
    icon: Shield,
    title: 'Seguro e Confiável',
    description: 'Autenticação JWT, RLS no banco de dados e dados sensíveis protegidos.',
  },
  {
    icon: BarChart,
    title: 'Analytics em Tempo Real',
    description: 'Acompanhe métricas, conversões e performance dos seus agents.',
  },
];

export function Features() {
  return (
    <section id="features" className="container mx-auto px-6 py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Tudo que você precisa para automatizar
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Plataforma completa com todas as ferramentas necessárias para criar 
            experiências de atendimento inteligentes.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="text-title text-text-primary mb-3">{feature.title}</h3>
                <p className="text-body text-text-secondary">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
