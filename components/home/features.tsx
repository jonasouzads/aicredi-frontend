import { Bot, MessageSquare, FileText, Zap, Shield, BarChart, Filter } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Agents Inteligentes',
    description: 'Robôs treinados para fazer pré-cadastro, checar documentos e seguir seu fluxo de crédito.',
    color: 'brand',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Integrado',
    description: 'O cliente fala com seu número e o AiCredy faz todo atendimento — análise, perguntas, atualização e envio da oferta.',
    color: 'accent',
  },
  {
    icon: FileText,
    title: 'Análise de Documentos',
    description: 'Extrai dados de RG, CNH, contracheque, extrato FGTS e contas de consumo para validar elegibilidade.',
    color: 'brand',
  },
  {
    icon: Zap,
    title: 'Processamento Rápido',
    description: 'Workers assíncronos tratam centenas de consultas simultâneas sem travar seu fluxo.',
    color: 'accent',
  },
  {
    icon: Filter,
    title: 'Filtro de Elegibilidade Automático',
    description: 'Aceita somente clientes com potencial real: CLT, FGTS, consignado, conta em dia, score mínimo, entre outros (você ajusta as regras).',
    color: 'brand',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'JWT, RLS no banco e tratamento de dados sensíveis conforme boas práticas financeiras.',
    color: 'accent',
  },
  {
    icon: BarChart,
    title: 'Analytics em Tempo Real',
    description: 'Conversões, funil de atendimento e performance dos seus agents.',
    color: 'brand',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Tudo que você precisa para vender crédito no automático
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Plataforma feita para correspondentes bancários que precisam escalar atendimento sem aumentar equipe.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isAccent = feature.color === 'accent';
              return (
                <div 
                  key={feature.title} 
                  className="bg-background rounded-2xl p-8 hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-14 h-14 ${isAccent ? 'bg-accent/20' : 'bg-brand-50'} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${isAccent ? 'text-accent-700' : 'text-brand'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
