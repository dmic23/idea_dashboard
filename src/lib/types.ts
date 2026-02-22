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

export const DECISION_LABELS: Record<string, string> = {
  ADVANCE: "Advance",
  ITERATE: "Iterate",
  KILL: "Kill",
  ESCALATE: "Escalate",
  HOLD: "Hold",
};

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  killed: "Killed",
  exited: "Exited",
};

export interface DashboardBusiness {
  id: string;
  idea_id: string;
  name: string;
  domain: string | null;
  status: string;
  disposition: string;
  revenue: number;
  costs: number;
  profit: number;
  mrr: number;
  users: number;
  active_users: number;
  churn_rate: number;
  launched_at: string | null;
  deploy_url: string | null;
  synced_at: string;
}

export interface DashboardPattern {
  id: string;
  pattern_type: string;
  description: string;
  confidence: number;
  sample_size: number;
  conditions: Record<string, unknown>;
  outcome: Record<string, unknown>;
  synced_at: string;
}
