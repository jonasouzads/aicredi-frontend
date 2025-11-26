'use client';

interface ChatHeaderProps {
  name: string;
  phone?: string;
  avatarColor?: string; // Opcional se quiser variar cores
  onClose: () => void;
}

export function ChatHeader({ name, phone, onClose }: ChatHeaderProps) {
  return (
    <div className="p-4 bg-surface border-b border-border flex items-center justify-between z-10 relative">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
          <i className="fi fi-rr-user text-2xl text-brand"></i>
        </div>
        
        {/* Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-[16px] font-semibold text-text-primary leading-tight">
            {name}
          </h2>
          {phone && (
            <span className="text-sm text-text-secondary leading-tight mt-1">
              {phone}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-background transition-colors text-text-secondary hover:text-text-primary"
          title="Fechar"
        >
          <i className="fi fi-rr-cross text-xl"></i>
        </button>
      </div>
    </div>
  );
}
