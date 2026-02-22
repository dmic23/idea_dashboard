import { ExternalLink } from "@/components/external-link";
import { Badge } from "@/components/ui/badge";

interface Competitor {
  name: string;
  url?: string;
  strengths?: string[];
  weaknesses?: string[];
}

interface CompetitorRowProps {
  competitor: Competitor;
}

export function CompetitorRow({ competitor }: CompetitorRowProps) {
  return (
    <div className="border border-border rounded-md p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-zinc-200">{competitor.name}</span>
        {competitor.url && (
          <ExternalLink href={competitor.url} className="text-xs">
            Visit
          </ExternalLink>
        )}
      </div>
      {(competitor.strengths?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1">
          {competitor.strengths!.map((s, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] bg-status-green/10 text-status-green border-status-green/20">
              {s}
            </Badge>
          ))}
        </div>
      )}
      {(competitor.weaknesses?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1">
          {competitor.weaknesses!.map((w, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] bg-status-red/10 text-status-red border-status-red/20">
              {w}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
