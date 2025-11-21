'use client';

import { Contact, Conversation, useContacts } from '@/hooks/use-contacts';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ContactDetailsModalProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetailsModal({ contact, onClose }: ContactDetailsModalProps) {
  const { getConversations, updateContact } = useContacts();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState(contact.fields?.description || '');
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [contact.id]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await getConversations(contact.id);
      setConversations(data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDescription = async () => {
    try {
      setIsSavingDescription(true);
      await updateContact(contact.id, {
        fields: {
          ...contact.fields,
          description,
        },
      });
    } catch (error) {
      console.error('Erro ao salvar descrição:', error);
    } finally {
      setIsSavingDescription(false);
    }
  };

  const getChannelIcon = (type?: string) => {
    switch (type) {
      case 'whatsapp':
        return 'fi-brands-whatsapp';
      case 'telegram':
        return 'fi-brands-telegram';
      case 'instagram':
        return 'fi-brands-instagram';
      default:
        return 'fi-rr-comment-alt';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-background">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center">
                <i className="fi fi-rr-user text-3xl text-brand"></i>
              </div>
              <div>
                <h2 className="text-title text-text-primary mb-1">
                  {contact.name || 'Sem nome'}
                </h2>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  {contact.phone && (
                    <span className="flex items-center gap-1">
                      <i className="fi fi-rr-phone-call"></i>
                      {contact.phone}
                    </span>
                  )}
                  {contact.email && (
                    <span className="flex items-center gap-1">
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

          {/* Campo de Descrição */}
          <div className="mt-6">
            <label className="text-sm font-medium text-text-primary mb-2 block">
              Descrição / Notas
            </label>
            <div className="flex gap-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione informações sobre este lead..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                rows={3}
              />
              <button
                onClick={handleSaveDescription}
                disabled={isSavingDescription}
                className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50"
              >
                {isSavingDescription ? (
                  <i className="fi fi-rr-spinner animate-spin"></i>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-subtitle font-semibold text-text-primary mb-4">Conversas</h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                  <i className="fi fi-rr-comment-slash text-4xl text-text-secondary mb-2"></i>
                  <p className="text-body text-text-secondary">Nenhuma conversa encontrada</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-background rounded-xl p-4"
                  >
                    {/* Header da Conversa */}
                    <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <i className={`fi ${getChannelIcon(contact.channel?.type)} text-brand`}></i>
                        <span className="text-sm font-medium text-text-primary">
                          {contact.channel?.identifier || 'Canal desconhecido'}
                        </span>
                      </div>
                      {conversation.current_agent && (
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <i className="fi fi-rr-user"></i>
                          <span>{conversation.current_agent.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Mensagens */}
                    {conversation.messages && conversation.messages.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {conversation.messages.map((message) => {
                          const isInbound = message.direction === 'inbound';
                          const messageText = typeof message.content === 'string'
                            ? message.content
                            : message.content?.text || message.content?.body || 'Mensagem';

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isInbound
                                    ? 'bg-white border border-gray-200'
                                    : 'bg-brand text-white'
                                }`}
                              >
                                {/* Sender */}
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-medium ${
                                    isInbound ? 'text-text-secondary' : 'text-white/80'
                                  }`}>
                                    {isInbound ? contact.name || contact.phone || 'Cliente' : message.sender}
                                  </span>
                                  <span className={`text-xs ${
                                    isInbound ? 'text-text-secondary' : 'text-white/60'
                                  }`}>
                                    {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                
                                {/* Content */}
                                <p className={`text-sm ${
                                  isInbound ? 'text-text-primary' : 'text-white'
                                }`}>
                                  {messageText}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary text-center py-4">
                        Nenhuma mensagem nesta conversa
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-background">
          <Button onClick={onClose} className="btn-secondary w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
