'use client';

import { Agent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { IconContainer } from '@/components/shared/icon-container';
import { StatusBadge } from '@/components/shared/status-badge';
import { getAgentIcon } from '@/lib/icons';
import { useState } from 'react';

interface AgentCardProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onDelete?: (id: string) => void;
}

export function AgentCard({ agent, onEdit, onDelete }: AgentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm } = useConfirm();
  const toast = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = await confirm({
      title: 'Deletar Agent',
      message: `Tem certeza que deseja deletar o agent "${agent.name}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(agent.id);
      toast.success('Agent deletado', 'O agent foi removido com sucesso.');
    } catch (error: any) {
      toast.error('Erro ao deletar', error.message || 'Não foi possível deletar o agent.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <IconContainer icon={getAgentIcon()} variant="brand" size="md" />
        <StatusBadge status={agent.status} showIcon />
      </div>

      {/* Content */}
      <h3 className="text-title text-text-primary mb-2">{agent.name}</h3>
      <p className="text-body text-text-secondary mb-4 line-clamp-2">
        {agent.description || agent.instructions.substring(0, 100) + '...'}
      </p>

      {/* Tools */}
      {agent.enabled_tools && agent.enabled_tools.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary mb-2">Tools habilitadas:</p>
          <div className="flex flex-wrap gap-2">
            {agent.enabled_tools.slice(0, 3).map((tool) => (
              <span key={tool} className="text-xs bg-brand-50 text-brand px-3 py-1 rounded-pill">
                {tool}
              </span>
            ))}
            {agent.enabled_tools.length > 3 && (
              <span className="text-xs text-text-secondary">
                +{agent.enabled_tools.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-6">
        <Button
          onClick={() => onEdit?.(agent)}
          variant="outline"
          className="flex-1 rounded-pill"
        >
          <i className="fi fi-rr-edit text-base mr-2"></i>
          Editar
        </Button>
        <Button
          onClick={handleDelete}
          variant="outline"
          className="flex-1 rounded-pill text-red-600 hover:bg-red-50 hover:border-red-200"
          disabled={isDeleting}
        >
          <i className="fi fi-rr-trash text-base mr-2"></i>
          {isDeleting ? 'Deletando...' : 'Deletar'}
        </Button>
      </div>
    </div>
  );
}
