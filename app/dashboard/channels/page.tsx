'use client';

import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { ChannelCard } from '@/components/channels/channel-card';
import { CreateChannelModal } from '@/components/channels/create-channel-modal';
import { EditChannelModal } from '@/components/channels/edit-channel-modal';
import { useChannels } from '@/hooks/use-channels';
import { Button } from '@/components/ui/button';
import { Channel } from '@/lib/api';
import { useState } from 'react';

export default function ChannelsPage() {
  const { channels, loading, error, deleteChannel } = useChannels();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

  if (loading) {
    return <PageSkeleton hasHeader hasAction gridCols={3} cardCount={6} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <PageHeader
        title="Canais"
        description="Gerencie seus canais de comunicação"
        action={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand hover:bg-brand-700 text-white rounded-pill px-8"
          >
            <i className="fi fi-rr-plus text-xl mr-2"></i>
            Novo Canal
          </Button>
        }
      />

      {channels.length === 0 ? (
        <EmptyState
          icon="fi-rr-comment-alt"
          title="Nenhum canal conectado"
          description="Conecte um canal WhatsApp ou Wizebot para começar a receber mensagens"
          action={
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-brand hover:bg-brand-700 text-white rounded-pill px-8"
            >
              <i className="fi fi-rr-plus text-xl mr-2"></i>
              Conectar Primeiro Canal
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <ChannelCard 
              key={channel.id} 
              channel={channel}
              onEdit={(channel) => setEditingChannel(channel)}
              onManageAgents={() => {/* TODO: Implementar gestão de agents */}}
              onDelete={deleteChannel}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateChannelModal onClose={() => setShowCreateModal(false)} />
      )}

      {editingChannel && (
        <EditChannelModal 
          channel={editingChannel} 
          onClose={() => setEditingChannel(null)} 
        />
      )}
    </div>
  );
}
