import Link from "next/link";
import { STAGE_LABELS, STAGE_ORDER, type DashboardIdea } from "@/lib/types";

interface PipelineFunnelProps {
  ideas: DashboardIdea[];
}

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
    <div className="bg-ivory-warm border border-mist rounded-precision p-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {STAGE_ORDER.map((stage, i) => (
          <div key={stage} className="flex items-center">
            <Link
              href={`/ideas?stage=${stage}`}
              className="flex flex-col items-center px-4 py-3 rounded-precision hover:bg-ivory transition-colors min-w-[90px]"
            >
              <span className="font-mono text-2xl text-black font-medium">
                {stageCounts[stage]}
              </span>
              <span className="text-xs text-stone mt-1 whitespace-nowrap">
                {STAGE_LABELS[stage]}
              </span>
            </Link>
            {i < STAGE_ORDER.length - 1 && (
              <span className="text-mist mx-1">&rarr;</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-mist text-sm">
        <span className="text-stone">
          Active: <span className="font-mono text-black">{totalActive}</span>
        </span>
        <span className="text-stone">
          Operating: <span className="font-mono text-status-green">{operating}</span>
        </span>
        <span className="text-stone">
          Exited: <span className="font-mono text-graphite">{exited}</span>
        </span>
      </div>
    </div>
  );
}
