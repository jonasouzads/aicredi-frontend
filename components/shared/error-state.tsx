import { ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
  icon?: string;
}

export function ErrorState({ 
  title = "Erro ao carregar dados",
  message,
  action,
  icon = "fi-rr-exclamation"
}: ErrorStateProps) {
  return (
    <div className="card text-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center">
          <i className={`fi ${icon} text-3xl text-red-600`}></i>
        </div>
        <div>
          <h3 className="text-title text-text-primary mb-2">{title}</h3>
          <p className="text-body text-red-600">{message}</p>
        </div>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
