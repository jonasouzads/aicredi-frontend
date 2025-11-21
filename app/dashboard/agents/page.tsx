'use client';

import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
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
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="animate-pulse bg-background rounded h-8 w-48 mb-2"></div>
            <div className="animate-pulse bg-background rounded h-4 w-96"></div>
          </div>
          <div className="animate-pulse bg-background rounded-xl h-11 w-32"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="flex items-start gap-4">
                <div className="animate-pulse bg-background rounded-xl w-12 h-12"></div>
                <div className="flex-1">
                  <div className="animate-pulse bg-background rounded h-6 w-3/4 mb-3"></div>
                  <div className="animate-pulse bg-background rounded h-4 w-full mb-2"></div>
                  <div className="animate-pulse bg-background rounded h-4 w-2/3"></div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <div className="animate-pulse bg-background rounded-xl h-10 flex-1"></div>
                <div className="animate-pulse bg-background rounded-xl h-10 flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-16">
        <p className="text-red-500">Erro ao carregar agents: {error}</p>
      </div>
    );
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
