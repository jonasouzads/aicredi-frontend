'use client';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { stats, activities, loading, error } = useDashboard();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    if (hours < 24) return `Há ${hours} hora${hours !== 1 ? 's' : ''}`;
    if (days === 1) return 'Ontem';
    return `Há ${days} dias`;
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="animate-pulse bg-background rounded h-8 w-64 mb-2"></div>
          <div className="animate-pulse bg-background rounded h-4 w-96"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="animate-pulse bg-background rounded h-4 w-24"></div>
                <div className="animate-pulse bg-background rounded-xl w-10 h-10"></div>
              </div>
              <div className="animate-pulse bg-background rounded h-8 w-16 mb-2"></div>
              <div className="animate-pulse bg-background rounded h-4 w-32"></div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="animate-pulse bg-background rounded h-6 w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-background">
                <div className="flex-1">
                  <div className="animate-pulse bg-background rounded h-5 w-48 mb-2"></div>
                  <div className="animate-pulse bg-background rounded h-4 w-32"></div>
                </div>
                <div className="animate-pulse bg-background rounded h-4 w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-16">
        <p className="text-red-500">Erro ao carregar dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua plataforma AICredy"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Agents Ativos"
          value={stats.activeAgents.toString()}
          icon="fi-rr-robot"
          trend={stats.totalAgents > 0 ? { 
            value: `${stats.totalAgents} total`, 
            positive: true 
          } : undefined}
        />
        <StatCard
          title="Canais Conectados"
          value={stats.activeChannels.toString()}
          icon="fi-rr-comment-alt"
          trend={stats.totalChannels > 0 ? { 
            value: `${stats.totalChannels} total`, 
            positive: true 
          } : undefined}
        />
        <StatCard
          title="Credenciais"
          value={stats.totalCredentials.toString()}
          icon="fi-rr-key"
          trend={{ value: "Ativas", positive: true }}
        />
        <StatCard
          title="Status"
          value="Online"
          icon="fi-rr-check-circle"
          trend={{ value: "Operacional", positive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-title text-text-primary mb-6">Atividade Recente</h2>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary">Nenhuma atividade recente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className={`flex items-center justify-between py-4 ${
                  index < activities.length - 1 ? 'border-b border-background' : ''
                }`}
              >
                <div>
                  <p className="font-medium text-text-primary">{activity.description}</p>
                  {activity.payload?.name && (
                    <p className="text-sm text-text-secondary">{activity.payload.name}</p>
                  )}
                </div>
                <span className="text-sm text-text-secondary whitespace-nowrap ml-4">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
