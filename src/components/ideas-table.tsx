"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { STAGE_ORDER, STAGE_LABELS, STATUS_LABELS, type DashboardIdea, type PipelineStage } from "@/lib/types";
import { StageBadge } from "@/components/stage-badge";
import { ScoreDisplay } from "@/components/score-display";
import { EmptyState } from "@/components/empty-state";
import { formatTimeAgo } from "@/lib/format";

type SortField = "title" | "stage" | "latest_score" | "updated_at" | "days_in_stage";
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

  function sortIndicator(field: SortField) {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
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
        <select
          value={stageFilter}
          onChange={(e) => updateFilters(e.target.value, statusFilter)}
          className="bg-ivory-warm border border-mist rounded-precision px-3 py-1.5 text-sm text-graphite font-sans focus:outline-none focus:border-indigo"
        >
          <option value="all">All Stages</option>
          {STAGE_ORDER.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
          <option value="exited">Exited</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => updateFilters(stageFilter, e.target.value)}
          className="bg-ivory-warm border border-mist rounded-precision px-3 py-1.5 text-sm text-graphite font-sans focus:outline-none focus:border-indigo"
        >
          <option value="all">All Status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ideas..."
          className="bg-ivory-warm border border-mist rounded-precision px-3 py-1.5 text-sm text-graphite font-sans focus:outline-none focus:border-indigo w-48"
        />

        <span className="text-xs text-stone ml-auto">
          {filtered.length} idea{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState message="No ideas match the current filters." />
      ) : (
        <div className="bg-ivory-warm border border-mist rounded-precision overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mist text-left">
                  <th
                    className="px-4 py-3 text-stone text-xs font-sans font-medium cursor-pointer hover:text-graphite"
                    onClick={() => toggleSort("title")}
                  >
                    Title{sortIndicator("title")}
                  </th>
                  <th
                    className="px-4 py-3 text-stone text-xs font-sans font-medium cursor-pointer hover:text-graphite"
                    onClick={() => toggleSort("stage")}
                  >
                    Stage{sortIndicator("stage")}
                  </th>
                  <th
                    className="px-4 py-3 text-stone text-xs font-sans font-medium cursor-pointer hover:text-graphite text-right"
                    onClick={() => toggleSort("latest_score")}
                  >
                    Score{sortIndicator("latest_score")}
                  </th>
                  <th
                    className="px-4 py-3 text-stone text-xs font-sans font-medium cursor-pointer hover:text-graphite text-right"
                    onClick={() => toggleSort("days_in_stage")}
                  >
                    Days{sortIndicator("days_in_stage")}
                  </th>
                  <th
                    className="px-4 py-3 text-stone text-xs font-sans font-medium cursor-pointer hover:text-graphite text-right"
                    onClick={() => toggleSort("updated_at")}
                  >
                    Updated{sortIndicator("updated_at")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((idea) => (
                  <tr
                    key={idea.id}
                    onClick={() => router.push(`/ideas/${idea.id}`)}
                    className="border-b border-mist/50 last:border-0 cursor-pointer hover:bg-ivory transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-black truncate max-w-[300px]">
                        {idea.title}
                      </div>
                      {idea.domain_tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {idea.domain_tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] text-stone bg-ivory px-1.5 py-0.5 rounded-precision"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={idea.stage} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ScoreDisplay score={idea.latest_score} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-stone">
                      {idea.days_in_stage}
                    </td>
                    <td className="px-4 py-3 text-right text-stone text-xs">
                      {formatTimeAgo(idea.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
