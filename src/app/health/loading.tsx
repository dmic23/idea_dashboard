import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-36 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-[240px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
