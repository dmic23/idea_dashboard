import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-24 mb-6" />
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-[160px]" />
        <Skeleton className="h-9 w-[140px]" />
        <Skeleton className="h-9 w-48" />
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
