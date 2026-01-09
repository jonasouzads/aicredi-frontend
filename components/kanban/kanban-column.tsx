'use client';

import { Contact } from '@/hooks/use-contacts';
import { KanbanCard } from './kanban-card';
import { useState } from 'react';

interface KanbanColumnProps {
  title: string;
  icon: string;
  status: string;
  contacts: Contact[];
  totalCount: number;
  onStatusChange: (contactId: string, newStatus: string) => void;
  onViewDetails: (contact: Contact) => void;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
  onToggleAi?: (phone: string, active: boolean) => Promise<void>;
}

export function KanbanColumn({
  title,
  icon,
  status,
  contacts,
  totalCount,
  onStatusChange,
  onViewDetails,
  onLoadMore,
  isLoadingMore,
  hasMore,
  onToggleAi,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const contactId = e.dataTransfer.getData('contactId');
    if (contactId) {
      onStatusChange(contactId, status);
    }
  };

  const getColumnBg = () => {
    // Fundo neutro para melhor legibilidade e contraste
    return 'bg-[#F6F7F9]';
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPercentage = (target.scrollTop + target.clientHeight) / target.scrollHeight;
    
    // Carregar mais quando chegar a 80% do scroll (prefetch)
    if (scrollPercentage >= 0.8 && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;
    const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    const isAtTop = target.scrollTop === 0;

    // Prevenir propagação do scroll quando estiver no limite
    if ((isAtBottom && isScrollingDown) || (isAtTop && isScrollingUp)) {
      e.stopPropagation();
    }
  };

  return (
    <div className={`flex flex-col flex-shrink-0 w-full sm:w-[320px] rounded-xl ${getColumnBg()} p-3 h-full`}>
      {/* Column Header */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <i className={`fi ${icon} text-lg`} aria-hidden="true"></i>
            {title}
          </h2>
          <span className="text-xs text-text-secondary bg-white px-2 py-1 rounded font-medium" aria-label={`${totalCount} contatos`}>
            {totalCount}
          </span>
        </div>
      </div>

      {/* Drop Zone com Scroll Infinito */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onScroll={handleScroll}
        onWheel={handleWheel}
        role="region"
        aria-label={`Coluna ${title}`}
        className={`
          flex-1 overflow-y-auto rounded-lg transition-all kanban-scroll
          ${isDragOver ? 'bg-brand-100 border-2 border-dashed border-brand' : ''}
        `}
      >
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center" role="status">
            <i className="fi fi-rr-inbox text-4xl text-text-secondary mb-2" aria-hidden="true"></i>
            <p className="text-body text-text-secondary">Nenhum contato</p>
          </div>
        ) : (
          <>
            {contacts.map((contact) => (
              <KanbanCard
                key={contact.id}
                contact={contact}
                onViewDetails={onViewDetails}
                onToggleAi={onToggleAi}
                aiPaused={contact.conversations?.[0]?.ai_paused || false}
              />
            ))}
            
            {/* Loading Indicator */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-4" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand" aria-hidden="true"></div>
                <span className="sr-only">Carregando mais contatos...</span>
              </div>
            )}
            
            {/* End Message */}
            {!hasMore && contacts.length > 0 && (
              <div className="text-center py-4 text-xs text-text-secondary" role="status">
                Todos os contatos carregados
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
