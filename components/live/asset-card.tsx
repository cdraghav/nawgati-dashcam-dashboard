"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NumberPlate } from "@/components/ui/number-plate"
import { ASSET_STATUS_META } from "@/lib/live-types"
import type { LiveAsset } from "@/lib/live-types"

type AssetCardProps = {
  asset: LiveAsset
  isSelected: boolean
  onClick: () => void
}

export function AssetCard({ asset, isSelected, onClick }: AssetCardProps) {
  const meta = ASSET_STATUS_META[asset.status]

  const speedLabel =
    asset.status === "moving"
      ? `${asset.speed} km/h`
      : asset.status === "idle"
      ? "Stopped"
      : "Offline"

  return (
    <Button
      data-slot="asset-card"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 h-auto rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-card/50",
        isSelected ? "bg-card/50" : "bg-card"
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-none font-mono">{asset.vehicle_number}</p>
        <p className="mt-1 text-xs text-muted-foreground truncate">
          {asset.asset_id} &bull; {speedLabel}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(asset.last_updated), { addSuffix: true })}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
            meta.bgClass,
            meta.textClass,
            meta.borderClass
          )}
        >
          {meta.label}
        </span>
      </div>
    </Button>
  )
}
