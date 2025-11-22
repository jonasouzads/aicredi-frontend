'use client';

import { useEffect, useState, useCallback } from 'react';
import { useContacts, Contact } from '@/hooks/use-contacts';
import { useToast } from '@/components/ui/toast';
import { KanbanColumn } from '@/components/kanban/kanban-column';
import { KanbanSkeleton } from '@/components/kanban/kanban-skeleton';
import { ContactDetailsModal } from '@/components/kanban/contact-details-modal';
import { useDebounce } from '@/hooks/use-debounce';

export default function KanbanPage() {
  const { 
    kanbanData, 
    kanbanCounts, 
    isLoading, 
    isLoadingMore,
    hasMore,
    fetchKanban, 
    loadMore,
    updateStatus,
    toggleAiStatus 
  } = useContacts();
  const toast = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [localKanbanData, setLocalKanbanData] = useState(kanbanData);
  const [localKanbanCounts, setLocalKanbanCounts] = useState(kanbanCounts);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

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

  const handleToggleAi = useCallback(async (phone: string, currentlyActive: boolean) => {
    try {
      await toggleAiStatus(phone, !currentlyActive);
      toast.success(
        currentlyActive ? 'IA pausada' : 'IA ativada',
        `A IA foi ${currentlyActive ? 'pausada' : 'ativada'} para este contato`
      );
      // Refetch para atualizar estado visual
      await fetchKanban(false);
    } catch (error: any) {
      toast.error('Erro', error.message);
      throw error;
    }
  }, [toggleAiStatus, toast, fetchKanban]);

  // Filtrar dados localmente quando houver busca
  const filteredKanbanData = useCallback(() => {
    if (!localKanbanData || !debouncedSearch) return localKanbanData;

    const searchLower = debouncedSearch.toLowerCase();
    const filterContacts = (contacts: Contact[]) => 
      contacts.filter(contact => 
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.phone?.toLowerCase().includes(searchLower)
      );

    return {
      lead: filterContacts(localKanbanData.lead),
      in_progress: filterContacts(localKanbanData.in_progress),
      completed: filterContacts(localKanbanData.completed),
    };
  }, [localKanbanData, debouncedSearch]);

  const displayData = filteredKanbanData();

  if (isLoading) {
    return <KanbanSkeleton />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-display text-text-primary mb-2">Kanban de Leads</h1>
            <p className="text-body text-text-secondary">
              Gerencie seus contatos por estágio do funil
            </p>
          </div>
        </div>
        
        {/* Barra de Busca */}
        <div className="relative">
          <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"></i>
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <i className="fi fi-rr-cross-small"></i>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto flex-1 pb-6">
        {displayData && (
          <>
            <KanbanColumn
              title="Novos Leads"
              icon="fi-rr-user-add"
              status="lead"
              contacts={displayData.lead}
              totalCount={localKanbanCounts?.lead || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onToggleAi={handleToggleAi}
            />
            <KanbanColumn
              title="Em Atendimento"
              icon="fi-rr-time-forward"
              status="in_progress"
              contacts={displayData.in_progress}
              totalCount={localKanbanCounts?.in_progress || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onToggleAi={handleToggleAi}
            />
            <KanbanColumn
              title="Concluídos"
              icon="fi-rr-check-circle"
              status="completed"
              contacts={displayData.completed}
              totalCount={localKanbanCounts?.completed || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onToggleAi={handleToggleAi}
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
