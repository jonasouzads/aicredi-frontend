'use client';

import { useEffect, useState } from 'react';
import { useContacts, Contact } from '@/hooks/use-contacts';
import { useToast } from '@/components/ui/toast';
import { KanbanColumn } from '@/components/kanban/kanban-column';
import { KanbanSkeleton } from '@/components/kanban/kanban-skeleton';
import { ContactDetailsModal } from '@/components/kanban/contact-details-modal';

export default function KanbanPage() {
  const { 
    kanbanData, 
    kanbanCounts, 
    isLoading, 
    isLoadingMore,
    hasMore,
    fetchKanban, 
    loadMore,
    updateStatus 
  } = useContacts();
  const toast = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [localKanbanData, setLocalKanbanData] = useState(kanbanData);
  const [localKanbanCounts, setLocalKanbanCounts] = useState(kanbanCounts);

  useEffect(() => {
    fetchKanban();
  }, []);

  // Sincronizar dados locais com dados do servidor
  useEffect(() => {
    if (kanbanData) {
      setLocalKanbanData(kanbanData);
    }
  }, [kanbanData]);

  useEffect(() => {
    if (kanbanCounts) {
      setLocalKanbanCounts(kanbanCounts);
    }
  }, [kanbanCounts]);

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    if (!localKanbanData || !localKanbanCounts) return;

    // 1. Encontrar o contato em todas as colunas
    let movedContact: Contact | null = null;
    let oldStatus: string | null = null;

    const newKanbanData = { ...localKanbanData };
    
    // Procurar e remover de todas as colunas
    Object.keys(newKanbanData).forEach((key) => {
      const columnKey = key as keyof typeof newKanbanData;
      const contactIndex = newKanbanData[columnKey].findIndex((c) => c.id === contactId);
      
      if (contactIndex !== -1) {
        movedContact = newKanbanData[columnKey][contactIndex];
        oldStatus = key;
        newKanbanData[columnKey] = newKanbanData[columnKey].filter((c) => c.id !== contactId);
      }
    });

    if (!movedContact) return;

    // 2. Atualizar o status do contato
    const updatedContact: Contact = {
      ...(movedContact as Contact),
      fields: {
        ...((movedContact as Contact).fields || {}),
        status: newStatus,
      },
    };

    // 3. Adicionar na nova coluna (ATUALIZAÇÃO OTIMISTA)
    if (newKanbanData[newStatus as keyof typeof newKanbanData]) {
      newKanbanData[newStatus as keyof typeof newKanbanData].unshift(updatedContact);
    }

    // 4. Atualizar contagem otimista
    const newCounts = { ...localKanbanCounts };
    if (oldStatus && oldStatus in newCounts) {
      newCounts[oldStatus as keyof typeof newCounts]--;
    }
    if (newStatus in newCounts) {
      newCounts[newStatus as keyof typeof newCounts]++;
    }

    // 5. Atualizar UI imediatamente
    setLocalKanbanData(newKanbanData);
    setLocalKanbanCounts(newCounts);

    // 6. Atualizar no servidor em segundo plano
    try {
      await updateStatus(contactId, newStatus);
      // Sucesso silencioso - já movemos o card
    } catch (error: any) {
      // 7. Se falhar, reverter a mudança
      toast.error('Erro ao atualizar status', 'Revertendo alteração...');
      
      // Reverter: remover da nova coluna
      const revertedData = { ...newKanbanData };
      revertedData[newStatus as keyof typeof revertedData] = revertedData[newStatus as keyof typeof revertedData].filter(
        (c) => c.id !== contactId
      );
      
      // Adicionar de volta na coluna original
      if (oldStatus && revertedData[oldStatus as keyof typeof revertedData]) {
        revertedData[oldStatus as keyof typeof revertedData].unshift(movedContact);
      }
      
      // Reverter contagem
      setLocalKanbanData(revertedData);
      setLocalKanbanCounts(localKanbanCounts);
    }
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDetails = () => {
    setSelectedContact(null);
  };

  if (isLoading) {
    return <KanbanSkeleton />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-display text-text-primary mb-2">Kanban de Leads</h1>
          <p className="text-body text-text-secondary">
            Gerencie seus contatos por estágio do funil
          </p>
        </div>
        <button
          onClick={() => fetchKanban()}
          className="btn-secondary flex items-center gap-2"
        >
          <i className="fi fi-rr-refresh"></i>
          Atualizar
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto flex-1 pb-6">
        {localKanbanData && (
          <>
            <KanbanColumn
              title="Novos Leads"
              icon="fi-rr-user-add"
              status="lead"
              contacts={localKanbanData.lead}
              totalCount={localKanbanCounts?.lead || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
            />
            <KanbanColumn
              title="Em Atendimento"
              icon="fi-rr-time-forward"
              status="in_progress"
              contacts={localKanbanData.in_progress}
              totalCount={localKanbanCounts?.in_progress || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
            />
            <KanbanColumn
              title="Concluídos"
              icon="fi-rr-check-circle"
              status="completed"
              contacts={localKanbanData.completed}
              totalCount={localKanbanCounts?.completed || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
            />
          </>
        )}
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
