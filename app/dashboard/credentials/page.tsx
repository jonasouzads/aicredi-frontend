'use client';

import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { PageSkeleton } from '@/components/shared/page-skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { CredentialCard } from '@/components/credentials/credential-card';
import { CreateCredentialModal } from '@/components/credentials/create-credential-modal';
import { useCredentials } from '@/hooks/use-credentials';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function CredentialsPage() {
  const { credentials, loading, error, deleteCredential } = useCredentials();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return <PageSkeleton hasHeader hasAction gridCols={3} cardCount={6} />;
  }

  if (error) {
    return <ErrorState message={error} />;
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
