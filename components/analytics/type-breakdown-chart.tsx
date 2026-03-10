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
import type { TypeBreakdownItem } from "@/lib/analytics-utils"

const BAR_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type TypeBreakdownChartProps = {
  data: TypeBreakdownItem[]
  isLoading?: boolean
  onTypeClick: (type: string) => void
}

const countConfig = {
  count: { label: "Violations", color: "var(--chart-1)" },
} satisfies ChartConfig

const fineConfig = {
  finePotential: { label: "Fine Potential", color: "var(--chart-3)" },
} satisfies ChartConfig

type CountTooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: TypeBreakdownItem }>
}

function CountTooltip({ active, payload }: CountTooltipProps) {
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

type FineTooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; payload: TypeBreakdownItem }>
}

function FineTooltip({ active, payload }: FineTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(item.finePotential)
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
      <p className="text-xs font-medium">{item.label}</p>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{formatted}</span> potential
      </p>
    </div>
  )
}

export function TypeBreakdownChart({ data, isLoading = false, onTypeClick }: TypeBreakdownChartProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Violations by Type</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex gap-4">
            <div className="h-44 flex-1 animate-pulse rounded-lg bg-muted" />
            <div className="h-44 flex-1 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">By Count</p>
              <ChartContainer config={countConfig} className="h-44 w-full">
                <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CountTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={(entry) => onTypeClick(entry.type)}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.type} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Fine Potential</p>
              <ChartContainer config={fineConfig} className="h-44 w-full">
                <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) =>
                      new Intl.NumberFormat("en-IN", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(v)
                    }
                  />
                  <Tooltip content={<FineTooltip />} />
                  <Bar
                    dataKey="finePotential"
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                    onClick={(entry) => onTypeClick(entry.type)}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.type} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
