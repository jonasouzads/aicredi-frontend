'use client';

import { Contact, Conversation, useContacts } from '@/hooks/use-contacts';
import { Button } from '@/components/ui/button';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useState, useEffect, useCallback } from 'react';

interface ContactDetailsModalProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetailsModal({ contact, onClose }: ContactDetailsModalProps) {
  const { getConversations } = useContacts();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useFocusTrap<HTMLDivElement>(true);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getConversations(contact.id);
      setConversations(data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [contact.id, getConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div 
        ref={modalRef}
        className="modal-container-lg flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center">
                <i className="fi fi-rr-user text-lg text-brand"></i>
              </div>
              <div>
                <h2 id="contact-modal-title" className="text-base font-semibold text-text-primary">
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
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Fechar modal"
            >
              <i className="fi fi-rr-cross text-lg text-text-secondary" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Content - Chat */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted">
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
                                    ? 'bg-surface'
                                    : 'bg-brand text-primary-foreground'
                                }`}
                              >
                                {/* Content */}
                                <p className={`text-sm leading-relaxed ${
                                  isInbound ? 'text-text-primary' : 'text-primary-foreground'
                                }`}>
                                  {messageText}
                                </p>
                                
                                {/* Time */}
                                <span className={`text-[10px] mt-1 block ${
                                  isInbound ? 'text-text-secondary' : 'text-primary-foreground/70'
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
