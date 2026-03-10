"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LiveMap } from "@/components/live/live-map"
import { AssetPanel } from "@/components/live/asset-panel"
import { LiveStatsBar } from "@/components/live/live-stats-bar"
import { useLiveAssets, POLL_INTERVAL_MS } from "@/hooks/use-live-assets"
import type { AssetStatus } from "@/lib/live-types"

export default function LivePage() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<AssetStatus | "all">("all")
  const [countdown, setCountdown] = React.useState(POLL_INTERVAL_MS / 1000)

  const { data, isPending, isFetching, dataUpdatedAt } = useLiveAssets()
  const assets = data?.assets ?? []

  // Auto-select first asset only once on initial load
  const hasAutoSelected = React.useRef(false)
  React.useEffect(() => {
    if (!hasAutoSelected.current && assets.length > 0) {
      hasAutoSelected.current = true
      setSelectedId(assets[0].asset_id)
    }
  }, [assets])

  // Countdown to next refresh — resets whenever data updates
  React.useEffect(() => {
    setCountdown(POLL_INTERVAL_MS / 1000)
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? POLL_INTERVAL_MS / 1000 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [dataUpdatedAt])

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-background">
      <LiveStatsBar
        assets={assets}
        lastUpdated={dataUpdatedAt}
        countdown={countdown}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        isRefreshing={isFetching}
      />

      <div className="flex flex-1 min-h-0 m-4 rounded-xl border bg-card overflow-hidden">
        {/* Asset list panel */}
        <aside className="w-80 xl:w-96 shrink-0 border-r bg-background">
          <ScrollArea className="h-full">
            <AssetPanel
              assets={assets}
              selectedId={selectedId}
              onSelect={setSelectedId}
              isLoading={isPending}
              statusFilter={statusFilter}
            />
          </ScrollArea>
        </aside>

        {/* Map panel */}
        <section className="flex flex-1 min-h-0 overflow-hidden">
          <LiveMap
            assets={assets}
            selectedId={selectedId}
            onSelectAsset={setSelectedId}
          />
        </section>
      </div>
    </div>
  )
}
