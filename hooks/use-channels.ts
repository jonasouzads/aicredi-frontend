import { useState, useEffect } from 'react';
import { apiClient, Channel, CreateChannelDto, ChannelAgent, AddAgentToChannelDto } from '@/lib/api';

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getChannels();
      setChannels(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar canais:', err);
      setError(err.message || 'Erro ao carregar canais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const createChannel = async (data: CreateChannelDto) => {
    try {
      const newChannel = await apiClient.createChannel(data);
      await fetchChannels(); // Recarregar lista
      return newChannel;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar canal');
    }
  };

  const updateChannel = async (id: string, data: Partial<CreateChannelDto>) => {
    try {
      await apiClient.updateChannel(id, data);
      await fetchChannels(); // Recarregar lista
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao atualizar canal');
    }
  };

  const deleteChannel = async (id: string) => {
    try {
      await apiClient.deleteChannel(id);
      await fetchChannels(); // Recarregar lista
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao deletar canal');
    }
  };

  const getChannelAgents = async (channelId: string): Promise<ChannelAgent[]> => {
    try {
      return await apiClient.getChannelAgents(channelId);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao buscar agents do canal');
    }
  };

  const addAgentsToChannel = async (channelId: string, agents: AddAgentToChannelDto[]) => {
    try {
      return await apiClient.addAgentsToChannel(channelId, agents);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao adicionar agents ao canal');
    }
  };

  const removeAgentFromChannel = async (channelId: string, agentId: string) => {
    try {
      await apiClient.removeAgentFromChannel(channelId, agentId);
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao remover agent do canal');
    }
  };

  return {
    channels,
    loading,
    error,
    createChannel,
    updateChannel,
    deleteChannel,
    getChannelAgents,
    addAgentsToChannel,
    removeAgentFromChannel,
    refetch: fetchChannels,
  };
}
