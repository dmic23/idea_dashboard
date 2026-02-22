import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Inbox className="h-8 w-8 text-zinc-700 mb-3" />
        <p className="text-sm text-zinc-500 text-center max-w-md">{message}</p>
      </CardContent>
    </Card>
  );
}
