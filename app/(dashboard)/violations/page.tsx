"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { ViolationFiltersBar } from "@/components/violations/violation-filters"
import { ViolationList } from "@/components/violations/violation-list"
import { ViolationDetail } from "@/components/violations/violation-detail"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useViolationsList } from "@/hooks/use-queries"
import type { ViolationFilters } from "@/components/violations/violation-filters"
import type { ApiViolation, IncidentType } from "@/lib/api-types"

function filterViolations(violations: ApiViolation[], filters: ViolationFilters): ApiViolation[] {
  return violations
    .filter((v) => {
      if (filters.date) {
        const dateInIST = new Date(v.timestamp).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        })
        if (dateInIST !== filters.date) return false
      }
      if (filters.incidentType !== "all" && v.incident.type !== filters.incidentType) return false
      return true
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function getScrollViewport(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
}

export default function ViolationsPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = React.useState<ViolationFilters>({
    date: searchParams.get("date") ?? "",
    incidentType: (searchParams.get("type") as IncidentType | "all") ?? "all",
  })
  const [selectedId, setSelectedId] = React.useState<number | null>(null)

  const listContainerRef = React.useRef<HTMLDivElement>(null)
  const detailContainerRef = React.useRef<HTMLDivElement>(null)

  const { data, isPending } = useViolationsList(1, 50)
  const allViolations = data?.data ?? []
  const filteredViolations = filterViolations(allViolations, filters)

  React.useEffect(() => {
    if (filteredViolations.length > 0 && selectedId === null) {
      setSelectedId(filteredViolations[0].id)
    }
  }, [filteredViolations, selectedId])

  React.useEffect(() => {
    if (filteredViolations.length > 0) {
      const stillExists = filteredViolations.find((v) => v.id === selectedId)
      if (!stillExists) setSelectedId(filteredViolations[0].id)
    }
  }, [filteredViolations, selectedId])

  // Cross-scroll: when one panel hits its boundary, overflow into the other
  React.useEffect(() => {
    const listEl = listContainerRef.current
    const detailEl = detailContainerRef.current
    if (!listEl || !detailEl) return

    function makeWheelHandler(sourceEl: HTMLElement, targetEl: HTMLElement) {
      return function (e: WheelEvent) {
        const src = getScrollViewport(sourceEl)
        if (!src) return
        const atTop = src.scrollTop <= 0 && e.deltaY < 0
        const atBottom =
          src.scrollTop + src.clientHeight >= src.scrollHeight - 1 && e.deltaY > 0
        if (atTop || atBottom) {
          const tgt = getScrollViewport(targetEl)
          if (tgt) {
            e.preventDefault()
            tgt.scrollBy({ top: e.deltaY })
          }
        }
      }
    }

    const onListWheel = makeWheelHandler(listEl, detailEl)
    const onDetailWheel = makeWheelHandler(detailEl, listEl)

    listEl.addEventListener("wheel", onListWheel, { passive: false })
    detailEl.addEventListener("wheel", onDetailWheel, { passive: false })

    return () => {
      listEl.removeEventListener("wheel", onListWheel)
      detailEl.removeEventListener("wheel", onDetailWheel)
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-background">
      <ViolationFiltersBar filters={filters} onChange={setFilters} />
      <div className="flex flex-1 min-h-0 m-4 rounded-xl border bg-card overflow-hidden">
        {/* List panel */}
        <aside
          ref={listContainerRef}
          className="w-80 xl:w-96 shrink-0 border-r bg-background"
        >
          <ScrollArea className="h-full">
            <ViolationList
              violations={filteredViolations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              isLoading={isPending}
            />
          </ScrollArea>
        </aside>

        {/* Detail panel */}
        <section
          ref={detailContainerRef}
          className="flex flex-1 min-h-0 overflow-hidden"
        >
          {selectedId !== null ? (
            <ViolationDetail key={selectedId} violationId={selectedId} />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Select a violation to review</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
