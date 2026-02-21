export interface DashboardIdea {
  id: string;
  title: string;
  description: string;
  source: string;
  stage: string;
  status: string;
  domain_tags: string[];
  created_at: string;
  updated_at: string;
  stage_entered_at: string;
  days_in_stage: number;
  latest_score: number | null;
  latest_decision: string | null;
  review_count: number;
  validation_url: string | null;
  visitors: number;
  signups: number;
  conversion_rate: number;
  mvp_status: string | null;
  deploy_url: string | null;
  repo_url: string | null;
  synced_at: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  event_type: string;
  idea_id: string | null;
  idea_title: string | null;
  details: Record<string, unknown>;
  severity: string;
}

export interface HealthSnapshot {
  id: string;
  timestamp: string;
  database: string;
  redis: string;
  circuit_breakers: Record<string, string>;
  orchestrator_last_run: string | null;
  orchestrator_ideas_processed: number;
}

export type PipelineStage =
  | "discovery"
  | "quick_scan"
  | "deep_dive"
  | "validation"
  | "mvp_build"
  | "operating"
  | "exited";

export const STAGE_ORDER: PipelineStage[] = [
  "discovery",
  "quick_scan",
  "deep_dive",
  "validation",
  "mvp_build",
  "operating",
];

export const STAGE_LABELS: Record<PipelineStage, string> = {
  discovery: "Discovery",
  quick_scan: "Quick Scan",
  deep_dive: "Deep Dive",
  validation: "Validation",
  mvp_build: "MVP Build",
  operating: "Operating",
  exited: "Exited",
};
