"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NumberPlate } from "@/components/ui/number-plate"
import { INCIDENT_TYPE_META } from "@/lib/api-types"
import type { ApiViolation } from "@/lib/api-types"

type RecentViolationsListProps = {
  violations: ApiViolation[]
  isLoading?: boolean
}

export function RecentViolationsList({ violations, isLoading = false }: RecentViolationsListProps) {
  return (
    <Card data-slot="recent-violations-list" className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-base">Recent Violations</CardTitle>
        <Button variant="link" size="sm" asChild className="gap-1 text-xs">
          <Link href="/violations">
            View all
            <ArrowRightIcon className="size-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        <ScrollArea className="h-full">
          <div className="px-6 pb-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-14 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              ))
            ) : violations.length === 0 ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">No violations found</p>
              </div>
            ) : (
              violations.map((violation) => {
                const incidentLabel = INCIDENT_TYPE_META[violation.incident.type]?.label ?? violation.incident.type

                return (
                  <Link href="/violations" key={violation.id}>
                    <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <NumberPlate value={violation.vehicle_number} isCommercial={violation.rc.is_commercial} />
                        <p className="mt-1 text-xs text-muted-foreground truncate">
                          {incidentLabel} &bull; {violation.address.area}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(violation.timestamp), { addSuffix: true })}
                        </span>
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium border-warning-3 bg-warning-0 text-warning-2">
                          Pending
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
