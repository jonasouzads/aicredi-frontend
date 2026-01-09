interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="card group hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center group-hover:bg-brand-100 transition-colors duration-200" aria-hidden="true">
          <i className={`fi ${icon} text-2xl text-brand`}></i>
        </div>
        {trend && (
          <span 
            className={`text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}
            aria-label={`Tendência: ${trend.value}`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-sm mb-1.5">{title}</p>
      <p className="text-2xl text-text-primary font-bold">{value}</p>
    </div>
  );
}
