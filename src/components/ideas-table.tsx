"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronUp, ChevronDown, CircleAlert } from "lucide-react";
import { STAGE_ORDER, STAGE_LABELS, STATUS_LABELS, type DashboardIdea, type PipelineStage } from "@/lib/types";
import { StageBadge } from "@/components/stage-badge";
import { ScoreDisplay } from "@/components/score-display";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTimeAgo } from "@/lib/format";

type SortField = "title" | "stage" | "latest_score" | "updated_at" | "days_in_stage" | "total_cost";
type SortDir = "asc" | "desc";

interface IdeasTableProps {
  ideas: DashboardIdea[];
}

export function IdeasTable({ ideas }: IdeasTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stageFilter, setStageFilter] = useState(searchParams.get("stage") || "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = ideas;

    if (stageFilter !== "all") {
      result = result.filter((i) => i.stage === stageFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "stage":
          cmp =
            STAGE_ORDER.indexOf(a.stage as PipelineStage) -
            STAGE_ORDER.indexOf(b.stage as PipelineStage);
          break;
        case "latest_score":
          cmp = (a.latest_score ?? -1) - (b.latest_score ?? -1);
          break;
        case "updated_at":
          cmp = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case "days_in_stage":
          cmp = a.days_in_stage - b.days_in_stage;
          break;
        case "total_cost":
          cmp = (a.total_cost ?? 0) - (b.total_cost ?? 0);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [ideas, stageFilter, statusFilter, search, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "title" ? "asc" : "desc");
    }
  }

  function sortIcon(field: SortField) {
    if (sortField !== field) return null;
    return sortDir === "asc"
      ? <ChevronUp className="h-3 w-3 inline ml-1" />
      : <ChevronDown className="h-3 w-3 inline ml-1" />;
  }

  function updateFilters(stage: string, status: string) {
    setStageFilter(stage);
    setStatusFilter(status);
    const params = new URLSearchParams();
    if (stage !== "all") params.set("stage", stage);
    if (status !== "all") params.set("status", status);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/ideas", { scroll: false });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={stageFilter} onValueChange={(v) => updateFilters(v, statusFilter)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGE_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {STAGE_LABELS[s]}
              </SelectItem>
            ))}
            <SelectItem value="exited">Exited</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => updateFilters(stageFilter, v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas..."
            className="pl-9 w-48"
          />
        </div>

        <span className="text-xs text-zinc-500 ml-auto">
          {filtered.length} idea{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState message="No ideas match the current filters." />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className="cursor-pointer hover:text-zinc-300"
                  onClick={() => toggleSort("title")}
                >
                  Title {sortIcon("title")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-zinc-300"
                  onClick={() => toggleSort("stage")}
                >
                  Stage {sortIcon("stage")}
                </TableHead>
                <TableHead className="w-20">Experts</TableHead>
                <TableHead
                  className="cursor-pointer hover:text-zinc-300 text-right"
                  onClick={() => toggleSort("latest_score")}
                >
                  Score {sortIcon("latest_score")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-zinc-300 text-right"
                  onClick={() => toggleSort("total_cost")}
                >
                  Cost {sortIcon("total_cost")}
                </TableHead>
                <TableHead className="w-10">Risk</TableHead>
                <TableHead
                  className="cursor-pointer hover:text-zinc-300 text-right"
                  onClick={() => toggleSort("days_in_stage")}
                >
                  Days {sortIcon("days_in_stage")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-zinc-300 text-right"
                  onClick={() => toggleSort("updated_at")}
                >
                  Updated {sortIcon("updated_at")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((idea) => (
                <TableRow
                  key={idea.id}
                  onClick={() => router.push(`/ideas/${idea.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="font-medium text-zinc-50 truncate max-w-[300px]">
                      {idea.title}
                    </div>
                    {idea.domain_tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {idea.domain_tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={idea.stage} />
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-xs text-zinc-400">
                      {idea.expert_count > 0 ? idea.expert_count : "--"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ScoreDisplay score={idea.latest_score} />
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-xs text-zinc-400">
                      {idea.total_cost > 0 ? `$${idea.total_cost.toFixed(0)}` : "--"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {idea.latest_decision === "kill" || idea.latest_decision === "KILL" ? (
                      <CircleAlert className="h-3 w-3 text-status-red inline" />
                    ) : idea.latest_score !== null && idea.latest_score < 6 ? (
                      <CircleAlert className="h-3 w-3 text-status-amber inline" />
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right font-mono text-zinc-500">
                    {idea.days_in_stage}
                  </TableCell>
                  <TableCell className="text-right text-zinc-500 text-xs">
                    {formatTimeAgo(idea.updated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
