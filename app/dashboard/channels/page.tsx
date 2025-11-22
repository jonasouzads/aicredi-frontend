'use client';

import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
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
        <p className="text-red-500">Erro ao carregar canais: {error}</p>
      </div>
    );
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
