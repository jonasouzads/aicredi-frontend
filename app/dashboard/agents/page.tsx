'use client';

import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { AgentCard } from '@/components/agents/agent-card';
import { CreateAgentModal } from '@/components/agents/create-agent-modal';
import { EditAgentModal } from '@/components/agents/edit-agent-modal';
import { useAgents } from '@/hooks/use-agents';
import { Button } from '@/components/ui/button';
import { Agent } from '@/lib/api';
import { useState } from 'react';

export default function AgentsPage() {
  const { agents, loading, error, deleteAgent } = useAgents();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  if (loading) {
    return <PageSkeleton hasHeader hasAction gridCols={3} cardCount={6} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader
        title="Agents"
        description="Gerencie seus agents inteligentes"
        action={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand hover:bg-brand-700 text-white rounded-pill px-8"
          >
            <i className="fi fi-rr-plus text-xl mr-2"></i>
            Novo Agent
          </Button>
        }
      />

      {agents.length === 0 ? (
        <EmptyState
          icon="fi-rr-robot"
          title="Nenhum agent criado"
          description="Crie seu primeiro agent para começar a automatizar atendimentos"
          action={
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-brand hover:bg-brand-700 text-white rounded-pill px-8"
            >
              <i className="fi fi-rr-plus text-xl mr-2"></i>
              Criar Primeiro Agent
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent}
              onEdit={(agent) => setEditingAgent(agent)}
              onDelete={deleteAgent}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateAgentModal onClose={() => setShowCreateModal(false)} />
      )}

      {editingAgent && (
        <EditAgentModal 
          agent={editingAgent} 
          onClose={() => setEditingAgent(null)} 
        />
      )}
    </div>
  );
}
