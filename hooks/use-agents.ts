import { useState, useEffect } from 'react';
import { apiClient, Agent, CreateAgentDto } from '@/lib/api';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAgents();
      setAgents(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar agents:', err);
      setError(err.message || 'Erro ao carregar agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const getAgent = async (id: string): Promise<Agent> => {
    try {
      return await apiClient.getAgent(id);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao buscar agent');
    }
  };

  const createAgent = async (data: CreateAgentDto) => {
    try {
      const newAgent = await apiClient.createAgent(data);
      await fetchAgents(); // Recarregar lista
      return newAgent;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar agent');
    }
  };

  const updateAgent = async (id: string, data: Partial<CreateAgentDto>) => {
    try {
      const updatedAgent = await apiClient.updateAgent(id, data);
      await fetchAgents(); // Recarregar lista
      return updatedAgent;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao atualizar agent');
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      await apiClient.deleteAgent(id);
      await fetchAgents(); // Recarregar lista
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao deletar agent');
    }
  };

  return {
    agents,
    loading,
    error,
    getAgent,
    createAgent,
    updateAgent,
    deleteAgent,
    refetch: fetchAgents,
  };
}
