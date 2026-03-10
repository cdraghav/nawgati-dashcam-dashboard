"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Pie, PieChart, Cell, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { NgtNumber } from "@/components/ui/vsl"
import { INCIDENT_TYPE_META } from "@/lib/api-types"
import type { ApiViolation, IncidentType } from "@/lib/api-types"

const PIE_INCIDENT_TYPES: IncidentType[] = [
  "insurance_expired",
  "pucc_expired",
  "road_tax_unpaid",
  "fitness_expired",
  "eol",
]

const chartConfig = {
  insurance_expired: {
    label: INCIDENT_TYPE_META.insurance_expired.label,
    color: "var(--chart-1)",
  },
  pucc_expired: {
    label: INCIDENT_TYPE_META.pucc_expired.label,
    color: "var(--chart-2)",
  },
  road_tax_unpaid: {
    label: INCIDENT_TYPE_META.road_tax_unpaid.label,
    color: "var(--chart-3)",
  },
  fitness_expired: {
    label: INCIDENT_TYPE_META.fitness_expired.label,
    color: "var(--chart-4)",
  },
  eol: {
    label: INCIDENT_TYPE_META.eol.label,
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

type CustomTooltipProps = {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-sm">
      <p className="text-xs font-semibold">{item.name}</p>
      <p className="text-xs text-muted-foreground">
        <NgtNumber value={item.value} size="xs" className="font-semibold" /> violations
      </p>
    </div>
  )
}

type ViolationPieChartProps = {
  violations: ApiViolation[]
  isLoading?: boolean
}

export function ViolationPieChart({ violations, isLoading = false }: ViolationPieChartProps) {
  const router = useRouter()
  const distribution = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const v of violations) {
      counts[v.incident.type] = (counts[v.incident.type] ?? 0) + 1
    }
    return counts
  }, [violations])

  const data = PIE_INCIDENT_TYPES.map((type) => ({
    name: chartConfig[type].label as string,
    incidentType: type,
    value: distribution[type] ?? 0,
    fill: `var(--color-${type})`,
  })).filter((d) => d.value > 0)

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card data-slot="violation-pie-chart" className="flex flex-col h-full">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-base">Violation Type Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-44 w-44 animate-pulse rounded-full bg-muted" />
            <div className="w-full space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="relative mx-auto h-44 w-44">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(entry) => router.push("/violations?type=" + entry.incidentType)}
                    className="cursor-pointer"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.incidentType} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <NgtNumber value={total} size="lg" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {data.map((item) => (
                <li
                  key={item.incidentType}
                  className="flex cursor-pointer items-center gap-2 text-xs transition-opacity hover:opacity-80"
                  onClick={() => router.push("/violations?type=" + item.incidentType)}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="flex-1 text-muted-foreground">{item.name}</span>
                  <NgtNumber value={item.value} size="sm" />
                  <span className="text-muted-foreground">
                    ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
