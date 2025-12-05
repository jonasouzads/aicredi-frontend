'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { api, IntegrationWebhook, WebhookDelivery } from '@/lib/api';

interface WebhookDetailsModalProps {
  webhook: IntegrationWebhook;
  onClose: () => void;
}

export function WebhookDetailsModal({ webhook, onClose }: WebhookDetailsModalProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<string>('');
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    loadDeliveries();
  }, [page, filter]);

  const loadDeliveries = async () => {
    try {
      setIsLoading(true);
      const result = await api.getWebhookDeliveries(webhook.id, {
        limit: pageSize,
        offset: page * pageSize,
        status: filter || undefined,
      });
      setDeliveries(result.deliveries);
      setTotal(result.total);
    } catch (error: any) {
      toast.error('Erro ao carregar entregas', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (deliveryId: string) => {
    try {
      await api.retryWebhookDelivery(deliveryId);
      toast.success('Retry agendado', 'A entrega será reenviada em breve');
      loadDeliveries();
    } catch (error: any) {
      toast.error('Erro ao agendar retry', error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <i className="fi fi-rr-check text-[10px]"></i>
            Entregue
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
            <i className="fi fi-rr-cross text-[10px]"></i>
            Falhou
          </span>
        );
      case 'retrying':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
            <i className="fi fi-rr-refresh text-[10px]"></i>
            Retry
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <i className="fi fi-rr-clock text-[10px]"></i>
            Pendente
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <i className="fi fi-rr-spinner animate-spin text-[10px]"></i>
            Processando
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Entregas do Webhook
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {webhook.name} • {total} entrega(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <i className="fi fi-rr-cross text-text-secondary"></i>
          </button>
        </div>

        {/* Filtros */}
        <div className="p-4 border-b border-border bg-background/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Filtrar:</span>
            {['', 'delivered', 'failed', 'retrying', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => { setFilter(status); setPage(0); }}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${filter === status
                    ? 'bg-brand text-white'
                    : 'bg-surface text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {status === '' ? 'Todos' : 
                 status === 'delivered' ? 'Entregues' :
                 status === 'failed' ? 'Falhas' :
                 status === 'retrying' ? 'Retry' : 'Pendentes'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
            </div>
          ) : deliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-text-secondary">
              <i className="fi fi-rr-inbox text-4xl mb-3"></i>
              <p>Nenhuma entrega encontrada</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-4 hover:bg-background/50 transition-colors">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedDelivery(
                      expandedDelivery === delivery.id ? null : delivery.id
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {getStatusBadge(delivery.status)}
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {delivery.event_type}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatDate(delivery.created_at)}
                          {delivery.duration_ms && ` • ${delivery.duration_ms}ms`}
                          {delivery.http_status && ` • HTTP ${delivery.http_status}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {delivery.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetry(delivery.id);
                          }}
                          className="text-xs"
                        >
                          <i className="fi fi-rr-refresh mr-1"></i>
                          Reenviar
                        </Button>
                      )}
                      <i className={`fi fi-rr-angle-${expandedDelivery === delivery.id ? 'up' : 'down'} text-text-secondary`}></i>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {expandedDelivery === delivery.id && (
                    <div className="mt-4 space-y-3">
                      {delivery.error_message && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-xs font-medium text-red-700 mb-1">Erro:</p>
                          <p className="text-xs text-red-600">{delivery.error_message}</p>
                        </div>
                      )}

                      <div className="p-3 bg-background rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-text-primary">Payload:</p>
                          <button
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(delivery.payload, null, 2))}
                            className="text-xs text-brand hover:text-brand-700"
                          >
                            <i className="fi fi-rr-copy mr-1"></i>
                            Copiar
                          </button>
                        </div>
                        <pre className="text-xs text-text-secondary overflow-x-auto max-h-48">
                          {JSON.stringify(delivery.payload, null, 2)}
                        </pre>
                      </div>

                      {delivery.response_body && (
                        <div className="p-3 bg-background rounded-lg">
                          <p className="text-xs font-medium text-text-primary mb-2">Resposta:</p>
                          <pre className="text-xs text-text-secondary overflow-x-auto max-h-24">
                            {delivery.response_body}
                          </pre>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>Tentativa: {delivery.attempt_number}/{delivery.max_attempts}</span>
                        <span>Event ID: {delivery.event_id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-background/50">
            <p className="text-sm text-text-secondary">
              Mostrando {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} de {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <i className="fi fi-rr-angle-left"></i>
              </Button>
              <span className="text-sm text-text-secondary px-2">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <i className="fi fi-rr-angle-right"></i>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
