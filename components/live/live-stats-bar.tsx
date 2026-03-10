"use client"

import * as React from "react"
import { format } from "date-fns"
import { RefreshCwIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LiveAsset, AssetStatus } from "@/lib/live-types"
import { ASSET_STATUS_META } from "@/lib/live-types"

type LiveStatsBarProps = {
  assets: LiveAsset[]
  lastUpdated: number
  countdown: number
  statusFilter: AssetStatus | "all"
  onFilterChange: (f: AssetStatus | "all") => void
  isRefreshing: boolean
}

const FILTER_OPTIONS: { key: AssetStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "moving", label: "Moving" },
  { key: "idle", label: "Idle" },
  { key: "offline", label: "Offline" },
]

export function LiveStatsBar({
  assets,
  lastUpdated,
  countdown,
  statusFilter,
  onFilterChange,
  isRefreshing,
}: LiveStatsBarProps) {
  const counts = React.useMemo(
    () => ({
      all: assets.length,
      moving: assets.filter((a) => a.status === "moving").length,
      idle: assets.filter((a) => a.status === "idle").length,
      offline: assets.filter((a) => a.status === "offline").length,
    }),
    [assets]
  )

  return (
    <div className="flex flex-wrap items-center gap-3 border-b bg-background px-4 py-2.5">
      {/* Filter chips */}
      <div className="flex items-center gap-1.5">
        {FILTER_OPTIONS.map(({ key, label }) => {
          const count = counts[key]
          const meta = key !== "all" ? ASSET_STATUS_META[key] : null
          const isActive = statusFilter === key

          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              style={
                isActive
                  ? { backgroundColor: "var(--brand-secondary)", borderColor: "var(--brand-secondary)" }
                  : {}
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-white"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {meta && !isActive && (
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: meta.color }}
                />
              )}
              {label}
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1 py-0 text-[10px] font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex-1" />

      {/* Refresh indicator — never shows "Refreshing", just countdown */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <RefreshCwIcon className={cn("size-3", isRefreshing && "animate-spin")} />
        {lastUpdated > 0 && <span>{format(new Date(lastUpdated), "HH:mm:ss")}</span>}
        <span className="tabular-nums">· {countdown}s</span>
      </div>
    </div>
  )
}
