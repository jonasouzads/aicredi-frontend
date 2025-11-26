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
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center">
                <i className="fi fi-rr-user text-lg text-brand"></i>
              </div>
              <div>
                <h2 className="text-base font-semibold text-text-primary">
                  {contact.name || 'Sem nome'}
                </h2>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  {contact.phone && (
                    <span>{contact.phone}</span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            >
              <i className="fi fi-rr-cross text-lg"></i>
            </button>
          </div>
        </div>

        {/* Content - Chat */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
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
                  <div key={conversation.id}>
                    {/* Mensagens */}
                    {conversation.messages && conversation.messages.length > 0 ? (
                      <div className="space-y-2">
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
                                className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                                  isInbound
                                    ? 'bg-white'
                                    : 'bg-brand text-white'
                                }`}
                              >
                                {/* Content */}
                                <p className={`text-sm leading-relaxed ${
                                  isInbound ? 'text-text-primary' : 'text-white'
                                }`}>
                                  {messageText}
                                </p>
                                
                                {/* Time */}
                                <span className={`text-[10px] mt-1 block ${
                                  isInbound ? 'text-text-secondary' : 'text-white/70'
                                }`}>
                                  {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
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
