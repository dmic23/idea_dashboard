import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-48" />

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-zinc-800/50 rounded-md overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 p-3">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-10" />
          </div>
        ))}
      </div>

      {/* Chart card */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>

      {/* Stats card */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-zinc-800/50 rounded-md overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 p-3">
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-5 w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
