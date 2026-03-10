"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INCIDENT_TYPE_META } from "@/lib/api-types"
import type { IncidentType } from "@/lib/api-types"

export type ViolationFilters = {
  date: string
  incidentType: IncidentType | "all"
}

type ViolationFiltersBarProps = {
  filters: ViolationFilters
  onChange: (filters: ViolationFilters) => void
}

const INCIDENT_TYPES: IncidentType[] = [
  "insurance_expired",
  "pucc_expired",
  "road_tax_unpaid",
  "fitness_expired",
  "eol",
]

export function ViolationFiltersBar({ filters, onChange }: ViolationFiltersBarProps) {
  const [draft, setDraft] = React.useState<ViolationFilters>(filters)

  // Sync internal state if the external filters prop changes
  React.useEffect(() => {
    setDraft(filters)
  }, [filters])

  function apply() {
    onChange(draft)
  }

  function clear() {
    const reset: ViolationFilters = { date: "", incidentType: "all" }
    setDraft(reset)
    onChange(reset)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
      {/* Date Input */}
      <Input
        type="date"
        value={draft.date}
        onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
        className="h-8 w-36 text-xs bg-card"
      />

      <Select
        value={draft.incidentType}
        onValueChange={(v) =>
          setDraft((d) => ({ ...d, incidentType: v as IncidentType | "all" }))
        }
      >
        <SelectTrigger className="h-8 w-48 text-xs bg-card">
          <SelectValue placeholder="Select violation type" />
        </SelectTrigger>
        <SelectContent className="">
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

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <Button size="sm" onClick={apply} className="h-8 px-4 text-xs">
          Apply
        </Button>
        <Button size="sm" variant="outline" onClick={clear} className="h-8 px-4 text-xs">
          Clear
        </Button>
      </div>
    </div>
  )
}