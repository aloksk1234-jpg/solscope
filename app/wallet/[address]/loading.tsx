import { DashboardSkeleton } from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Skeleton top bar */}
      <div
        className="border-b h-14"
        style={{ borderColor: "var(--card-border)", background: "var(--background)" }}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <DashboardSkeleton />
      </div>
    </main>
  );
}
