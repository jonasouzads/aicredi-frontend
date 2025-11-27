'use client';

import { useEffect, useState, useCallback } from 'react';
import { useContacts, Contact } from '@/hooks/use-contacts';
import { useChannels } from '@/hooks/use-channels';
import { useAgents } from '@/hooks/use-agents';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/shared/page-header';
import { SearchInput } from '@/components/shared/search-input';
import { KanbanColumn } from '@/components/kanban/kanban-column';
import { KanbanSkeleton } from '@/components/kanban/kanban-skeleton';
import { ContactDetailsCard } from '@/components/kanban/contact-details-card';
import { ChatModal } from '@/components/chat/chat-modal';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const { channels } = useChannels();
  const { agents } = useAgents();
  const toast = useToast();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [localKanbanData, setLocalKanbanData] = useState(kanbanData);
  const [localKanbanCounts, setLocalKanbanCounts] = useState(kanbanCounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
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
    setShowChat(false);
  };

  const handleOpenChat = () => {
    setShowChat(true);
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

  // Verificar se há filtros ativos (excluindo "all")
  const hasActiveChannelFilter = selectedChannelId && selectedChannelId !== 'all';
  const hasActiveAgentFilter = selectedAgentId && selectedAgentId !== 'all';

  // Filtrar dados localmente quando houver busca, canal ou agent selecionado
  const filteredKanbanData = useCallback(() => {
    if (!localKanbanData) return localKanbanData;
    
    // Se não há filtros, retornar dados originais
    if (!debouncedSearch && !hasActiveChannelFilter && !hasActiveAgentFilter) {
      return localKanbanData;
    }

    const searchLower = debouncedSearch.toLowerCase();
    
    const filterContacts = (contacts: Contact[]) => 
      contacts.filter(contact => {
        // Filtro por busca (nome ou telefone)
        const matchesSearch = !debouncedSearch || 
          contact.name?.toLowerCase().includes(searchLower) ||
          contact.phone?.toLowerCase().includes(searchLower);
        
        // Filtro por canal
        const matchesChannel = !hasActiveChannelFilter || 
          contact.channel_id === selectedChannelId;
        
        // Filtro por agent (verifica current_agent_id nas conversas do contato)
        const matchesAgent = !hasActiveAgentFilter || 
          contact.conversations?.some((conv: any) => conv.current_agent_id === selectedAgentId);
        
        return matchesSearch && matchesChannel && matchesAgent;
      });

    return {
      new: filterContacts(localKanbanData.new),
      analysis: filterContacts(localKanbanData.analysis),
      rejected: filterContacts(localKanbanData.rejected),
      approved: filterContacts(localKanbanData.approved),
      closed: filterContacts(localKanbanData.closed),
    };
  }, [localKanbanData, debouncedSearch, hasActiveChannelFilter, hasActiveAgentFilter, selectedChannelId, selectedAgentId]);

  const displayData = filteredKanbanData();

  if (isLoading) {
    return <KanbanSkeleton />;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <PageHeader
          title="Kanban de Leads"
          description="Gerencie seus contatos por estágio do funil"
        />
      </div>
      
      {/* Barra de Filtros */}
      <div className="flex-shrink-0 mb-4 flex flex-wrap items-center gap-3">
        {/* Filtros à esquerda */}
        <Select value={selectedChannelId} onValueChange={setSelectedChannelId}>
          <SelectTrigger className="w-[160px] h-[42px] bg-surface border border-border rounded-xl px-3">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent className="min-w-[200px]">
            <SelectItem value="all">Todos os canais</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.identifier || channel.name || channel.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
          <SelectTrigger className="w-[160px] h-[42px] bg-surface border border-border rounded-xl px-3">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent className="min-w-[200px]">
            <SelectItem value="all">Todos os agents</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Botão limpar filtros */}
        {(searchTerm || hasActiveChannelFilter || hasActiveAgentFilter) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedChannelId('');
              setSelectedAgentId('');
            }}
            className="h-[42px] flex items-center gap-1.5 px-3 text-sm text-text-secondary hover:text-text-primary bg-surface border border-border rounded-xl hover:bg-surface-hover transition-colors"
            title="Limpar filtros"
          >
            <i className="fi fi-rr-cross-small"></i>
            Limpar
          </button>
        )}

        {/* Busca por texto à direita */}
        <div className="flex-1 min-w-[200px]">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nome ou telefone..."
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto flex-1 min-h-0">
        {displayData && (
          <>
            <KanbanColumn
              title="Novos Leads"
              icon="fi-rr-user-add"
              status="new"
              contacts={displayData.new}
              totalCount={localKanbanCounts?.new || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onToggleAi={handleToggleAi}
            />
            <KanbanColumn
              title="Em Análise"
              icon="fi-rr-hourglass"
              status="analysis"
              contacts={displayData.analysis}
              totalCount={localKanbanCounts?.analysis || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onToggleAi={handleToggleAi}
            />
            <KanbanColumn
              title="Negada"
              icon="fi-rr-cross-circle"
              status="rejected"
              contacts={displayData.rejected}
              totalCount={localKanbanCounts?.rejected || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onToggleAi={handleToggleAi}
            />
            <KanbanColumn
              title="Aprovada"
              icon="fi-rr-check-circle"
              status="approved"
              contacts={displayData.approved}
              totalCount={localKanbanCounts?.approved || 0}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              onToggleAi={handleToggleAi}
            />
            <KanbanColumn
              title="Concluído"
              icon="fi-rr-flag"
              status="closed"
              contacts={displayData.closed}
              totalCount={localKanbanCounts?.closed || 0}
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

      {/* Contact Details Card */}
      {selectedContact && !showChat && (
        <ContactDetailsCard
          contact={selectedContact}
          onClose={handleCloseDetails}
          onOpenChat={handleOpenChat}
        />
      )}

      {/* Chat Modal */}
      {selectedContact && showChat && (
        <ChatModal
          contact={selectedContact}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}
