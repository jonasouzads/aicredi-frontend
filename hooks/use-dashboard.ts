'use client';

import { useState, useEffect } from 'react';
import { apiClient, Activity, DashboardStats } from '@/lib/api';

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    activeAgents: 0,
    totalChannels: 0,
    activeChannels: 0,
    totalCredentials: 0,
    totalMessages: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados em paralelo
      const [statsData, activitiesData] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getRecentActivity(5),
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    activities,
    loading,
    error,
    refetch: fetchData,
  };
}
