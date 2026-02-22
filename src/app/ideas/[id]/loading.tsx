import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-20" />
      <Card>
        <CardContent className="pt-6 space-y-3">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="flex items-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-7 h-7 rounded-full" />
                {i < 5 && <Skeleton className="w-6 h-px mx-0.5" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-7 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
