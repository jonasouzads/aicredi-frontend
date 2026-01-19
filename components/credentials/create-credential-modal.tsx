'use client';

import { useState, useEffect } from 'react';
import { useCredentials } from '@/hooks/use-credentials';
import { useToast } from '@/components/ui/toast';
import { useFocusTrap } from '@/hooks/use-focus-trap';
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

interface CreateCredentialModalProps {
  onClose: () => void;
}

export function CreateCredentialModal({ onClose }: CreateCredentialModalProps) {
  const { createCredential } = useCredentials();
  const toast = useToast();
  const modalRef = useFocusTrap<HTMLDivElement>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    type: 'crefaz',
    name: '',
    config: {
      login: '',
      senha: '',
      apiKey: '',
      environment: 'production',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCredential(formData);
      toast.success('Credencial criada!', `A credencial "${formData.name}" foi criada com sucesso.`);
      onClose();
    } catch (error: any) {
      toast.error('Erro ao criar credencial', error.message || 'Não foi possível criar a credencial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-credential-title"
    >
      <div 
        ref={modalRef}
        className="modal-container-md p-6 sm:p-8 overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <i className="fi fi-rr-key text-xl text-brand" aria-hidden="true"></i>
            </div>
            <h2 id="create-credential-title" className="text-title text-text-primary">Nova Credencial</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Fechar modal"
          >
            <i className="fi fi-rr-cross text-xl text-text-secondary" aria-hidden="true"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo */}
          <div>
            <Label htmlFor="type" className="text-text-primary mb-2 block">
              Tipo de Credencial *
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crefaz">💳 Crefaz</SelectItem>
                <SelectItem value="wizebot">🤖 Wizebot</SelectItem>
                <SelectItem value="mercadopago">💰 Mercado Pago</SelectItem>
                <SelectItem value="fgts_api">🏦 FGTS API</SelectItem>
                <SelectItem value="gestorpay">💼 GestorPay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nome */}
          <div>
            <Label htmlFor="name" className="text-text-primary mb-2 block">
              Nome Descritivo *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Crefaz Produção"
              className="input"
              required
            />
          </div>

          {/* Configurações específicas para Crefaz */}
          {formData.type === 'crefaz' && (
            <>
              <div>
                <Label htmlFor="login" className="text-text-primary mb-2 block">
                  Login *
                </Label>
                <Input
                  id="login"
                  value={formData.config.login}
                  onChange={(e) => setFormData({
                    ...formData,
                    config: { ...formData.config, login: e.target.value }
                  })}
                  placeholder="CC00000000"
                  className="input"
                  required
                />
              </div>

              <div>
                <Label htmlFor="senha" className="text-text-primary mb-2 block">
                  Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.config.senha}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, senha: e.target.value }
                    })}
                    placeholder="Sua senha"
                    className="input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <i className="fi fi-rr-eye-crossed text-xl"></i> : <i className="fi fi-rr-eye text-xl"></i>}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="apiKey" className="text-text-primary mb-2 block">
                  API Key *
                </Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.config.apiKey}
                    onChange={(e) => setFormData({
                      ...formData,
                      config: { ...formData.config, apiKey: e.target.value }
                    })}
                    placeholder="Sua API Key"
                    className="input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showApiKey ? <i className="fi fi-rr-eye-crossed text-xl"></i> : <i className="fi fi-rr-eye text-xl"></i>}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="environment" className="text-text-primary mb-2 block">
                  Ambiente *
                </Label>
                <Select
                  value={formData.config.environment}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    config: { ...formData.config, environment: value }
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o ambiente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staging">🧪 Homologação (Staging)</SelectItem>
                    <SelectItem value="production">🚀 Produção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Warning */}
          <div className="bg-brand-50 border-2 border-brand-100 rounded-xl p-4">
            <p className="text-sm text-brand-700">
              🔒 <strong>Segurança:</strong> Suas credenciais são criptografadas e nunca são expostas nas respostas da API.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {isSubmitting ? 'Criando...' : 'Criar Credencial'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
