'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';

export function DefaultMessagesSettings() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState({
    approved: '',
    rejected: '',
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await api.getDefaultMessages();
      setMessages(data);
    } catch (error: any) {
      toast.error('Erro ao carregar mensagens', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.updateDefaultMessages(messages);
      toast.success('Mensagens atualizadas', 'As mensagens padrão foram salvas com sucesso');
    } catch (error: any) {
      toast.error('Erro ao salvar', error.message);
    } finally {
      setIsSaving(false);
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
        title="Mensagens Padrão"
        description="Configure as mensagens automáticas enviadas aos clientes"
      />

      <div className="space-y-6 max-w-3xl">
        {/* Mensagem de Aprovação */}
        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fi fi-rr-check-circle text-xl text-green-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Proposta Aprovada
              </h3>
              <p className="text-sm text-text-secondary">
                Mensagem enviada quando a proposta de crédito é aprovada
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="approved" className="text-text-primary mb-2 block">
              Mensagem
            </Label>
            <Textarea
              id="approved"
              value={messages.approved}
              onChange={(e) => setMessages({ ...messages, approved: e.target.value })}
              placeholder="Digite a mensagem de aprovação..."
              className="min-h-[120px] resize-y"
              rows={4}
            />
            <p className="text-xs text-text-secondary mt-2">
              Esta mensagem será enviada automaticamente quando uma proposta for aprovada
            </p>
          </div>
        </div>

        {/* Mensagem de Recusa */}
        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fi fi-rr-cross-circle text-xl text-red-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Proposta Recusada
              </h3>
              <p className="text-sm text-text-secondary">
                Mensagem enviada quando a proposta de crédito é recusada
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="rejected" className="text-text-primary mb-2 block">
              Mensagem
            </Label>
            <Textarea
              id="rejected"
              value={messages.rejected}
              onChange={(e) => setMessages({ ...messages, rejected: e.target.value })}
              placeholder="Digite a mensagem de recusa..."
              className="min-h-[120px] resize-y"
              rows={4}
            />
            <p className="text-xs text-text-secondary mt-2">
              Esta mensagem será enviada automaticamente quando uma proposta for recusada
            </p>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? (
              <>
                <i className="fi fi-rr-spinner animate-spin mr-2"></i>
                Salvando...
              </>
            ) : (
              <>
                <i className="fi fi-rr-disk mr-2"></i>
                Salvar Mensagens
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
