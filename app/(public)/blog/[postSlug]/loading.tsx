export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      {/* Back button skeleton */}
      <div className="mb-8 h-8 w-24 bg-muted animate-pulse rounded-md" />

      {/* Article Header skeleton */}
      <div className="space-y-6 mb-12 animate-pulse">
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 bg-muted rounded-md" />
          <div className="h-6 w-32 bg-muted rounded-md" />
        </div>
        <div className="h-12 w-full bg-muted rounded-lg" />
        <div className="h-12 w-2/3 bg-muted rounded-lg" />
        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="space-y-1">
            <div className="h-4.5 w-28 bg-muted rounded" />
            <div className="h-3.5 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>

      {/* Main Content Area skeleton */}
      <div className="space-y-8 animate-pulse">
        <div className="h-[300px] w-full bg-muted rounded-xl" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/5 bg-muted rounded" />
        </div>
        <div className="h-8 w-1/3 bg-muted rounded-lg pt-4" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-11/12 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
