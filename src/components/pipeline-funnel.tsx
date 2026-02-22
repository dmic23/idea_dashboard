import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { STAGE_LABELS, STAGE_ORDER, type DashboardIdea } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PipelineFunnelProps {
  ideas: DashboardIdea[];
}

const STAGE_COLORS: Record<string, string> = {
  discovery: "bg-status-blue/10 text-status-blue",
  quick_scan: "bg-status-amber/10 text-status-amber",
  deep_dive: "bg-status-amber/10 text-status-amber",
  validation: "bg-purple-500/10 text-purple-400",
  mvp_build: "bg-emerald-500/10 text-emerald-400",
  operating: "bg-status-green/10 text-status-green",
};

export function PipelineFunnel({ ideas }: PipelineFunnelProps) {
  const stageCounts = STAGE_ORDER.reduce(
    (acc, stage) => {
      acc[stage] = ideas.filter((i) => i.stage === stage && i.status === "active").length;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalActive = ideas.filter((i) => i.status === "active").length;
  const operating = stageCounts["operating"] || 0;
  const exited = ideas.filter((i) => i.stage === "exited").length;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STAGE_ORDER.map((stage, i) => (
            <div key={stage} className="flex items-center">
              <Link
                href={`/ideas?stage=${stage}`}
                className={cn(
                  "flex flex-col items-center px-4 py-3 rounded-md transition-colors min-w-[90px]",
                  "hover:bg-zinc-800",
                  STAGE_COLORS[stage]
                )}
              >
                <span className="font-mono text-2xl font-semibold">
                  {stageCounts[stage]}
                </span>
                <span className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
                  {STAGE_LABELS[stage]}
                </span>
              </Link>
              {i < STAGE_ORDER.length - 1 && (
                <div className="w-4 h-px bg-zinc-800 mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border text-sm">
          <span className="text-zinc-500">
            Active: <span className="font-mono text-zinc-50">{totalActive}</span>
          </span>
          <span className="text-zinc-500">
            Operating: <span className="font-mono text-status-green">{operating}</span>
          </span>
          <span className="text-zinc-500">
            Exited: <span className="font-mono text-zinc-400">{exited}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
