interface PageSkeletonProps {
  hasHeader?: boolean;
  hasAction?: boolean;
  gridCols?: 2 | 3 | 4;
  cardCount?: number;
}

export function PageSkeleton({ 
  hasHeader = true,
  hasAction = true,
  gridCols = 3,
  cardCount = 6
}: PageSkeletonProps) {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[gridCols];

  return (
    <div>
      {/* Header Skeleton */}
      {hasHeader && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="animate-pulse bg-surface rounded h-8 w-48 mb-2"></div>
            <div className="animate-pulse bg-surface rounded h-4 w-96"></div>
          </div>
          {hasAction && (
            <div className="animate-pulse bg-surface rounded-pill h-11 w-32"></div>
          )}
        </div>
      )}

      {/* Cards Grid Skeleton */}
      <div className={`grid ${gridClass} gap-6`}>
        {Array.from({ length: cardCount }).map((_, i) => (
          <div key={i} className="card">
            <div className="flex items-start gap-4">
              <div className="animate-pulse bg-background rounded-xl w-14 h-14"></div>
              <div className="flex-1">
                <div className="animate-pulse bg-background rounded h-6 w-3/4 mb-3"></div>
                <div className="animate-pulse bg-background rounded h-4 w-full mb-2"></div>
                <div className="animate-pulse bg-background rounded h-4 w-2/3"></div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <div className="animate-pulse bg-background rounded-xl h-10 flex-1"></div>
              <div className="animate-pulse bg-background rounded-xl h-10 flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
