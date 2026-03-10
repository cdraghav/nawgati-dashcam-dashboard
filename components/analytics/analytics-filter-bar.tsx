"use client"

import * as React from "react"
import { DownloadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { INCIDENT_TYPE_META } from "@/lib/api-types"
import type { IncidentType } from "@/lib/api-types"
import type { QuickRange } from "@/lib/analytics-utils"

type AnalyticsFilterBarProps = {
  quickRange: QuickRange
  onQuickRangeChange: (range: QuickRange) => void
  incidentType: IncidentType | "all"
  onIncidentTypeChange: (type: IncidentType | "all") => void
  violationCount: number
  onExportCSV: () => void
}

const QUICK_RANGES: { value: QuickRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "month", label: "Month" },
  { value: "all", label: "All" },
]

const INCIDENT_TYPES: IncidentType[] = [
  "insurance_expired",
  "pucc_expired",
  "road_tax_unpaid",
  "fitness_expired",
  "eol",
]

export function AnalyticsFilterBar({
  quickRange,
  onQuickRangeChange,
  incidentType,
  onIncidentTypeChange,
  violationCount,
  onExportCSV,
}: AnalyticsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
      <div className="flex items-center gap-1">
        {QUICK_RANGES.map((r) => {
          const isActive = quickRange === r.value
          return (
            <button
              key={r.value}
              onClick={() => onQuickRangeChange(r.value)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                isActive ? "text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              )}
              style={
                isActive
                  ? { backgroundColor: "var(--brand-secondary)" }
                  : undefined
              }
            >
              {r.label}
            </button>
          )
        })}
      </div>

      <Select
        value={incidentType}
        onValueChange={(v) => onIncidentTypeChange(v as IncidentType | "all")}
      >
        <SelectTrigger className="h-8 w-48 text-xs bg-card">
          <SelectValue placeholder="All Violations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Violations
          </SelectItem>
          {INCIDENT_TYPES.map((type) => (
            <SelectItem key={type} value={type} className="text-xs">
              {INCIDENT_TYPE_META[type]?.label || type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{violationCount}</span> violations
        </span>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={onExportCSV}>
          <DownloadIcon className="size-3.5" />
          Export CSV
        </Button>
      </div>
    </div>
  )
}
