import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">{title}</h1>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
