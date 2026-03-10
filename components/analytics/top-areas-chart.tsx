"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

type AreaDataPoint = {
  area: string
  count: number
}

type TopAreasChartProps = {
  data: AreaDataPoint[]
  isLoading?: boolean
}

const chartConfig = {
  count: { label: "Violations", color: "var(--chart-3)" },
} satisfies ChartConfig

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: AreaDataPoint }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
      <p className="text-xs font-medium">{item.area}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{item.count}</span> violations
      </p>
    </div>
  )
}

function truncateLabel(label: string, maxLen = 16): string {
  if (label.length <= maxLen) return label
  return label.slice(0, maxLen - 1) + "…"
}

export function TopAreasChart({ data, isLoading = false }: TopAreasChartProps) {
  const chartHeight = Math.max(200, data.length * 36)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hotspot Areas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-52 w-full animate-pulse rounded-lg bg-muted" />
        ) : data.length === 0 ? (
          <div className="flex h-52 items-center justify-center">
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full" style={{ height: chartHeight }}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 48, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/50" />
              <XAxis
                type="number"
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="area"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={100}
                tickFormatter={(v: string) => truncateLabel(v)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--chart-3)" radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="count"
                  position="right"
                  style={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
