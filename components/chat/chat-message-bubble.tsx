'use client';

interface ChatMessageBubbleProps {
  content: string | { text?: string; body?: string };
  direction: 'inbound' | 'outbound';
  createdAt: string;
  sender?: string;
}

export function ChatMessageBubble({ content, direction, createdAt, sender }: ChatMessageBubbleProps) {
  const isInbound = direction === 'inbound';
  const messageText = typeof content === 'string'
    ? content
    : content?.text || content?.body || 'Mensagem';

  // Cores estilo WhatsApp
  // Inbound: Branco (#FFFFFF)
  // Outbound: Verde claro (#E7FFDB) -> aproximando com bg-green-100 ou custom
  const bubbleClass = isInbound
    ? 'bg-white text-gray-800 rounded-tl-none'
    : 'bg-[#E7FFDB] text-gray-800 rounded-tr-none';

  return (
    <div className={`flex ${isInbound ? 'justify-start' : 'justify-end'} mb-2`}>
      <div className={`
        max-w-[75%] rounded-lg px-3 py-1.5 shadow-sm text-[14.2px] leading-[19px] relative
        ${bubbleClass}
      `}>
        {/* Sender Name (apenas em grupos ou se relevante, mas aqui simplificado) */}
        {/* <div className="text-xs font-medium text-orange-500 mb-1">Sender Name</div> */}
        
        {/* Content */}
        <div className="break-words whitespace-pre-wrap">
          {messageText}
        </div>
        
        {/* Time and Status */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-gray-500">
            {new Date(createdAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {/* Status Checks (simulado para outbound) */}
          {!isInbound && (
             <i className="fi fi-rr-check-double text-[10px] text-[#53bdeb]"></i>
          )}
        </div>
      </div>
    </div>
  );
}
