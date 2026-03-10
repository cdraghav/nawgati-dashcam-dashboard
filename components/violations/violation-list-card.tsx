"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NumberPlate } from "@/components/ui/number-plate"
import { INCIDENT_TYPE_META } from "@/lib/api-types"
import { useVisualsStore } from "@/lib/store"
import type { ApiViolation } from "@/lib/api-types"

const REVIEW_BADGE_STYLES = {
  pending: "border-warning-3 bg-warning-0 text-warning-3 dark:text-warning-2",
  approved: "border-success-3 bg-success-0 text-success-3 dark:text-success-2",
  rejected: "border-error-3 bg-error-0 text-error-3 dark:text-warning-2",
  flagged: "border-info-3 bg-info-0 text-info-3 dark:text-info-2",
}

type ViolationListCardProps = {
  violation: ApiViolation
  isSelected: boolean
  onClick: () => void
}

export function ViolationListCard({ violation, isSelected, onClick }: ViolationListCardProps) {
  const review = useVisualsStore((s) => s.reviews[violation.id])
  const incidentLabel = INCIDENT_TYPE_META[violation.incident.type]?.label ?? violation.incident.type

  const statusKey = review ? review.decision : "pending"
  const statusLabel = statusKey.charAt(0).toUpperCase() + statusKey.slice(1)
  const badgeClass = REVIEW_BADGE_STYLES[statusKey]

  return (
    <Button
      data-slot="violation-list-card"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 h-auto rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-card/50",
        isSelected ? "bg-card/50" : "bg-card"
      )}
    >
      <div className="flex-1 min-w-0">
        <NumberPlate value={violation.vehicle_number} isCommercial={violation.rc.is_commercial} />
        <p className="mt-1 text-xs text-muted-foreground truncate">
          {incidentLabel} &bull; {violation.address.area}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(violation.timestamp), { addSuffix: true })}
        </span>
        <span className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
          badgeClass
        )}>
          {statusLabel}
        </span>
      </div>
    </Button>
  )
}