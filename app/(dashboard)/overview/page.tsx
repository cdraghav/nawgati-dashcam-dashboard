"use client"

import * as React from "react"
import {
  CarIcon,
  AlertTriangleIcon,
  FileTextIcon,
  MapPinIcon,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentViolationsList } from "@/components/dashboard/recent-violations-list"
import { ViolationPieChart } from "@/components/dashboard/violation-pie-chart"
import { useOverview } from "@/hooks/use-queries"
import { applyTypeFilter, type QuickRange } from "@/lib/analytics-utils"
import type { IncidentType } from "@/lib/api-types"
import { INCIDENT_TYPE_META } from "@/lib/api-types"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function bpsToPercent(bps: number): number {
  return bps / 100
}

const QUICK_RANGES: { label: string; value: QuickRange }[] = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
]

export default function DashboardPage() {
  const [quickRange, setQuickRange] = React.useState<QuickRange>("today")
  const [incidentType, setIncidentType] = React.useState<IncidentType | "all">("all")

  const { data, isPending, isError } = useOverview(quickRange)

  const filteredViolations = React.useMemo(() => {
    const violations = data?.recent_violations ?? []
    return applyTypeFilter(violations, incidentType)
  }, [data?.recent_violations, incidentType])

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  const stats = data?.stats

  const statCards = [
    {
      title: "Vehicles Detected",
      value: stats?.vehicles_detected.count ?? 0,
      subheading: "Unique vehicles",
      icon: CarIcon,
      changePercent: bpsToPercent(stats?.vehicles_detected.change_bps ?? 0),
      variant: "default" as const,
    },
    {
      title: "Violations Detected",
      value: stats?.violations_detected.count ?? 0,
      subheading: "Total violations",
      icon: AlertTriangleIcon,
      changePercent: bpsToPercent(stats?.violations_detected.change_bps ?? 0),
      variant: "warning" as const,
    },
    {
      title: "Challans Issued",
      value: stats?.challans_issued.count ?? 0,
      subheading: "Challans issued",
      icon: FileTextIcon,
      changePercent: bpsToPercent(stats?.challans_issued.change_bps ?? 0),
      variant: "success" as const,
    },
    {
      title: "High Risk Zones",
      value: stats?.high_risk_zones.count ?? 0,
      subheading: "Locations with 3+ violations",
      icon: MapPinIcon,
      changePercent: bpsToPercent(stats?.high_risk_zones.change_bps ?? 0),
      variant: "danger" as const,
    },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/40 p-1">
          {QUICK_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setQuickRange(r.value)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-all",
                quickRange === r.value
                  ? "text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={
                quickRange === r.value
                  ? { backgroundColor: "var(--brand-secondary)", borderColor: "var(--brand-secondary)" }
                  : {}
              }
            >
              {r.label}
            </button>
          ))}
        </div>

        <Select value={incidentType} onValueChange={(v) => setIncidentType(v as IncidentType | "all")}>
          <SelectTrigger className="h-8 w-44 text-xs">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Types</SelectItem>
            {(Object.keys(INCIDENT_TYPE_META) as IncidentType[]).map((type) => (
              <SelectItem key={type} value={type} className="text-xs">
                {INCIDENT_TYPE_META[type].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 px-4 pt-4 md:grid-cols-4 xl:grid-cols-4 sm:px-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} isLoading={isPending} />
        ))}
      </div>

      {/* Bottom row — fills remaining height */}
      <div className="flex-1 min-h-0 grid grid-cols-1 gap-4 px-4 pb-4 pt-4 sm:px-6 sm:pb-6 lg:grid-cols-5">
        <div className="lg:col-span-3 min-h-0 flex flex-col">
          <RecentViolationsList
            violations={filteredViolations}
            isLoading={isPending}
          />
        </div>
        <div className="lg:col-span-2 min-h-0 flex flex-col">
          <ViolationPieChart
            violations={filteredViolations}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}
