import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20 mt-1.5" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
