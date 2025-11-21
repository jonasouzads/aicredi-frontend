export function KanbanSkeleton() {
  return (
    <div className="h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Kanban Columns Skeleton */}
      <div className="flex gap-4 overflow-x-auto flex-1 pb-6">
        {/* Column 1 */}
        <div className="flex-1 min-w-[300px] max-w-[300px] rounded-xl bg-[#ebecf0] p-3">
          {/* Column Header */}
          <div className="mb-3">
            <div className="flex items-center justify-between px-2">
              <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-8 bg-white rounded animate-pulse"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 shadow-sm animate-pulse"
              >
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex-1 min-w-[300px] max-w-[300px] rounded-xl bg-[#ebecf0] p-3">
          <div className="mb-3">
            <div className="flex items-center justify-between px-2">
              <div className="h-5 w-36 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-8 bg-white rounded animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 shadow-sm animate-pulse"
              >
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex-1 min-w-[300px] max-w-[300px] rounded-xl bg-[#ebecf0] p-3">
          <div className="mb-3">
            <div className="flex items-center justify-between px-2">
              <div className="h-5 w-28 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-8 bg-white rounded animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 shadow-sm animate-pulse"
              >
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
