import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number | null;
  className?: string;
}

export function ScoreDisplay({ score, className }: ScoreDisplayProps) {
  if (score === null) {
    return <span className={cn("font-mono text-zinc-500", className)}>--</span>;
  }

  let color = "text-status-red";
  if (score >= 7) color = "text-status-green";
  else if (score >= 5) color = "text-status-amber";

  return (
    <span className={cn("font-mono font-medium", color, className)}>
      {score.toFixed(1)}
    </span>
  );
}
