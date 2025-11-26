interface IconContainerProps {
  icon: string;
  variant?: 'brand' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export function IconContainer({ 
  icon,
  variant = 'brand',
  size = 'md'
}: IconContainerProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-16 h-16 text-4xl'
  };

  const variantClasses = {
    brand: 'bg-brand-50 text-brand',
    accent: 'bg-accent-50 text-accent-800',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700'
  };

  return (
    <div className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl flex items-center justify-center`}>
      <i className={`fi ${icon}`}></i>
    </div>
  );
}
