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
    <div className="card">
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center">
          <i className={`fi ${icon} text-3xl text-brand`}></i>
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-text-secondary text-body mb-2">{title}</p>
      <p className="text-display text-text-primary">{value}</p>
    </div>
  );
}
