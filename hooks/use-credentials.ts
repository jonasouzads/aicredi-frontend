import { useState, useEffect } from 'react';
import { apiClient, Credential, CreateCredentialDto } from '@/lib/api';

export function useCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCredentials();
      setCredentials(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar credenciais:', err);
      setError(err.message || 'Erro ao carregar credenciais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const createCredential = async (data: CreateCredentialDto) => {
    try {
      const newCredential = await apiClient.createCredential(data);
      await fetchCredentials(); // Recarregar lista
      return newCredential;
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao criar credencial');
    }
  };

  const deleteCredential = async (id: string) => {
    try {
      await apiClient.deleteCredential(id);
      await fetchCredentials(); // Recarregar lista
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao deletar credencial');
    }
  };

  return {
    credentials,
    loading,
    error,
    createCredential,
    deleteCredential,
    refetch: fetchCredentials,
  };
}
