import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-4">
      {/* Back link */}
      <Skeleton className="h-4 w-20" />

      {/* Header card */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-72" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-3/4 max-w-xl" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab navigation */}
      <div className="flex border-b border-border">
        {["Overview", "Research", "Experts", "Financials", "History"].map((tab) => (
          <div key={tab} className="px-4 py-2.5">
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Tab content skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-7 h-7 rounded-full" />
                {i < 5 && <Skeleton className="w-6 h-px mx-0.5" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-px bg-zinc-800/50 rounded-md overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 p-3">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-px bg-zinc-800/50 rounded-md overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 p-3">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
