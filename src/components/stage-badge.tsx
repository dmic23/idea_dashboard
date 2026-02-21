import { STAGE_LABELS, type PipelineStage } from "@/lib/types";

const STAGE_COLORS: Record<string, string> = {
  discovery: "bg-indigo/10 text-indigo",
  quick_scan: "bg-status-yellow/10 text-status-yellow",
  deep_dive: "bg-status-yellow/10 text-status-yellow",
  validation: "bg-indigo/10 text-indigo",
  mvp_build: "bg-indigo/10 text-indigo",
  operating: "bg-status-green/10 text-status-green",
  exited: "bg-stone/10 text-stone",
};

interface StageBadgeProps {
  stage: string;
  className?: string;
}

export function StageBadge({ stage, className = "" }: StageBadgeProps) {
  const colors = STAGE_COLORS[stage] || "bg-stone/10 text-stone";
  const label = STAGE_LABELS[stage as PipelineStage] || stage;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-precision text-xs font-mono ${colors} ${className}`}
    >
      {label}
    </span>
  );
}
