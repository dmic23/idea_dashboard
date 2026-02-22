import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-32 mb-6" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-16 w-[90px] rounded-md" />
                  {i < 5 && <Skeleton className="w-4 h-px mx-1" />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
