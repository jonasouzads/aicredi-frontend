'use client';

interface ChatHeaderProps {
  name: string;
  phone?: string;
  onClose: () => void;
}

export function ChatHeader({ name, phone, onClose }: ChatHeaderProps) {
  return (
    <div className="bg-[#F0F2F5] border-b border-[#E2E4E8] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00A884] rounded-full flex items-center justify-center" aria-hidden="true">
          <i className="fi fi-rr-user text-white text-lg"></i>
        </div>
        <div>
          <h3 id="chat-modal-title" className="text-sm font-semibold text-[#111B21]">{name}</h3>
          {phone && (
            <p className="text-xs text-[#667781]">{phone}</p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="Fechar conversa"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E2E4E8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A884]"
      >
        <i className="fi fi-rr-cross text-xl text-[#54656F]" aria-hidden="true"></i>
      </button>
    </div>
  );
}
