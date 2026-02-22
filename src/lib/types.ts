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
  source_url: string | null;
  target_user: string | null;
  differentiation: string | null;
  mvp_scope: string | null;
  mvp_tech_stack: Record<string, unknown> | null;
  total_cost: number;
  expert_count: number;
  pivot_count: number;
  decision_count: number;
  has_research: boolean;
  validation_type: string | null;
  ad_spend: number;
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
  repo_url: string | null;
  validation_url: string | null;
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

export interface DashboardResearch {
  id: string;
  idea_id: string;
  stage: string;
  market_size: { tam?: string; sam?: string; som?: string; growth_rate?: string } | null;
  competitors: Array<{ name: string; url?: string; strengths?: string[]; weaknesses?: string[] }> | null;
  feasibility: { score?: number; technical_risk?: string; dependencies?: string[] } | null;
  business_model: { model?: string; revenue_streams?: string[]; unit_economics?: Record<string, unknown> } | null;
  ai_operability_score: number | null;
  created_at: string;
  synced_at: string;
}

export interface DashboardReview {
  id: string;
  idea_id: string;
  gate: string;
  expert_scores: Record<string, number>;
  weighted_average: number;
  veto_flags: Array<{ expert: string; reason: string; severity: string }>;
  decision: string;
  reasoning: string;
  iteration_number: number;
  created_at: string;
  synced_at: string;
}

export interface DashboardExpertReview {
  id: string;
  review_id: string;
  idea_id: string;
  expert_type: string;
  score: number;
  reasoning: string;
  concerns: string[];
  created_at: string;
  synced_at: string;
}

export interface DashboardCost {
  id: string;
  idea_id: string;
  category: string;
  amount: number;
  description: string;
  created_at: string;
  synced_at: string;
}

export interface DashboardDecision {
  id: string;
  idea_id: string;
  decision_type: string;
  made_by: string;
  reasoning: string;
  created_at: string;
  synced_at: string;
}

export interface DashboardPivot {
  id: string;
  idea_id: string;
  pivot_number: number;
  pivot_type: string;
  original_state: Record<string, unknown>;
  new_direction: string;
  reasoning: string;
  outcome: string;
  created_at: string;
  synced_at: string;
}
