"use client"

import * as React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

type TrendDataPoint = {
  label: string
  key: string
  count: number
}

type ViolationsTrendChartProps = {
  data: TrendDataPoint[]
  isLoading?: boolean
}

const chartConfig = {
  count: {
    label: "Violations",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: TrendDataPoint }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
      <p className="text-xs font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{payload[0].value}</span> violations
      </p>
    </div>
  )
}

export function ViolationsTrendChart({ data, isLoading = false }: ViolationsTrendChartProps) {
  const tickInterval = Math.max(1, Math.floor(data.length / 8))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Violations Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-52 w-full animate-pulse rounded-lg bg-muted" />
        ) : (
          <ChartContainer config={chartConfig} className="h-52 w-full">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={tickInterval}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#trendGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
