'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ 
  value,
  onChange,
  placeholder = "Buscar...",
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"></i>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[42px] pl-10 pr-10 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <i className="fi fi-rr-cross-small text-xl"></i>
        </button>
      )}
    </div>
  );
}
