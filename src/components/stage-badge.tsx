import { Badge } from "@/components/ui/badge";
import { STAGE_LABELS, type PipelineStage } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAGE_VARIANTS: Record<string, string> = {
  discovery: "bg-status-blue/10 text-status-blue border-status-blue/20",
  quick_scan: "bg-status-amber/10 text-status-amber border-status-amber/20",
  deep_dive: "bg-status-amber/10 text-status-amber border-status-amber/20",
  validation: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  mvp_build: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  operating: "bg-status-green/10 text-status-green border-status-green/20",
  exited: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
};

interface StageBadgeProps {
  stage: string;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const colors = STAGE_VARIANTS[stage] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
  const label = STAGE_LABELS[stage as PipelineStage] || stage;

  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-[11px] border", colors, className)}
    >
      {label}
    </Badge>
  );
}
