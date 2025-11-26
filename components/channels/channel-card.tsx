'use client';

import { Channel } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { IconContainer } from '@/components/shared/icon-container';
import { StatusBadge } from '@/components/shared/status-badge';
import { getChannelIcon } from '@/lib/icons';
import { useState } from 'react';

interface ChannelCardProps {
  channel: Channel;
  onEdit?: (channel: Channel) => void;
  onManageAgents?: (channel: Channel) => void;
  onDelete?: (id: string) => void;
}

export function ChannelCard({ channel, onEdit, onManageAgents, onDelete }: ChannelCardProps) {
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

  return (
    <div className="card hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <IconContainer icon={getChannelIcon(channel.type)} variant="brand" size="md" />
        <StatusBadge status={channel.status} showIcon />
      </div>

      {/* Content */}
      <h3 className="text-title text-text-primary mb-2 truncate">{channel.name || channel.identifier}</h3>
      <div className="space-y-1 mb-4">
        <p className="text-sm text-text-secondary">
          <span className="font-medium">Tipo:</span> {channel.type}
        </p>
        {channel.config?.whatsapp_phone_number && (
          <p className="text-sm text-text-secondary truncate">
            <span className="font-medium">WhatsApp:</span> {channel.config.whatsapp_phone_number}
          </p>
        )}
        {channel.config?.phone_number_id && (
          <p className="text-sm text-text-secondary truncate">
            <span className="font-medium">Phone ID:</span> {channel.config.phone_number_id}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-6">
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit?.(channel)}
            variant="outline"
            className="flex-1 rounded-pill"
          >
            <i className="fi fi-rr-edit text-base mr-2"></i>
            Editar
          </Button>
          <Button
            onClick={() => onManageAgents?.(channel)}
            variant="outline"
            className="flex-1 rounded-pill"
          >
            <i className="fi fi-rr-users-alt text-base mr-2"></i>
            Agents
          </Button>
        </div>
        <Button
          onClick={handleDelete}
          variant="outline"
          className="w-full rounded-pill text-red-600 hover:bg-red-50 hover:border-red-200"
          disabled={isDeleting}
        >
          <i className="fi fi-rr-trash text-base mr-2"></i>
          {isDeleting ? 'Deletando...' : 'Deletar'}
        </Button>
      </div>
    </div>
  );
}
