'use client';

import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { CredentialCard } from '@/components/credentials/credential-card';
import { CreateCredentialModal } from '@/components/credentials/create-credential-modal';
import { useCredentials } from '@/hooks/use-credentials';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function CredentialsPage() {
  const { credentials, loading, error, deleteCredential } = useCredentials();
  const [showCreateModal, setShowCreateModal] = useState(false);

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
        <p className="text-red-500">Erro ao carregar credenciais: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Credenciais"
        description="Gerencie suas credenciais de APIs externas"
        action={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand hover:bg-brand-700 text-white rounded-pill px-8"
          >
            <i className="fi fi-rr-plus text-xl mr-2"></i>
            Nova Credencial
          </Button>
        }
      />

      {credentials.length === 0 ? (
        <EmptyState
          icon="fi-rr-key"
          title="Nenhuma credencial cadastrada"
          description="Adicione credenciais de APIs externas como Crefaz para habilitar integrações"
          action={
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-brand hover:bg-brand-700 text-white rounded-pill px-8"
            >
              <i className="fi fi-rr-plus text-xl mr-2"></i>
              Adicionar Primeira Credencial
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((credential) => (
            <CredentialCard 
              key={credential.id} 
              credential={credential}
              onDelete={deleteCredential}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateCredentialModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
