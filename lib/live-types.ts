export type AssetStatus = "moving" | "idle" | "offline"

export type LiveAsset = {
  asset_id: string
  vehicle_number: string
  coordinates: [number, number] // [longitude, latitude]
  speed: number // km/h
  heading: number // degrees 0–360 (0 = North)
  status: AssetStatus
  last_updated: string // ISO 8601
}

export type LiveAssetsResponse = {
  assets: LiveAsset[]
  timestamp: string
}

export const ASSET_STATUS_META: Record<
  AssetStatus,
  { label: string; color: string; bgClass: string; textClass: string; borderClass: string }
> = {
  moving: {
    label: "Moving",
    color: "var(--success-3)",
    bgClass: "bg-success-0",
    textClass: "text-success-3",
    borderClass: "border-success-3",
  },
  idle: {
    label: "Idle",
    color: "var(--warning-3)",
    bgClass: "bg-warning-0",
    textClass: "text-warning-3",
    borderClass: "border-warning-3",
  },
  offline: {
    label: "Offline",
    color: "currentColor",
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
    borderClass: "border-muted-foreground/30",
  },
}
