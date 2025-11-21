'use client';

import { Channel } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { useState } from 'react';

interface ChannelCardProps {
  channel: Channel;
  onManageAgents?: (channel: Channel) => void;
  onDelete?: (id: string) => void;
}

export function ChannelCard({ channel, onManageAgents, onDelete }: ChannelCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm } = useConfirm();
  const toast = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = await confirm({
      title: 'Deletar Canal',
      message: `Tem certeza que deseja deletar o canal "${channel.name || channel.identifier}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(channel.id);
      toast.success('Canal deletado', 'O canal foi removido com sucesso.');
    } catch (error: any) {
      toast.error('Erro ao deletar', error.message || 'Não foi possível deletar o canal.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getChannelIcon = () => {
    switch (channel.type) {
      case 'whatsapp':
        return '💬';
      case 'wizebot':
        return '🤖';
      case 'telegram':
        return '✈️';
      default:
        return '📡';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-2xl">
          {getChannelIcon()}
        </div>
        <span className={`badge ${channel.status === 'active' ? 'badge-success' : 'badge-error'}`}>
          {channel.status === 'active' ? (
            <>
              <i className="fi fi-rr-check-circle text-xs mr-1"></i>
              Ativo
            </>
          ) : (
            <>
              <i className="fi fi-rr-cross-circle text-xs mr-1"></i>
              Inativo
            </>
          )}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-title text-text-primary mb-2 truncate">{channel.name || channel.identifier}</h3>
      <div className="space-y-1 mb-4">
        <p className="text-sm text-text-secondary">
          <span className="font-medium">Tipo:</span> {channel.type}
        </p>
        {channel.config?.phone_number_id && (
          <p className="text-sm text-text-secondary truncate">
            <span className="font-medium">ID:</span> {channel.config.phone_number_id}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mt-6">
        <Button
          onClick={() => onManageAgents?.(channel)}
          variant="outline"
          className="flex-1 rounded-xl"
        >
          <i className="fi fi-rr-users-alt text-base mr-2"></i>
          <span className="hidden sm:inline">Gerenciar</span> Agents
        </Button>
        <Button
          onClick={handleDelete}
          variant="outline"
          className="flex-1 rounded-xl text-red-600 hover:bg-red-50 hover:border-red-200"
          disabled={isDeleting}
        >
          <i className="fi fi-rr-trash text-base mr-2"></i>
          {isDeleting ? 'Deletando...' : 'Deletar'}
        </Button>
      </div>
    </div>
  );
}
