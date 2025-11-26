'use client';

import { Contact, useContacts } from '@/hooks/use-contacts';
import { Simulation } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ContactDetailsCardProps {
  contact: Contact;
  onClose: () => void;
  onOpenChat: () => void;
}

export function ContactDetailsCard({ contact, onClose, onOpenChat }: ContactDetailsCardProps) {
  const { getSimulations } = useContacts();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [isLoadingSimulations, setIsLoadingSimulations] = useState(true);
  const [showClientData, setShowClientData] = useState(false);

  useEffect(() => {
    async function loadSimulations() {
      try {
        setIsLoadingSimulations(true);
        const data = await getSimulations(contact.id);
        setSimulations(data);
      } catch (error) {
        console.error('Erro ao carregar simulações:', error);
      } finally {
        setIsLoadingSimulations(false);
      }
    }
    
    loadSimulations();
  }, [contact.id]);

  // Pegar a simulação mais recente
  const latestSimulation = simulations[0];
  const simulationData = latestSimulation?.webhook_data || latestSimulation?.output;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                <i className="fi fi-rr-user text-2xl text-brand"></i>
              </div>
              <div>
                <h2 className="text-title text-text-primary mb-1">
                  {contact.name || 'Sem nome'}
                </h2>
                <div className="flex flex-col gap-1 text-sm text-text-secondary">
                  {contact.phone && (
                    <span className="flex items-center gap-2">
                      <i className="fi fi-rr-phone-call"></i>
                      {contact.phone}
                    </span>
                  )}
                  {contact.email && (
                    <span className="flex items-center gap-2">
                      <i className="fi fi-rr-envelope"></i>
                      {contact.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-background transition-colors"
            >
              <i className="fi fi-rr-cross text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Status
            </label>
            <div className="flex items-center gap-2">
              <span className={`badge ${
                contact.fields?.status === 'lead' ? 'badge-info' :
                contact.fields?.status === 'in_progress' ? 'badge-warning' :
                contact.fields?.status === 'completed' ? 'badge-success' :
                'badge-info'
              }`}>
                {contact.fields?.status === 'lead' ? 'Novo Lead' :
                 contact.fields?.status === 'in_progress' ? 'Em Atendimento' :
                 contact.fields?.status === 'completed' ? 'Concluído' :
                 contact.fields?.status || 'Sem status'}
              </span>
            </div>
          </div>

          {/* Proposta/Simulação */}
          {isLoadingSimulations ? (
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Proposta
              </label>
              <div className="bg-background rounded-xl p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
              </div>
            </div>
          ) : latestSimulation ? (
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Proposta {latestSimulation.provider === 'crefaz' && '(Crefaz)'}
              </label>
              <div className="bg-background rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    simulationData?.situacaoDescricao === 'Aprovada' ? 'bg-green-50' :
                    simulationData?.situacaoDescricao === 'Negada' ? 'bg-red-50' :
                    'bg-yellow-50'
                  }`}>
                    <i className={`fi fi-rr-document text-xl ${
                      simulationData?.situacaoDescricao === 'Aprovada' ? 'text-green-600' :
                      simulationData?.situacaoDescricao === 'Negada' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-text-primary">
                        ID: {simulationData?.propostaId}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        simulationData?.situacaoDescricao === 'Aprovada' ? 'bg-green-100 text-green-700' :
                        simulationData?.situacaoDescricao === 'Negada' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {simulationData?.situacaoDescricao}
                      </span>
                    </div>
                    
                    {simulationData?.situacaoDescricao === 'Aprovada' && simulationData.valorAprovado && (
                      <div className="space-y-1">
                        <p className="text-sm text-text-primary">
                          <span className="font-medium">Valor:</span> R$ {simulationData.valorAprovado.toLocaleString('pt-BR')}
                        </p>
                        {simulationData.parcelas && (
                          <p className="text-xs text-text-secondary">
                            {simulationData.parcelas}x de R$ {(simulationData.valorAprovado / simulationData.parcelas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {simulationData?.motivos && simulationData.motivos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-text-secondary">
                          {simulationData.motivos[0]}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs text-text-secondary mt-2">
                      Criada em {new Date(latestSimulation.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                {/* Botão Ver Dados do Cliente */}
                {latestSimulation.input && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setShowClientData(!showClientData)}
                      className="flex items-center gap-2 text-sm text-brand hover:text-brand-700 transition-colors"
                    >
                      <i className={`fi fi-rr-${showClientData ? 'angle-up' : 'angle-down'} text-base`}></i>
                      {showClientData ? 'Ocultar' : 'Ver'} Dados do Cliente
                    </button>
                    
                    {showClientData && (
                      <div className="mt-3 space-y-2 bg-white rounded-lg p-3 border border-gray-100">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-text-secondary">Nome:</span>
                            <p className="text-text-primary font-medium">{latestSimulation.input.nome}</p>
                          </div>
                          <div>
                            <span className="text-text-secondary">CPF:</span>
                            <p className="text-text-primary font-medium">{latestSimulation.input.cpf}</p>
                          </div>
                          <div>
                            <span className="text-text-secondary">Data Nasc.:</span>
                            <p className="text-text-primary font-medium">{latestSimulation.input.dataNascimento}</p>
                          </div>
                          <div>
                            <span className="text-text-secondary">Telefone:</span>
                            <p className="text-text-primary font-medium">{latestSimulation.input.telefone}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-text-secondary">CEP:</span>
                            <p className="text-text-primary font-medium">{latestSimulation.input.cep}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Descrição/Notas */}
          {contact.fields?.description && (
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Notas
              </label>
              <div className="bg-background rounded-xl p-4">
                <p className="text-sm text-text-primary whitespace-pre-wrap">
                  {contact.fields.description}
                </p>
              </div>
            </div>
          )}

          {/* Informações Adicionais */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Informações
            </label>
            <div className="bg-background rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Criado em:</span>
                <span className="text-text-primary font-medium">
                  {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {contact.channel && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Canal:</span>
                  <span className="text-text-primary font-medium">
                    {contact.channel.identifier || contact.channel.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <Button
            onClick={onOpenChat}
            className="btn-primary flex-1"
          >
            <i className="fi fi-rr-comment-alt text-base mr-2"></i>
            Ver Conversa
          </Button>
          <Button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
