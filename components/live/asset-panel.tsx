"use client"

import * as React from "react"
import { AssetCard } from "./asset-card"
import type { LiveAsset, AssetStatus } from "@/lib/live-types"

type AssetPanelProps = {
  assets: LiveAsset[]
  selectedId: string | null
  onSelect: (id: string) => void
  isLoading?: boolean
  statusFilter: AssetStatus | "all"
}

export function AssetPanel({
  assets,
  selectedId,
  onSelect,
  isLoading = false,
  statusFilter,
}: AssetPanelProps) {
  const filtered =
    statusFilter === "all" ? assets : assets.filter((a) => a.status === statusFilter)

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 border-b px-4 py-3.5">
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="h-4 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <p className="text-sm font-medium text-muted-foreground">No assets found</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {statusFilter !== "all" ? "Try a different filter" : "No assets are being tracked"}
        </p>
      </div>
    )
  }

  return (
    <div>
      {filtered.map((asset) => (
        <AssetCard
          key={asset.asset_id}
          asset={asset}
          isSelected={selectedId === asset.asset_id}
          onClick={() => onSelect(asset.asset_id)}
        />
      ))}
    </div>
  )
}
