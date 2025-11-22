'use client';

import { useState, useEffect } from 'react';
import { Channel } from '@/lib/api';
import { useChannels } from '@/hooks/use-channels';
import { useAgents } from '@/hooks/use-agents';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface EditChannelModalProps {
  channel: Channel;
  onClose: () => void;
}

export function EditChannelModal({ channel, onClose }: EditChannelModalProps) {
  const { updateChannel } = useChannels();
  const { agents } = useAgents();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    identifier: channel.identifier || '',
    whatsapp_phone_number: channel.config?.whatsapp_phone_number || '',
    phone_number_id: channel.config?.phone_number_id || '',
    api_token: channel.config?.api_token || '',
    default_agent_id: '',
    is_active: channel.status === 'active',
  });

  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/webhooks/wizebot`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await updateChannel(channel.id, {
        identifier: formData.identifier,
        config: {
          whatsapp_phone_number: formData.whatsapp_phone_number,
          phone_number_id: formData.phone_number_id,
          api_token: formData.api_token,
        },
        default_agent_id: formData.default_agent_id || undefined,
      });
      toast.success('Canal atualizado!', `O canal "${formData.identifier}" foi atualizado com sucesso.`);
      onClose();
    } catch (error: any) {
      toast.error('Erro ao atualizar canal', error.message || 'Não foi possível atualizar o canal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-surface rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <i className="fi fi-rr-edit text-xl text-brand"></i>
            </div>
            <h2 className="text-title text-text-primary">Editar Canal</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-background transition-colors"
          >
            <i className="fi fi-rr-cross text-xl"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info */}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <i className="fi fi-rr-info text-brand text-xl mt-0.5"></i>
              <div>
                <h3 className="text-body font-semibold text-brand mb-1">Editar Canal Wizebot</h3>
                <p className="text-sm text-brand-700">
                  Atualize as configurações do canal Wizebot.
                </p>
              </div>
            </div>
          </div>

          {/* Identificador */}
          <div>
            <Label htmlFor="identifier" className="text-text-primary mb-2 block">
              Nome do Canal *
            </Label>
            <Input
              id="identifier"
              type="text"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              placeholder="Ex: WhatsApp Principal, WhatsApp Vendas"
              required
            />
            <p className="text-sm text-text-secondary mt-2">
              Nome para identificar este canal no sistema
            </p>
          </div>

          {/* Número do WhatsApp */}
          <div>
            <Label htmlFor="whatsapp_phone_number" className="text-text-primary mb-2 block">
              Número do WhatsApp *
            </Label>
            <Input
              id="whatsapp_phone_number"
              type="text"
              value={formData.whatsapp_phone_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_phone_number: e.target.value })}
              placeholder="Ex: +55 91 9239-6758 ou 559192396758"
              required
            />
            <p className="text-sm text-text-secondary mt-2">
              Número do seu WhatsApp na Wizebot (pode incluir formatação)
            </p>
          </div>

          {/* Phone Number ID (para API) */}
          <div>
            <Label htmlFor="phone_number_id" className="text-text-primary mb-2 block">
              Phone Number ID *
            </Label>
            <Input
              id="phone_number_id"
              type="text"
              value={formData.phone_number_id}
              onChange={(e) => setFormData({ ...formData, phone_number_id: e.target.value })}
              placeholder="Ex: 559192396758"
              required
            />
            <p className="text-sm text-text-secondary mt-2">
              ID do número de telefone usado para enviar mensagens via API Wizebot
            </p>
          </div>

          {/* Agent Padrão */}
          <div>
            <Label htmlFor="default_agent_id" className="text-text-primary mb-2 block">
              Agent Padrão *
            </Label>
            <Select
              value={formData.default_agent_id}
              onValueChange={(value) => setFormData({ ...formData, default_agent_id: value })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-text-secondary mt-2">
              Agent que irá processar as mensagens deste canal
            </p>
          </div>

          {/* API Token */}
          <div>
            <Label htmlFor="api_token" className="text-text-primary mb-2 block">
              Token da API Wizebot *
            </Label>
            <Input
              id="api_token"
              type="password"
              value={formData.api_token}
              onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
              placeholder="Token de autenticação da API Wizebot"
              required
            />
            <p className="text-sm text-text-secondary mt-2">
              Token fornecido pela plataforma Wizebot para enviar mensagens
            </p>
          </div>

          {/* Webhook URL */}
          <div>
            <Label className="text-text-primary mb-2 block">
              URL do Webhook
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={webhookUrl}
                readOnly
                className="flex-1 bg-background"
              />
              <Button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(webhookUrl);
                  toast.success('Copiado!', 'URL do webhook copiada para a área de transferência.');
                }}
                className="btn-secondary px-4"
              >
                <i className="fi fi-rr-copy"></i>
              </Button>
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Configure esta URL no painel da Wizebot para receber mensagens
            </p>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-background">
            <div className="flex-1">
              <Label htmlFor="is_active" className="text-text-primary font-medium cursor-pointer">
                Canal Ativo
              </Label>
              <p className="text-sm text-text-secondary mt-1">
                Ativar ou desativar o recebimento de mensagens
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 order-2 sm:order-1"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 order-1 sm:order-2"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
