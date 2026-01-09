'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';

interface FollowUpSettings {
  enabled: boolean;
  default_delay_minutes: number;
  default_cutoff_time: string; // Formato HH:MM
  default_mode: 'ai' | 'text';
  default_content: string;
}

export function FollowUpSettings() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<FollowUpSettings>({
    enabled: true,
    default_delay_minutes: 15,
    default_cutoff_time: '20:00',
    default_mode: 'text',
    default_content: 'Oi 😊\nConsegue me responder pra gente continuar sua simulação?\nÉ rapidinho e gratuito.',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await api.getFollowUpSettings();
      setSettings(data);
    } catch (error: any) {
      toast.error('Erro ao carregar configurações', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Enviar apenas os campos editáveis (sem id, tenant_id, created_at, updated_at)
      await api.updateFollowUpSettings({
        enabled: settings.enabled,
        default_delay_minutes: settings.default_delay_minutes,
        default_cutoff_time: settings.default_cutoff_time,
        default_mode: settings.default_mode,
        default_content: settings.default_content,
      });
      toast.success('Configurações salvas', 'As configurações de follow-up foram atualizadas');
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
        title="Follow-up Automático"
        description="Configure mensagens de follow-up para clientes que pararam de responder"
      />

      <div className="space-y-6 max-w-3xl">
        {/* Ativar/Desativar */}
        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fi fi-rr-time-forward text-xl text-brand"></i>
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  Follow-up Ativo
                </h3>
                <p className="text-sm text-text-secondary">
                  Quando ativado, você poderá criar follow-ups para conversas específicas
                </p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.enabled ? 'bg-brand' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.enabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Configurações de Tempo */}
        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fi fi-rr-clock text-xl text-blue-600"></i>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Configurações de Tempo
              </h3>
              <p className="text-sm text-text-secondary">
                Defina os valores padrão para novos follow-ups
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delay" className="text-text-primary mb-2 block">
                Enviar após (minutos)
              </Label>
              <Input
                id="delay"
                type="number"
                min={1}
                max={1440}
                value={settings.default_delay_minutes}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  default_delay_minutes: parseInt(e.target.value) || 15 
                })}
                className="w-full"
              />
              <p className="text-xs text-text-secondary mt-1">
                Tempo após última mensagem do cliente
              </p>
            </div>

            <div>
              <Label htmlFor="cutoff" className="text-text-primary mb-2 block">
                Não enviar após
              </Label>
              <Input
                id="cutoff"
                type="time"
                value={settings.default_cutoff_time}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  default_cutoff_time: e.target.value 
                })}
                className="w-full"
              />
              <p className="text-xs text-text-secondary mt-1">
                Formato 24h (ex: 20:00, 02:30). Se passar, envia no próximo dia às 9h
              </p>
            </div>
          </div>
        </div>

        {/* Modo de Mensagem */}
        <div className="bg-surface rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fi fi-rr-comment-alt text-xl text-purple-600"></i>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-1">
                Tipo de Mensagem
              </h3>
              <p className="text-sm text-text-secondary">
                Escolha como a mensagem de follow-up será gerada
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSettings({ ...settings, default_mode: 'text' })}
              className={`
                flex-1 p-4 rounded-xl border-2 transition-all text-left
                ${settings.default_mode === 'text'
                  ? 'border-brand bg-brand-50'
                  : 'border-border hover:border-brand/50'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <i className={`fi fi-rr-document text-lg ${settings.default_mode === 'text' ? 'text-brand' : 'text-text-secondary'}`}></i>
                <span className={`font-medium ${settings.default_mode === 'text' ? 'text-brand' : 'text-text-primary'}`}>
                  Mensagem Fixa
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Enviar sempre a mesma mensagem definida abaixo
              </p>
            </button>

            <button
              onClick={() => setSettings({ ...settings, default_mode: 'ai' })}
              className={`
                flex-1 p-4 rounded-xl border-2 transition-all text-left
                ${settings.default_mode === 'ai'
                  ? 'border-brand bg-brand-50'
                  : 'border-border hover:border-brand/50'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <i className={`fi fi-rr-brain text-lg ${settings.default_mode === 'ai' ? 'text-brand' : 'text-text-secondary'}`}></i>
                <span className={`font-medium ${settings.default_mode === 'ai' ? 'text-brand' : 'text-text-primary'}`}>
                  Gerar com IA
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                IA analisa o histórico e cria mensagem personalizada
              </p>
            </button>
          </div>

          <div>
            <Label htmlFor="content" className="text-text-primary mb-2 block">
              {settings.default_mode === 'ai' ? 'Prompt para a IA' : 'Mensagem de Follow-up'}
            </Label>
            <Textarea
              id="content"
              value={settings.default_content}
              onChange={(e) => setSettings({ ...settings, default_content: e.target.value })}
              placeholder={settings.default_mode === 'ai' 
                ? "Veja o histórico da conversa e crie uma mensagem educada de follow-up. Responda SOMENTE com o texto a ser enviado."
                : "Oi 😊\nConsegue me responder pra gente continuar sua simulação?\nÉ rapidinho e gratuito."
              }
              className="min-h-[120px] resize-y"
              rows={4}
            />
            <p className="text-xs text-text-secondary mt-2">
              {settings.default_mode === 'ai' 
                ? 'A IA usará este prompt junto com o histórico da conversa para gerar a mensagem'
                : 'Esta mensagem será enviada exatamente como está escrita'
              }
            </p>
          </div>
        </div>

        {/* Dicas */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <i className="fi fi-rr-lightbulb-on text-amber-600 text-lg mt-0.5"></i>
            <div>
              <h4 className="text-sm font-medium text-amber-800 mb-1">Dicas de uso</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Use tom educado, leve e positivo nas mensagens</li>
                <li>• Inclua emojis para deixar a mensagem mais amigável 😊</li>
                <li>• Evite pressionar o cliente - seja gentil</li>
                <li>• O follow-up é cancelado automaticamente quando o cliente responde</li>
              </ul>
            </div>
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
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
