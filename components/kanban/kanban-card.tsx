'use client';

import { Contact } from '@/hooks/use-contacts';
import { useState, useEffect } from 'react';

interface KanbanCardProps {
  contact: Contact;
  onViewDetails: (contact: Contact) => void;
  onToggleAi?: (phone: string, active: boolean) => Promise<void>;
  aiPaused?: boolean;
}

export function KanbanCard({ contact, onViewDetails, onToggleAi, aiPaused = false }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTogglingAi, setIsTogglingAi] = useState(false);
  const [localAiPaused, setLocalAiPaused] = useState(aiPaused);

  // Sincronizar com prop quando ela mudar (após refetch)
  useEffect(() => {
    setLocalAiPaused(aiPaused);
  }, [aiPaused]);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('contactId', contact.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleToggleAi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contact.phone || !onToggleAi) return;

    setIsTogglingAi(true);
    try {
      // Optimistic update
      const currentlyActive = !localAiPaused; // Se não está pausado, está ativo
      setLocalAiPaused(!localAiPaused);
      await onToggleAi(contact.phone, currentlyActive);
    } catch (error) {
      // Revert on error
      setLocalAiPaused(localAiPaused);
      console.error('Error toggling AI:', error);
    } finally {
      setIsTogglingAi(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onViewDetails(contact)}
      className={`
        bg-white rounded-lg p-3 mb-2 cursor-pointer
        hover:bg-brand-50
        transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-2' : ''}
        ${localAiPaused ? 'border-l-4 border-orange-400' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Nome */}
          <h3 className="text-sm font-medium text-text-primary mb-1 truncate">
            {contact.name || 'Sem nome'}
          </h3>
          
          {/* Telefone */}
          {contact.phone && (
            <p className="text-xs text-text-secondary truncate">
              {contact.phone}
            </p>
          )}
        </div>

        {/* Botão Pausar/Ativar IA */}
        {contact.phone && onToggleAi && (
          <button
            onClick={handleToggleAi}
            disabled={isTogglingAi}
            className={`
              flex-shrink-0 p-1.5 rounded-md transition-colors
              ${localAiPaused 
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
              }
              ${isTogglingAi ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            title={localAiPaused ? 'Ativar IA' : 'Pausar IA'}
          >
            {isTogglingAi ? (
              <i className="fi fi-rr-spinner text-xs animate-spin"></i>
            ) : localAiPaused ? (
              <i className="fi fi-rr-play text-xs"></i>
            ) : (
              <i className="fi fi-rr-pause text-xs"></i>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
