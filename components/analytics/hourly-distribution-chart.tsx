"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

type HourlyDataPoint = {
  hour: number
  label: string
  count: number
}

type HourlyDistributionChartProps = {
  data: HourlyDataPoint[]
  isLoading?: boolean
}

function getHourColor(hour: number): string {
  if (hour >= 0 && hour < 6) return "var(--chart-5)"
  if (hour >= 6 && hour < 12) return "var(--chart-4)"
  if (hour >= 12 && hour < 18) return "var(--chart-1)"
  return "var(--chart-3)"
}

const chartConfig = {
  count: { label: "Violations", color: "var(--chart-1)" },
} satisfies ChartConfig

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: HourlyDataPoint }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
      <p className="text-xs font-medium">{item.label}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{item.count}</span> violations
      </p>
    </div>
  )
}

export function HourlyDistributionChart({ data, isLoading = false }: HourlyDistributionChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 0)
  const SHOW_TICKS = [0, 6, 12, 18, 23]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hourly Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-44 w-full animate-pulse rounded-lg bg-muted" />
        ) : (
          <ChartContainer config={chartConfig} className="h-44 w-full">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                tickFormatter={(value: string, index: number) =>
                  SHOW_TICKS.includes(index) ? value : ""
                }
              />
              <YAxis
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.hour}
                    fill={getHourColor(entry.hour)}
                    opacity={entry.count === maxCount && maxCount > 0 ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
        <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--chart-5)" }} />
            Midnight–6am
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--chart-4)" }} />
            6am–Noon
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--chart-1)" }} />
            Noon–6pm
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--chart-3)" }} />
            6pm–Midnight
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
