"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

type ReviewSummary = {
  pending: number
  approved: number
  rejected: number
  flagged: number
  total: number
}

type ReviewStatusChartProps = {
  data: ReviewSummary
  isLoading?: boolean
}

const STATUS_CONFIG = [
  { key: "pending" as const, label: "Pending", color: "var(--semantic-colors-warning-3)" },
  { key: "approved" as const, label: "Approved", color: "var(--semantic-colors-success-3)" },
  { key: "rejected" as const, label: "Rejected", color: "var(--semantic-colors-error-3)" },
  { key: "flagged" as const, label: "Flagged", color: "var(--semantic-colors-info-3)" },
]

const chartConfig = {
  pending: { label: "Pending", color: "var(--semantic-colors-warning-3)" },
  approved: { label: "Approved", color: "var(--semantic-colors-success-3)" },
  rejected: { label: "Rejected", color: "var(--semantic-colors-error-3)" },
  flagged: { label: "Flagged", color: "var(--semantic-colors-info-3)" },
} satisfies ChartConfig

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
      <p className="text-xs font-medium">{item.name}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{item.value}</span> violations
      </p>
    </div>
  )
}

export function ReviewStatusChart({ data, isLoading = false }: ReviewStatusChartProps) {
  const chartData = STATUS_CONFIG.map((s) => ({
    name: s.label,
    value: data[s.key],
    fill: s.color,
  })).filter((d) => d.value > 0)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Review Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-40 w-40 animate-pulse rounded-full bg-muted" />
            <div className="w-full space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="relative mx-auto h-40 w-40">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={64}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold tabular-nums">{data.total}</span>
                <span className="text-xs text-muted-foreground">total</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {STATUS_CONFIG.map((s) => {
                const count = data[s.key]
                const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0
                return (
                  <li key={s.key} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="flex-1 text-muted-foreground">{s.label}</span>
                    <span className="font-semibold tabular-nums">{count}</span>
                    <span className="text-muted-foreground">({pct}%)</span>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
