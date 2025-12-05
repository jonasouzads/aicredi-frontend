'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IntegrationWebhook } from '@/lib/api';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface WebhookCardProps {
  webhook: IntegrationWebhook;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onTest: () => void;
  onViewDetails: () => void;
  onRegenerateSecret: () => void;
}

export function WebhookCard({
  webhook,
  onEdit,
  onDelete,
  onToggleStatus,
  onTest,
  onViewDetails,
  onRegenerateSecret,
}: WebhookCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSecretConfirm, setShowSecretConfirm] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const getStatusBadge = () => {
    switch (webhook.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Ativo
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            Inativo
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Suspenso
          </span>
        );
    }
  };

  const getSuccessRate = () => {
    if (webhook.total_deliveries === 0) return null;
    const rate = (webhook.successful_deliveries / webhook.total_deliveries) * 100;
    return rate.toFixed(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maskSecret = (secret: string) => {
    if (showSecret) return secret;
    return secret.substring(0, 12) + '••••••••••••••••';
  };

  return (
    <>
      <div className="bg-surface rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
              <i className="fi fi-rr-link-alt text-xl text-brand"></i>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                {webhook.name}
              </h3>
              <p className="text-sm text-text-secondary truncate max-w-md">
                {webhook.url}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Eventos */}
        <div className="mb-4">
          <p className="text-xs text-text-secondary mb-2">Eventos:</p>
          <div className="flex flex-wrap gap-1.5">
            {webhook.events.length === 0 ? (
              <span className="text-xs text-text-secondary italic">Todos os eventos</span>
            ) : (
              webhook.events.map((event) => (
                <span
                  key={event}
                  className="px-2 py-0.5 bg-background rounded text-xs text-text-secondary"
                >
                  {event}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Secret Key */}
        <div className="mb-4 p-3 bg-background rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary mb-1">Chave Secreta:</p>
              <code className="text-xs text-text-primary font-mono">
                {maskSecret(webhook.secret_key)}
              </code>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="p-1.5 hover:bg-surface rounded-lg transition-colors"
                title={showSecret ? 'Ocultar' : 'Mostrar'}
              >
                <i className={`fi ${showSecret ? 'fi-rr-eye-crossed' : 'fi-rr-eye'} text-text-secondary`}></i>
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(webhook.secret_key)}
                className="p-1.5 hover:bg-surface rounded-lg transition-colors"
                title="Copiar"
              >
                <i className="fi fi-rr-copy text-text-secondary"></i>
              </button>
              <button
                onClick={() => setShowSecretConfirm(true)}
                className="p-1.5 hover:bg-surface rounded-lg transition-colors"
                title="Regenerar"
              >
                <i className="fi fi-rr-refresh text-text-secondary"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-text-primary">
              {webhook.total_deliveries}
            </p>
            <p className="text-xs text-text-secondary">Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-600">
              {webhook.successful_deliveries}
            </p>
            <p className="text-xs text-text-secondary">Sucesso</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">
              {webhook.failed_deliveries}
            </p>
            <p className="text-xs text-text-secondary">Falhas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-text-primary">
              {getSuccessRate() ? `${getSuccessRate()}%` : '-'}
            </p>
            <p className="text-xs text-text-secondary">Taxa</p>
          </div>
        </div>

        {/* Última entrega */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
          <span>Última entrega: {formatDate(webhook.last_delivery_at)}</span>
          {webhook.consecutive_failures > 0 && (
            <span className="text-red-600">
              {webhook.consecutive_failures} falha(s) consecutiva(s)
            </span>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTest}
              className="text-xs"
            >
              <i className="fi fi-rr-play mr-1.5"></i>
              Testar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="text-xs"
            >
              <i className="fi fi-rr-list mr-1.5"></i>
              Entregas
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleStatus}
              className="text-xs"
            >
              <i className={`fi ${webhook.status === 'active' ? 'fi-rr-pause' : 'fi-rr-play'} mr-1.5`}></i>
              {webhook.status === 'active' ? 'Desativar' : 'Ativar'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-xs"
            >
              <i className="fi fi-rr-pencil mr-1.5"></i>
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <i className="fi fi-rr-trash mr-1.5"></i>
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete();
          setShowDeleteConfirm(false);
        }}
        title="Excluir Webhook"
        description={`Tem certeza que deseja excluir o webhook "${webhook.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
      />

      {/* Confirmação de regenerar secret */}
      <ConfirmDialog
        isOpen={showSecretConfirm}
        onClose={() => setShowSecretConfirm(false)}
        onConfirm={() => {
          onRegenerateSecret();
          setShowSecretConfirm(false);
        }}
        title="Regenerar Chave Secreta"
        description="Ao regenerar a chave secreta, você precisará atualizar a configuração no seu sistema. A chave antiga deixará de funcionar imediatamente."
        confirmText="Regenerar"
        variant="warning"
      />
    </>
  );
}
