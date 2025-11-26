interface StatusBadgeProps {
  status: 'active' | 'inactive';
  activeLabel?: string;
  inactiveLabel?: string;
  showIcon?: boolean;
}

export function StatusBadge({ 
  status,
  activeLabel = "Ativo",
  inactiveLabel = "Inativo",
  showIcon = true
}: StatusBadgeProps) {
  const isActive = status === 'active';
  
  return (
    <span className={`badge ${isActive ? 'badge-success' : 'badge-error'}`}>
      {showIcon && (
        <i className={`fi ${isActive ? 'fi-rr-check-circle' : 'fi-rr-cross-circle'} text-xs mr-1`}></i>
      )}
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
