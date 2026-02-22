import type { DashboardIdea, DashboardCost, DashboardResearch } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataCell } from "@/components/data-cell";
import { CostBreakdown } from "@/components/cost-breakdown";
import { EmptyState } from "@/components/empty-state";

interface FinancialsTabProps {
  idea: DashboardIdea;
  costs: DashboardCost[];
  research: DashboardResearch[];
}

export function FinancialsTab({ idea, costs, research }: FinancialsTabProps) {
  const hasFinancials = costs.length > 0 || idea.ad_spend > 0 || idea.total_cost > 0;

  if (!hasFinancials) {
    return <EmptyState message="No financial data available for this idea." />;
  }

  // Find unit economics from research if available
  const latestResearch = research.length > 0 ? research[0] : null;
  const unitEconomics = latestResearch?.business_model?.unit_economics;

  return (
    <div className="space-y-4">
      {/* Cost Overview */}
      <div className="data-grid grid-cols-3 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Total Spend</div>
          <div className="data-value">${idea.total_cost.toFixed(2)}</div>
        </div>
        <div>
          <div className="data-label">Ad Spend</div>
          <div className="data-value">${idea.ad_spend.toFixed(2)}</div>
        </div>
        <div>
          <div className="data-label">Validation Type</div>
          <div className="data-value">{idea.validation_type || "--"}</div>
        </div>
      </div>

      {/* Cost Breakdown */}
      {costs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Cost Breakdown ({costs.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CostBreakdown costs={costs} />
          </CardContent>
        </Card>
      )}

      {/* Unit Economics */}
      {unitEconomics && Object.keys(unitEconomics).length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Unit Economics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(unitEconomics).map(([key, value]) => (
                <DataCell
                  key={key}
                  label={key.replace(/_/g, " ")}
                  value={String(value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
