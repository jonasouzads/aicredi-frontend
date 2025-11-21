export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-background rounded ${className}`}></div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 border-b border-background">
      <div className="flex-1">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
  );
}
