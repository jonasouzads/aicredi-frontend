'use client';

import { useState, useEffect } from 'react';
import { api, Contact, Conversation, Message, KanbanData, KanbanCounts } from '@/lib/api';

// Re-exportar tipos para compatibilidade
export type { Contact, Conversation, Message, KanbanData, KanbanCounts };

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null);
  const [kanbanCounts, setKanbanCounts] = useState<KanbanCounts | null>(null);
  const [kanbanPage, setKanbanPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async (status?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getContacts(status ? { status } : undefined);
      setContacts(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar contatos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKanbanCounts = async () => {
    try {
      const counts = await api.getKanbanCounts();
      setKanbanCounts(counts);
    } catch (err: any) {
      console.error('Erro ao buscar contagem:', err);
    }
  };

  const fetchKanban = async (reset: boolean = true) => {
    try {
      if (reset) {
        setIsLoading(true);
        setKanbanPage(1);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }
      
      setError(null);
      
      const page = reset ? 1 : kanbanPage + 1;
      const data = await api.getKanban(page, 50);
      
      if (reset) {
        setKanbanData(data);
        // Buscar contagem total
        await fetchKanbanCounts();
      } else {
        // Append aos dados existentes (removendo duplicatas)
        setKanbanData((prev) => {
          if (!prev) return data;
          
          // Função para remover duplicatas por ID
          const mergeUnique = (existing: any[], newItems: any[]) => {
            const existingIds = new Set(existing.map(item => item.id));
            const uniqueNew = newItems.filter(item => !existingIds.has(item.id));
            return [...existing, ...uniqueNew];
          };
          
          return {
            lead: mergeUnique(prev.lead, data.lead),
            in_progress: mergeUnique(prev.in_progress, data.in_progress),
            completed: mergeUnique(prev.completed, data.completed),
          };
        });
        setKanbanPage(page);
      }
      
      // Verificar se tem mais dados
      const totalLoaded = (data.lead.length + data.in_progress.length + data.completed.length);
      if (totalLoaded < 50) {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados do kanban');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchKanban(false);
    }
  };

  const getContact = async (id: string) => {
    try {
      return await api.getContact(id);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao buscar contato');
    }
  };

  const getConversations = async (contactId: string) => {
    try {
      return await api.getContactConversations(contactId);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao buscar conversas');
    }
  };

  const createContact = async (contactData: Partial<Contact>) => {
    try {
      const newContact = await api.createContact(contactData);
      setContacts((prev) => [newContact, ...prev]);
      return newContact;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar contato');
    }
  };

  const updateContact = async (id: string, contactData: Partial<Contact>) => {
    try {
      const updatedContact = await api.updateContact(id, contactData);
      setContacts((prev) =>
        prev.map((contact) => (contact.id === id ? updatedContact : contact))
      );
      return updatedContact;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao atualizar contato');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const updatedContact = await api.updateContactStatus(id, status);
      
      // Atualizar no kanban se estiver carregado
      if (kanbanData) {
        const newKanbanData = { ...kanbanData };
        
        // Remover de todas as colunas
        Object.keys(newKanbanData).forEach((key) => {
          newKanbanData[key as keyof KanbanData] = newKanbanData[key as keyof KanbanData].filter(
            (c) => c.id !== id
          );
        });
        
        // Adicionar na coluna correta
        if (newKanbanData[status as keyof KanbanData]) {
          newKanbanData[status as keyof KanbanData].push(updatedContact);
        }
        
        setKanbanData(newKanbanData);
      }
      
      return updatedContact;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao atualizar status');
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
      
      // Remover do kanban se estiver carregado
      if (kanbanData) {
        const newKanbanData = { ...kanbanData };
        Object.keys(newKanbanData).forEach((key) => {
          newKanbanData[key as keyof KanbanData] = newKanbanData[key as keyof KanbanData].filter(
            (c) => c.id !== id
          );
        });
        setKanbanData(newKanbanData);
      }
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao deletar contato');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    kanbanData,
    kanbanCounts,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    fetchContacts,
    fetchKanban,
    loadMore,
    getContact,
    getConversations,
    createContact,
    updateContact,
    updateStatus,
    deleteContact,
  };
}
