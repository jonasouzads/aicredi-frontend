'use client';

import { Contact } from '@/hooks/use-contacts';
import { useState } from 'react';

interface KanbanCardProps {
  contact: Contact;
  onViewDetails: (contact: Contact) => void;
}

export function KanbanCard({ contact, onViewDetails }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('contactId', contact.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
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
      `}
    >
      {/* Nome */}
      <h3 className="text-sm font-medium text-text-primary mb-1">
        {contact.name || 'Sem nome'}
      </h3>
      
      {/* Telefone */}
      {contact.phone && (
        <p className="text-xs text-text-secondary">
          {contact.phone}
        </p>
      )}
    </div>
  );
}
