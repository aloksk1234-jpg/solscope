function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ""}`}
      style={{ background: "var(--card-border)" }}
    />
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-4">
      {/* Total value card */}
      <div
        className="rounded-xl border p-6 space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-10 w-48" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-4 space-y-2"
            style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
          >
            <Shimmer className="h-2.5 w-20" />
            <Shimmer className="h-6 w-16" />
            <Shimmer className="h-2 w-14" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="rounded-xl border p-4 space-y-3"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
      >
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-64 w-full" />
      </div>
    </div>
  );
}

export function TokenTableSkeleton() {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--card-border)" }}>
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-20" />
      </div>
      <div className="p-4 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Shimmer className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-2.5 w-12" />
            </div>
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NFTGridSkeleton() {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <div className="p-4 border-b" style={{ borderColor: "var(--card-border)" }}>
        <Shimmer className="h-3 w-16" />
      </div>
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Shimmer className="aspect-square w-full rounded-lg" />
            <Shimmer className="h-3 w-3/4" />
            <Shimmer className="h-2.5 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HealthScoreSkeleton() {
  return (
    <div
      className="rounded-xl border p-6 space-y-6"
      style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
    >
      <Shimmer className="h-3 w-32" />
      <Shimmer className="w-40 h-40 rounded-full mx-auto" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Shimmer className="h-2.5 w-28" />
              <Shimmer className="h-2.5 w-8" />
            </div>
            <Shimmer className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <Shimmer className="h-6 w-48" />
        <Shimmer className="h-6 w-24 rounded-full" />
      </div>
      <PortfolioSkeleton />
      <TokenTableSkeleton />
      <NFTGridSkeleton />
    </div>
  );
}
