'use client';

import { Credential } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { useState } from 'react';

interface CredentialCardProps {
  credential: Credential;
  onDelete?: (id: string) => void;
}

export function CredentialCard({ credential, onDelete }: CredentialCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm } = useConfirm();
  const toast = useToast();

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = await confirm({
      title: 'Deletar Credencial',
      message: `Tem certeza que deseja deletar a credencial "${credential.name}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Deletar',
      cancelText: 'Cancelar',
      type: 'danger',
    });

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete(credential.id);
      toast.success('Credencial deletada', 'A credencial foi removida com sucesso.');
    } catch (error: any) {
      toast.error('Erro ao deletar', error.message || 'Não foi possível deletar a credencial.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getCredentialIcon = () => {
    switch (credential.type) {
      case 'crefaz':
        return '💳';
      case 'wizebot':
        return '🤖';
      case 'mercadopago':
        return '💰';
      case 'fgts_api':
        return '🏦';
      default:
        return '🔑';
    }
  };

  const getCredentialLabel = () => {
    switch (credential.type) {
      case 'crefaz':
        return 'Crefaz';
      case 'wizebot':
        return 'Wizebot';
      case 'mercadopago':
        return 'Mercado Pago';
      case 'fgts_api':
        return 'FGTS API';
      case 'gestorpay':
        return 'GestorPay';
      default:
        return credential.type;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-2xl">
          {getCredentialIcon()}
        </div>
        <span className="badge badge-success">
          <i className="fi fi-rr-check-circle text-xs mr-1"></i>
          Ativa
        </span>
      </div>

      {/* Content */}
      <h3 className="text-title text-text-primary mb-2 truncate">{credential.name}</h3>
      <div className="flex items-center gap-2 mb-4">
        <i className="fi fi-rr-shield-check text-base text-text-secondary"></i>
        <p className="text-body text-text-secondary">
          {getCredentialLabel()}
        </p>
      </div>

      {/* Created Date */}
      <p className="text-sm text-text-secondary mb-6">
        Criada em {new Date(credential.created_at).toLocaleDateString('pt-BR')}
      </p>

      {/* Actions */}
      <Button
        onClick={handleDelete}
        variant="outline"
        className="w-full rounded-xl text-red-600 hover:bg-red-50 hover:border-red-200"
        disabled={isDeleting}
      >
        <i className="fi fi-rr-trash text-base mr-2"></i>
        {isDeleting ? 'Deletando...' : 'Deletar Credencial'}
      </Button>

      {/* Warning */}
      <p className="text-xs text-text-secondary mt-3 text-center">
        ⚠️ Dados sensíveis estão protegidos
      </p>
    </div>
  );
}
