"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { LiveAsset } from "@/lib/live-types"

type AssetMarkerProps = {
  asset: LiveAsset
  isSelected: boolean
  onClick: () => void
}

export const AssetMarker = React.memo(function AssetMarker({
  asset,
  isSelected,
  onClick,
}: AssetMarkerProps) {
  const { status, speed, vehicle_number } = asset

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{
        width: isSelected ? 36 : 28,
        height: isSelected ? 36 : 28,
        transition: "width 0.2s ease, height 0.2s ease",
      }}
    >
      {/* Double ping rings — moving only, not selected */}
      {status === "moving" && !isSelected && (
        <>
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-50"
            style={{ backgroundColor: "var(--success-3)", animationDuration: "1.4s" }}
          />
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-25"
            style={{ backgroundColor: "var(--success-3)", animationDuration: "1.4s", animationDelay: "0.7s" }}
          />
        </>
      )}
      {/* Ping ring on selected moving too — tighter, subtle */}
      {status === "moving" && isSelected && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: "var(--success-3)", animationDuration: "1.6s" }}
        />
      )}

      {/* Outer ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border transition-all duration-200",
          isSelected ? "border-2" : "border",
          status === "moving" && "border-success-3/60",
          status === "idle" && "border-warning-3/60",
          status === "offline" && "border-muted-foreground/25",
          isSelected && "shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
        )}
        style={
          isSelected
            ? {
                backgroundColor:
                  status === "moving"
                    ? "rgba(var(--success-3-rgb, 34 197 94) / 0.12)"
                    : status === "idle"
                    ? "rgba(var(--warning-3-rgb, 245 158 11) / 0.12)"
                    : "transparent",
              }
            : {}
        }
      />

      {/* Inner beacon dot — pulses when moving */}
      <div
        className={cn(
          "rounded-full shadow-md z-10 transition-all duration-200",
          isSelected ? "size-3" : "size-2.5",
          status === "moving" && "bg-success-3 animate-pulse",
          status === "idle" && "bg-warning-3",
          status === "offline" && "bg-muted-foreground/40"
        )}
        style={status === "moving" ? { animationDuration: "1.2s" } : {}}
      />

      {/* Speed badge — moving only */}
      {status === "moving" && speed > 0 && (
        <div className="absolute -top-2 -right-1 z-20 rounded-full bg-success-3 px-1 py-px text-[9px] font-bold leading-tight text-white shadow-sm">
          {speed}
        </div>
      )}

      {/* Label — always on when selected, hover otherwise */}
      <div
        className={cn(
          "absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-md border bg-background/95 px-2 py-0.5 text-[10px] font-mono font-semibold shadow-md backdrop-blur-sm pointer-events-none transition-opacity duration-150",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        {vehicle_number}
      </div>
    </div>
  )
})
