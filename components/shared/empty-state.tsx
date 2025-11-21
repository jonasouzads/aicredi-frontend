import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card text-center py-16">
      <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <i className={`fi ${icon} text-5xl text-brand`}></i>
      </div>
      <h3 className="text-title text-text-primary mb-3">{title}</h3>
      <p className="text-body text-text-secondary mb-8 max-w-md mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
