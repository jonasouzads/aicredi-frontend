'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { api, IntegrationWebhook, CreateWebhookDto, WebhookEventInfo } from '@/lib/api';

interface WebhookFormModalProps {
  webhook?: IntegrationWebhook;
  onClose: () => void;
  onSubmit: (data: CreateWebhookDto) => Promise<void>;
}

const AVAILABLE_EVENTS = [
  { value: 'proposal.created', label: 'Proposta Criada', description: 'Quando uma nova proposta é criada' },
  { value: 'proposal.approved', label: 'Proposta Aprovada', description: 'Quando uma proposta é aprovada' },
  { value: 'proposal.rejected', label: 'Proposta Rejeitada', description: 'Quando uma proposta é rejeitada' },
  { value: 'proposal.analysis', label: 'Em Análise', description: 'Quando uma proposta entra em análise' },
  { value: 'proposal.error', label: 'Erro na Proposta', description: 'Quando ocorre erro em uma proposta' },
];

const AVAILABLE_PROVIDERS = [
  { value: 'crefaz', label: 'Crefaz' },
];

export function WebhookFormModal({ webhook, onClose, onSubmit }: WebhookFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: webhook?.name || '',
    url: webhook?.url || '',
    events: webhook?.events || [],
    providers: webhook?.providers || [],
    max_retries: webhook?.max_retries || 5,
    retry_delay_seconds: webhook?.retry_delay_seconds || 60,
    timeout_seconds: webhook?.timeout_seconds || 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.url.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: formData.name,
        url: formData.url,
        events: formData.events.length > 0 ? formData.events : undefined,
        providers: formData.providers.length > 0 ? formData.providers : undefined,
        max_retries: formData.max_retries,
        retry_delay_seconds: formData.retry_delay_seconds,
        timeout_seconds: formData.timeout_seconds,
      });
    } catch (error) {
      // Erro tratado no componente pai
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event],
    }));
  };

  const toggleProvider = (provider: string) => {
    setFormData(prev => ({
      ...prev,
      providers: prev.providers.includes(provider)
        ? prev.providers.filter(p => p !== provider)
        : [...prev.providers, provider],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              {webhook ? 'Editar Webhook' : 'Novo Webhook'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Configure a URL e os eventos que deseja receber
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors"
          >
            <i className="fi fi-rr-cross text-text-secondary"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Nome */}
            <div>
              <Label htmlFor="name" className="text-text-primary mb-2 block">
                Nome do Webhook *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Meu CRM, Sistema de Vendas..."
                required
              />
              <p className="text-xs text-text-secondary mt-1.5">
                Um nome para identificar este webhook
              </p>
            </div>

            {/* URL */}
            <div>
              <Label htmlFor="url" className="text-text-primary mb-2 block">
                URL do Webhook *
              </Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://seu-sistema.com/webhooks/aicredi"
                required
              />
              <p className="text-xs text-text-secondary mt-1.5">
                Endereço que receberá as notificações via HTTP POST
              </p>
            </div>

            {/* Eventos */}
            <div>
              <Label className="text-text-primary mb-3 block">
                Eventos
              </Label>
              <div className="space-y-2">
                {AVAILABLE_EVENTS.map((event) => (
                  <label
                    key={event.value}
                    className="flex items-start gap-3 p-3 bg-background rounded-xl cursor-pointer hover:bg-background/80 transition-colors"
                  >
                    <Checkbox
                      checked={formData.events.includes(event.value)}
                      onCheckedChange={() => toggleEvent(event.value)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {event.label}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {event.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Deixe vazio para receber todos os eventos
              </p>
            </div>

            {/* Providers */}
            <div>
              <Label className="text-text-primary mb-3 block">
                Bancos/Providers
              </Label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PROVIDERS.map((provider) => (
                  <label
                    key={provider.value}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors
                      ${formData.providers.includes(provider.value)
                        ? 'bg-brand-50 text-brand border-2 border-brand'
                        : 'bg-background text-text-secondary border-2 border-transparent hover:border-border'
                      }
                    `}
                  >
                    <Checkbox
                      checked={formData.providers.includes(provider.value)}
                      onCheckedChange={() => toggleProvider(provider.value)}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{provider.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Deixe vazio para receber de todos os bancos
              </p>
            </div>

            {/* Configurações Avançadas */}
            <div className="pt-4 border-t border-border">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
                onClick={() => {
                  const el = document.getElementById('advanced-settings');
                  if (el) el.classList.toggle('hidden');
                }}
              >
                <i className="fi fi-rr-settings"></i>
                Configurações Avançadas
                <i className="fi fi-rr-angle-down text-xs"></i>
              </button>

              <div id="advanced-settings" className="hidden space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="max_retries" className="text-text-primary mb-2 block text-sm">
                      Tentativas
                    </Label>
                    <Input
                      id="max_retries"
                      type="number"
                      min={1}
                      max={10}
                      value={formData.max_retries}
                      onChange={(e) => setFormData({ ...formData, max_retries: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retry_delay" className="text-text-primary mb-2 block text-sm">
                      Delay (seg)
                    </Label>
                    <Input
                      id="retry_delay"
                      type="number"
                      min={10}
                      max={3600}
                      value={formData.retry_delay_seconds}
                      onChange={(e) => setFormData({ ...formData, retry_delay_seconds: parseInt(e.target.value) || 60 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeout" className="text-text-primary mb-2 block text-sm">
                      Timeout (seg)
                    </Label>
                    <Input
                      id="timeout"
                      type="number"
                      min={5}
                      max={60}
                      value={formData.timeout_seconds}
                      onChange={(e) => setFormData({ ...formData, timeout_seconds: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                </div>
                <p className="text-xs text-text-secondary">
                  Configurações de retry e timeout para as requisições
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-background/50">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.name.trim() || !formData.url.trim()}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <i className="fi fi-rr-spinner animate-spin mr-2"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fi fi-rr-disk mr-2"></i>
                {webhook ? 'Salvar Alterações' : 'Criar Webhook'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
