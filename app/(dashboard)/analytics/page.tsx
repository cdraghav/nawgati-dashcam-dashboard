"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangleIcon,
  BadgeIndianRupeeIcon,
  CheckCircleIcon,
  ClockIcon,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { AnalyticsFilterBar } from "@/components/analytics/analytics-filter-bar"
import { ViolationsTrendChart } from "@/components/analytics/violations-trend-chart"
import { TypeBreakdownChart } from "@/components/analytics/type-breakdown-chart"
import { ReviewStatusChart } from "@/components/analytics/review-status-chart"
import { HourlyDistributionChart } from "@/components/analytics/hourly-distribution-chart"
import { TopAreasChart } from "@/components/analytics/top-areas-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useViolationsList } from "@/hooks/use-queries"
import { useVisualsStore } from "@/lib/store"
import {
  applyDateFilter,
  applyTypeFilter,
  getDailyTrend,
  getHourlyDistribution,
  getTypeBreakdown,
  getTopAreas,
  getReviewSummary,
  getFinePotential,
  exportViolationsCSV,
} from "@/lib/analytics-utils"
import type { QuickRange } from "@/lib/analytics-utils"
import type { IncidentType } from "@/lib/api-types"
import { INCIDENT_TYPE_META } from "@/lib/api-types"

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export default function AnalyticsPage() {
  const router = useRouter()
  const [quickRange, setQuickRange] = React.useState<QuickRange>("30d")
  const [incidentType, setIncidentType] = React.useState<IncidentType | "all">("all")

  const { data, isPending } = useViolationsList(1, 200)
  const reviews = useVisualsStore((s) => s.reviews)

  const allViolations = data?.data ?? []

  const filteredByDate = React.useMemo(
    () => applyDateFilter(allViolations, quickRange),
    [allViolations, quickRange]
  )

  const filtered = React.useMemo(
    () => applyTypeFilter(filteredByDate, incidentType),
    [filteredByDate, incidentType]
  )

  const trendData = React.useMemo(
    () => getDailyTrend(filtered, quickRange),
    [filtered, quickRange]
  )

  const hourlyData = React.useMemo(() => getHourlyDistribution(filtered), [filtered])
  const typeBreakdown = React.useMemo(() => getTypeBreakdown(filtered), [filtered])
  const topAreas = React.useMemo(() => getTopAreas(filtered, 8), [filtered])
  const reviewSummary = React.useMemo(
    () => getReviewSummary(filtered, reviews),
    [filtered, reviews]
  )
  const finePotential = React.useMemo(() => getFinePotential(filtered), [filtered])

  const reviewRate =
    filtered.length > 0
      ? Math.round(((filtered.length - reviewSummary.pending) / filtered.length) * 100)
      : 0

  function handleTypeClick(type: string) {
    router.push(`/violations?type=${type}`)
  }

  function handleExportCSV() {
    exportViolationsCSV(filtered)
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-background">
      <AnalyticsFilterBar
        quickRange={quickRange}
        onQuickRangeChange={setQuickRange}
        incidentType={incidentType}
        onIncidentTypeChange={setIncidentType}
        violationCount={filtered.length}
        onExportCSV={handleExportCSV}
      />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              title="Total Violations"
              value={filtered.length}
              subheading="In selected range"
              icon={AlertTriangleIcon}
              changePercent={0}
              variant="warning"
              isLoading={isPending}
            />
            <StatCard
              title="Fine Potential"
              value={inrFormatter.format(finePotential)}
              subheading="Estimated recoverable"
              icon={BadgeIndianRupeeIcon}
              changePercent={0}
              variant="success"
              isLoading={isPending}
            />
            <StatCard
              title="Review Rate"
              value={`${reviewRate}%`}
              subheading="Violations reviewed"
              icon={CheckCircleIcon}
              changePercent={0}
              variant="default"
              isLoading={isPending}
            />
            <StatCard
              title="Pending Review"
              value={reviewSummary.pending}
              subheading="Awaiting action"
              icon={ClockIcon}
              changePercent={0}
              variant="danger"
              isLoading={isPending}
            />
          </div>

          <ViolationsTrendChart data={trendData} isLoading={isPending} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <TypeBreakdownChart
                data={typeBreakdown}
                isLoading={isPending}
                onTypeClick={handleTypeClick}
              />
            </div>
            <div className="lg:col-span-2">
              <ReviewStatusChart data={reviewSummary} isLoading={isPending} />
            </div>
          </div>

          <HourlyDistributionChart data={hourlyData} isLoading={isPending} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <TopAreasChart data={topAreas} isLoading={isPending} />
            </div>
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Fine Potential by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPending ? (
                    <div className="space-y-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="pb-2 text-left font-medium text-muted-foreground">Type</th>
                            <th className="pb-2 text-right font-medium text-muted-foreground">Fine/viol.</th>
                            <th className="pb-2 text-right font-medium text-muted-foreground">Count</th>
                            <th className="pb-2 text-right font-medium text-muted-foreground">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {(Object.keys(INCIDENT_TYPE_META) as IncidentType[]).map((type) => {
                            const meta = INCIDENT_TYPE_META[type]
                            const count = filtered.filter((v) => v.incident.type === type).length
                            const total = count * meta.fineAmount
                            return (
                              <tr key={type} className="hover:bg-muted/50 transition-colors">
                                <td className="py-2 pr-2 font-medium">{meta.label}</td>
                                <td className="py-2 text-right text-muted-foreground">
                                  {inrFormatter.format(meta.fineAmount)}
                                </td>
                                <td className="py-2 text-right tabular-nums">{count}</td>
                                <td className="py-2 text-right font-semibold tabular-nums">
                                  {inrFormatter.format(total)}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t">
                            <td colSpan={2} className="pt-2 font-semibold">
                              Total
                            </td>
                            <td className="pt-2 text-right font-semibold tabular-nums">
                              {filtered.length}
                            </td>
                            <td className="pt-2 text-right font-semibold tabular-nums">
                              {inrFormatter.format(finePotential)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
