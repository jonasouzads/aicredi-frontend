'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { api, IntegrationWebhook, CreateWebhookDto } from '@/lib/api';
import { WebhookCard } from './webhook-card';
import { WebhookFormModal } from './webhook-form-modal';
import { WebhookDetailsModal } from './webhook-details-modal';

export function WebhooksSettings() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [webhooks, setWebhooks] = useState<IntegrationWebhook[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<IntegrationWebhook | null>(null);
  const [viewingWebhook, setViewingWebhook] = useState<IntegrationWebhook | null>(null);

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    try {
      setIsLoading(true);
      const data = await api.getWebhooks();
      setWebhooks(data);
    } catch (error: any) {
      toast.error('Erro ao carregar webhooks', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateWebhookDto) => {
    try {
      const newWebhook = await api.createWebhook(data);
      setWebhooks([newWebhook, ...webhooks]);
      setShowCreateModal(false);
      toast.success('Webhook criado', 'O webhook foi configurado com sucesso');
    } catch (error: any) {
      toast.error('Erro ao criar webhook', error.message);
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: CreateWebhookDto) => {
    try {
      const updated = await api.updateWebhook(id, data);
      setWebhooks(webhooks.map(w => w.id === id ? updated : w));
      setEditingWebhook(null);
      toast.success('Webhook atualizado', 'As alterações foram salvas');
    } catch (error: any) {
      toast.error('Erro ao atualizar webhook', error.message);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteWebhook(id);
      setWebhooks(webhooks.filter(w => w.id !== id));
      toast.success('Webhook removido', 'O webhook foi excluído com sucesso');
    } catch (error: any) {
      toast.error('Erro ao remover webhook', error.message);
    }
  };

  const handleToggleStatus = async (webhook: IntegrationWebhook) => {
    const newStatus = webhook.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await api.updateWebhook(webhook.id, { status: newStatus });
      setWebhooks(webhooks.map(w => w.id === webhook.id ? updated : w));
      toast.success(
        newStatus === 'active' ? 'Webhook ativado' : 'Webhook desativado',
        `O webhook "${webhook.name}" foi ${newStatus === 'active' ? 'ativado' : 'desativado'}`
      );
    } catch (error: any) {
      toast.error('Erro ao alterar status', error.message);
    }
  };

  const handleTest = async (webhook: IntegrationWebhook) => {
    try {
      toast.info('Testando webhook...', 'Enviando requisição de teste');
      const result = await api.testWebhook(webhook.id);
      
      if (result.success) {
        toast.success(
          'Teste bem-sucedido',
          `Resposta em ${result.response_time_ms}ms (HTTP ${result.status_code})`
        );
      } else {
        toast.error('Teste falhou', result.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      toast.error('Erro ao testar webhook', error.message);
    }
  };

  const handleRegenerateSecret = async (webhook: IntegrationWebhook) => {
    try {
      const result = await api.regenerateWebhookSecret(webhook.id);
      setWebhooks(webhooks.map(w => 
        w.id === webhook.id ? { ...w, secret_key: result.secret_key } : w
      ));
      toast.success('Chave regenerada', 'A nova chave secreta foi gerada');
    } catch (error: any) {
      toast.error('Erro ao regenerar chave', error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Webhooks"
        description="Configure webhooks para receber notificações de eventos em tempo real"
        action={
          <Button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <i className="fi fi-rr-plus mr-2"></i>
            Novo Webhook
          </Button>
        }
      />

      {webhooks.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fi fi-rr-link-alt text-3xl text-brand"></i>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Nenhum webhook configurado
          </h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Configure webhooks para receber notificações quando propostas forem criadas, aprovadas ou rejeitadas.
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <i className="fi fi-rr-plus mr-2"></i>
            Criar Primeiro Webhook
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onEdit={() => setEditingWebhook(webhook)}
              onDelete={() => handleDelete(webhook.id)}
              onToggleStatus={() => handleToggleStatus(webhook)}
              onTest={() => handleTest(webhook)}
              onViewDetails={() => setViewingWebhook(webhook)}
              onRegenerateSecret={() => handleRegenerateSecret(webhook)}
            />
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      {showCreateModal && (
        <WebhookFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* Modal de Edição */}
      {editingWebhook && (
        <WebhookFormModal
          webhook={editingWebhook}
          onClose={() => setEditingWebhook(null)}
          onSubmit={(data: CreateWebhookDto) => handleUpdate(editingWebhook.id, data)}
        />
      )}

      {/* Modal de Detalhes */}
      {viewingWebhook && (
        <WebhookDetailsModal
          webhook={viewingWebhook}
          onClose={() => setViewingWebhook(null)}
        />
      )}
    </div>
  );
}
