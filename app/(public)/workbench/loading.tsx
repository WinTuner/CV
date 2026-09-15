import { PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeaderSkeleton />

      {/* Workbench items skeleton */}
      <div className="space-y-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-2/3 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
