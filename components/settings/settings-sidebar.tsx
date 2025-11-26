'use client';

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  {
    id: 'default-messages',
    name: 'Mensagens Padrão',
    icon: 'fi-rr-comment-alt',
  },
  // Adicionar mais seções no futuro
];

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="w-64 bg-surface rounded-2xl p-4 flex-shrink-0 h-fit">
      <h2 className="text-lg font-semibold text-text-primary mb-4 px-2">
        Configurações
      </h2>
      
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
              ${activeSection === section.id
                ? 'bg-brand-50 text-brand font-medium'
                : 'text-text-secondary hover:bg-background hover:text-text-primary'
              }
            `}
          >
            <i className={`fi ${section.icon} text-lg`}></i>
            <span className="text-sm">{section.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
