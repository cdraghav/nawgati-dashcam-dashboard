"use client"

import * as React from "react"
import { ViolationListCard } from "./violation-list-card"
import type { ApiViolation } from "@/lib/api-types"

type ViolationListProps = {
  violations: ApiViolation[]
  selectedId: number | null
  onSelect: (id: number) => void
  isLoading?: boolean
}

export function ViolationList({ violations, selectedId, onSelect, isLoading = false }: ViolationListProps) {
  if (isLoading) {
    return (
      <div data-slot="violation-list">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 border-b px-4 py-3.5">
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-40 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-14 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (violations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">No violations found</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div data-slot="violation-list">
      {violations.map((v) => (
        <ViolationListCard
          key={v.id}
          violation={v}
          isSelected={selectedId === v.id}
          onClick={() => onSelect(v.id)}
        />
      ))}
    </div>
  )
}
