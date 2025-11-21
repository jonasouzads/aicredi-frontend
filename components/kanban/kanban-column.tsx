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

  const getColumnBg = (status: string) => {
    switch (status) {
      case 'lead':
        return 'bg-gradient-to-b from-brand-50 to-background';
      case 'in_progress':
        return 'bg-gradient-to-b from-accent-50 to-background';
      case 'completed':
        return 'bg-gradient-to-b from-green-50 to-background';
      default:
        return 'bg-background';
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPercentage = (target.scrollTop + target.clientHeight) / target.scrollHeight;
    
    // Carregar mais quando chegar a 80% do scroll (prefetch)
    if (scrollPercentage >= 0.8 && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  };

  return (
    <div className={`flex-1 min-w-[300px] max-w-[300px] rounded-xl ${getColumnBg(status)} p-3`}>
      {/* Column Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          <span className="text-xs text-text-secondary bg-white px-2 py-1 rounded font-medium">
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
        className={`
          min-h-[calc(100vh-280px)] max-h-[calc(100vh-280px)] 
          overflow-y-auto rounded-lg transition-all
          ${isDragOver ? 'bg-brand-100 border-2 border-dashed border-brand' : ''}
        `}
      >
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <i className="fi fi-rr-inbox text-4xl text-text-secondary mb-2"></i>
            <p className="text-body text-text-secondary">Nenhum contato</p>
          </div>
        ) : (
          <>
            {contacts.map((contact) => (
              <KanbanCard
                key={contact.id}
                contact={contact}
                onViewDetails={onViewDetails}
              />
            ))}
            
            {/* Loading Indicator */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
              </div>
            )}
            
            {/* End Message */}
            {!hasMore && contacts.length > 0 && (
              <div className="text-center py-4 text-xs text-text-secondary">
                Todos os contatos carregados
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
