export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
      {/* Hero section skeleton */}
      <div className="mb-12 space-y-4 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded-md" />
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="h-6 w-96 bg-muted rounded-md opacity-70" />
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        {/* Blog items skeletons */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="rounded-xl border border-border/50 bg-card/20 p-6 sm:p-7 space-y-4 animate-pulse"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[240px] h-[180px] md:h-[160px] shrink-0 bg-muted rounded-xl" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-20 bg-muted rounded-lg" />
                    <div className="h-4 w-32 bg-muted rounded ml-auto" />
                  </div>
                  <div className="h-8 w-3/4 bg-muted rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-5/6 bg-muted rounded" />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-9 w-9 rounded-full bg-muted" />
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-8 hidden lg:block">
          <div className="rounded-xl border border-border/50 bg-card/20 p-6 space-y-4 animate-pulse">
            <div className="h-6 w-24 bg-muted rounded-md" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-full bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
