'use client';

import { useState, useEffect, useRef } from 'react';
import { Contact, Conversation, useContacts } from '@/hooks/use-contacts';
import { ChatHeader } from './chat-header';
import { ChatMessageBubble } from './chat-message-bubble';

interface ChatModalProps {
  contact: Contact;
  onClose: () => void;
}

export function ChatModal({ contact, onClose }: ChatModalProps) {
  const { getConversations } = useContacts();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, [contact.id]);

  // Scroll para o fundo quando carrega ou novas mensagens
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversations, isLoading]);

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

  // Fundo estilo WhatsApp (padrão geométrico sutil)
  // Vamos usar uma cor sólida #EFEAE2 que é a cor de fundo padrão do WhatsApp Web se não tiver imagem
  const backgroundStyle = {
    backgroundColor: '#EFEAE2',
    backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
    backgroundOpacity: 0.4,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <ChatHeader 
          name={contact.name || 'Contato sem nome'} 
          phone={contact.phone} 
          onClose={onClose} 
        />

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto relative"
          style={{ backgroundColor: '#EFEAE2' }}
        >
          {/* Background Pattern Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{ 
              backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
              backgroundRepeat: 'repeat'
            }}
          />

          <div className="relative z-10 p-4 sm:px-12 sm:py-6 min-h-full flex flex-col justify-end">
            {isLoading ? (
              <div className="flex items-center justify-center flex-1">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A884]"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-500">
                <div className="bg-[#F0F2F5] rounded-full p-4 mb-2">
                  <i className="fi fi-rr-comment-slash text-2xl text-[#54656F]"></i>
                </div>
                <p className="text-sm">Nenhuma mensagem trocada ainda.</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div key={conversation.id} className="space-y-1">
                  {/* Data Divider (Opcional, simplificado aqui) */}
                  {/* <div className="flex justify-center my-4">
                    <span className="bg-white/80 text-[#54656F] text-xs px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 uppercase font-medium">
                      Hoje
                    </span>
                  </div> */}

                  {conversation.messages && conversation.messages.map((message) => (
                    <ChatMessageBubble
                      key={message.id}
                      content={message.content}
                      direction={message.direction as 'inbound' | 'outbound'}
                      createdAt={message.created_at}
                      sender={message.sender}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer (Opcional - apenas visual por enquanto já que é read-only) */}
        <div className="p-3 bg-[#F0F2F5] border-t border-[#E2E4E8] flex items-center gap-4">
           <div className="flex items-center gap-4 text-[#54656F]">
              <i className="fi fi-rr-smile text-2xl cursor-not-allowed opacity-50"></i>
              <i className="fi fi-rr-clip text-2xl cursor-not-allowed opacity-50"></i>
           </div>
           <div className="flex-1 bg-white rounded-lg border border-transparent h-10 px-4 flex items-center text-sm text-gray-400 cursor-not-allowed select-none">
              Mensagens são apenas leitura por enquanto
           </div>
           <div className="text-[#54656F]">
              <i className="fi fi-rr-microphone text-2xl cursor-not-allowed opacity-50"></i>
           </div>
        </div>
      </div>
    </div>
  );
}
