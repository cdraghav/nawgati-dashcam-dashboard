"use client"

import * as React from "react"
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox"
import type { MapRef } from "react-map-gl/mapbox"
import { LngLatBounds } from "mapbox-gl"
import { format } from "date-fns"
import {
  Maximize2Icon,
  XIcon,
  LayersIcon,
  ClockIcon,
  GaugeIcon,
  RadioIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ASSET_STATUS_META } from "@/lib/live-types"
import type { LiveAsset } from "@/lib/live-types"
import { AssetMarker } from "./asset-marker"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const MAP_STYLE = "mapbox://styles/mapbox/dark-v11"
const DEFAULT_CENTER = { longitude: 78.4867, latitude: 17.3850, zoom: 11 }

type LiveMapProps = {
  assets: LiveAsset[]
  selectedId: string | null
  onSelectAsset: (id: string | null) => void
}

export function LiveMap({ assets, selectedId, onSelectAsset }: LiveMapProps) {
  const mapRef = React.useRef<MapRef>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [popupAsset, setPopupAsset] = React.useState<LiveAsset | null>(null)
  const hasFitInitially = React.useRef(false)

  // Refit map when the container resizes (e.g. sidebar open/close)
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => {
      mapRef.current?.resize()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const selectedAsset = assets.find((a) => a.asset_id === selectedId) ?? null

  // Fly to selected asset when it changes
  React.useEffect(() => {
    if (!selectedAsset) return
    mapRef.current?.flyTo({
      center: [selectedAsset.coordinates[0], selectedAsset.coordinates[1]],
      zoom: 14,
      duration: 1200,
      essential: true,
    })
    setPopupAsset(selectedAsset)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync popup asset data on live updates
  React.useEffect(() => {
    if (popupAsset) {
      const updated = assets.find((a) => a.asset_id === popupAsset.asset_id)
      if (updated) setPopupAsset(updated)
    }
  }, [assets]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fit all assets into view once on first load
  function fitAll() {
    if (assets.length === 0) return
    if (assets.length === 1) {
      mapRef.current?.flyTo({
        center: [assets[0].coordinates[0], assets[0].coordinates[1]],
        zoom: 14,
        duration: 800,
      })
      return
    }
    const bounds = new LngLatBounds()
    assets.forEach((a) => bounds.extend(a.coordinates))
    mapRef.current?.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 15 })
  }

  function handleMapLoad() {
    if (!hasFitInitially.current && assets.length > 0) {
      hasFitInitially.current = true
      fitAll()
    }
  }

  // Close only the popup — never touches selectedId
  function closePopup() {
    setPopupAsset(null)
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-muted/40 text-center p-8">
        <LayersIcon className="size-10 text-muted-foreground/40" />
        <div>
          <p className="font-semibold text-sm">Mapbox token not configured</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add <code className="font-mono bg-muted px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
            <code className="font-mono bg-muted px-1 rounded">.env.local</code> and restart the server.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative flex-1 min-h-0 overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        initialViewState={DEFAULT_CENTER}
        onLoad={handleMapLoad}
        onClick={() => setPopupAsset(null)}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass visualizePitch />

        {/* Asset markers */}
        {assets.map((asset) => (
          <Marker
            key={asset.asset_id}
            longitude={asset.coordinates[0]}
            latitude={asset.coordinates[1]}
            anchor="center"
          >
            <div className="group">
              <AssetMarker
                asset={asset}
                isSelected={selectedId === asset.asset_id}
                onClick={() => {
                  onSelectAsset(asset.asset_id)
                }}
              />
            </div>
          </Marker>
        ))}

        {/* Info popup */}
        {popupAsset && (
          <Popup
            longitude={popupAsset.coordinates[0]}
            latitude={popupAsset.coordinates[1]}
            anchor="bottom"
            offset={28}
            closeButton={false}
            closeOnClick={false}
            className="mapbox-popup-override"
          >
            <PopupCard asset={popupAsset} onClose={closePopup} />
          </Popup>
        )}
      </Map>

      {/* Fit All button */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="size-9 shadow-lg border bg-background/90 backdrop-blur-sm hover:bg-background"
          onClick={fitAll}
          title="Fit all assets"
        >
          <Maximize2Icon className="size-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-xl border bg-background/90 backdrop-blur-sm shadow-lg px-3 py-2.5 space-y-1.5">
        {(["moving", "idle", "offline"] as const).map((status) => {
          const meta = ASSET_STATUS_META[status]
          return (
            <div key={status} className="flex items-center gap-2">
              <span
                className="size-2 rounded-full border"
                style={{ backgroundColor: meta.color, borderColor: meta.color }}
              />
              <span className="text-[11px] text-foreground/80 font-medium">{meta.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Popup card rendered inside the Mapbox Popup
// ---------------------------------------------------------------------------
function PopupCard({ asset, onClose }: { asset: LiveAsset; onClose: () => void }) {
  const meta = ASSET_STATUS_META[asset.status]

  const lastUpdated = React.useMemo(() => {
    try {
      return format(new Date(asset.last_updated), "HH:mm:ss")
    } catch {
      return "—"
    }
  }, [asset.last_updated])

  return (
    <div className="w-56 rounded-xl border bg-background shadow-xl overflow-hidden text-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-3 pt-3 pb-2">
        <div>
          <p className="font-mono font-bold text-base tracking-wide">{asset.vehicle_number}</p>
          <p className="text-[11px] text-muted-foreground">{asset.asset_id}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <XIcon className="size-3.5" />
        </button>
      </div>

      <Separator />

      <div className="px-3 py-2.5 space-y-2">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              meta.bgClass,
              meta.textClass,
              meta.borderClass
            )}
          >
            {meta.label}
          </span>
        </div>

        {/* Speed */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GaugeIcon className="size-3" />
            Speed
          </span>
          <span className="text-xs font-medium">
            {asset.status === "moving" ? `${asset.speed} km/h` : "0 km/h"}
          </span>
        </div>

        {/* Coordinates */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RadioIcon className="size-3" />
            GPS
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {asset.coordinates[1].toFixed(4)}, {asset.coordinates[0].toFixed(4)}
          </span>
        </div>

        {/* Last updated */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="size-3" />
            Updated
          </span>
          <span className="text-xs font-medium">{lastUpdated}</span>
        </div>
      </div>
    </div>
  )
}
