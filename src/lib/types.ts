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
  mvp_status: string | null;
  build_error: string | null;
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

// Studio types

export type StudioPhase =
  | "INTAKE"
  | "BUILD"
  | "DISTRIBUTE"
  | "MEASURE"
  | "ITERATE"
  | "SCALE"
  | "KILLED";

export const STUDIO_PHASE_ORDER: StudioPhase[] = [
  "INTAKE",
  "BUILD",
  "DISTRIBUTE",
  "MEASURE",
  "ITERATE",
  "SCALE",
];

export const STUDIO_PHASE_LABELS: Record<StudioPhase, string> = {
  INTAKE: "Intake",
  BUILD: "Build",
  DISTRIBUTE: "Distribute",
  MEASURE: "Measure",
  ITERATE: "Iterate",
  SCALE: "Scale",
  KILLED: "Killed",
};

export interface DashboardStudioProduct {
  id: string;
  idea_id: string;
  name: string;
  phase: StudioPhase;
  customer_type: string;
  form_factor: string;
  budget_tier: number;
  budget_spent: number;
  iteration_count: number;
  failed_iterations: number;
  deploy_url: string | null;
  repo_url: string | null;
  created_at: string;
  killed_at: string | null;
  kill_reason: string | null;
  agent_count: number;
  active_agent_types: string[];
  visitors: number;
  signups: number;
  active_users: number;
  d7_retention: number;
  recommendation: string | null;
  latest_iteration_number: number;
  latest_iteration_outcome: string | null;
  distribution_post_count: number;
  synced_at: string;
}

export interface DashboardStudioActivity {
  id: string;
  product_id: string;
  product_name: string;
  event_type: string;
  title: string;
  detail: string;
  outcome: string | null;
  event_at: string;
  synced_at: string;
}

export interface DashboardStudioLearning {
  id: string;
  product_id: string | null;
  product_name: string | null;
  category: string;
  title: string;
  insight: string;
  confidence: number | null;
  times_applied: number;
  times_validated: number;
  created_at: string;
  synced_at: string;
}

export const FORM_FACTOR_LABELS: Record<string, string> = {
  WEB_APP: "Web App",
  API: "API",
  EXTENSION: "Extension",
  CLI: "CLI",
  BOT: "Bot",
  MARKETPLACE: "Marketplace",
  MCP_SERVER: "MCP Server",
};

export const CUSTOMER_TYPE_LABELS: Record<string, string> = {
  HUMAN: "B2C",
  AGENT: "B2A",
};

export const AGENT_TYPE_LABELS: Record<string, string> = {
  PRODUCT_LEAD: "Product Lead",
  DESIGN: "Design",
  ENGINEERING: "Engineering",
  DISTRIBUTION: "Distribution",
  ANALYTICS: "Analytics",
  OPERATIONS: "Operations",
  SALES: "Sales",
  SUPPORT: "Support",
  MARKETING: "Marketing",
  SOCIAL: "Social",
  SEO: "SEO",
  PARTNERSHIPS: "Partnerships",
};
