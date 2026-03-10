import type { LiveAsset, LiveAssetsResponse } from "./live-types";

// ---------------------------------------------------------------------------
// TODO: Replace DUMMY_MODE with real API when ready
// ---------------------------------------------------------------------------
const DUMMY_MODE = true;
const API_BASE = "https://nawgati-dashcam-server.vercel.app";

// Seed positions around Hyderabad
const SEED: LiveAsset[] = [
  {
    asset_id: "CAM-001",
    vehicle_number: "TS09AB1234",
    coordinates: [77.2167, 28.6328],
    speed: 38,
    heading: 120,
    status: "moving",
    last_updated: "",
  },
  {
    asset_id: "CAM-002",
    vehicle_number: "TS07CD5678",
    coordinates: [77.2295, 28.6129],
    speed: 0,
    heading: 45,
    status: "idle",
    last_updated: "",
  },
  {
    asset_id: "CAM-003",
    vehicle_number: "AP09EF9012",
    coordinates: [77.1988, 28.5494],
    speed: 52,
    heading: 270,
    status: "moving",
    last_updated: "",
  },
  {
    asset_id: "CAM-004",
    vehicle_number: "TS10GH3456",
    coordinates: [77.1145, 28.7366],
    speed: 0,
    heading: 90,
    status: "offline",
    last_updated: "",
  },
  {
    asset_id: "CAM-005",
    vehicle_number: "TS09IJ7890",
    coordinates: [77.0601, 28.5921],
    speed: 29,
    heading: 200,
    status: "moving",
    last_updated: "",
  },
  {
    asset_id: "CAM-006",
    vehicle_number: "AP28KL2345",
    coordinates: [77.2432, 28.5677],
    speed: 0,
    heading: 315,
    status: "idle",
    last_updated: "",
  },
  {
    asset_id: "CAM-007",
    vehicle_number: "TS11MN6789",
    coordinates: [77.19, 28.6538],
    speed: 67,
    heading: 15,
    status: "moving",
    last_updated: "",
  },
  {
    asset_id: "CAM-008",
    vehicle_number: "TS09OP0123",
    coordinates: [77.1565, 28.5293],
    speed: 0,
    heading: 180,
    status: "offline",
    last_updated: "",
  },
];

// Mutable simulation state
let _simAssets: LiveAsset[] = SEED.map((a) => ({ ...a }));

function simulate(asset: LiveAsset): LiveAsset {
  if (asset.status !== "moving") {
    return { ...asset, last_updated: new Date().toISOString() };
  }
  const speedDelta = (Math.random() - 0.5) * 12;
  const speed = Math.max(8, Math.min(90, asset.speed + speedDelta));
  const heading = (asset.heading + (Math.random() - 0.5) * 14 + 360) % 360;
  const distancePerTick = 0.00025; // ~28m per tick at 10s interval
  const rad = (heading * Math.PI) / 180;
  return {
    ...asset,
    speed: Math.round(speed),
    heading: Math.round(heading),
    coordinates: [
      asset.coordinates[0] + Math.sin(rad) * distancePerTick,
      asset.coordinates[1] + Math.cos(rad) * distancePerTick,
    ],
    last_updated: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public fetch function — swap out the body when API is ready
// ---------------------------------------------------------------------------
export async function fetchLiveAssets(): Promise<LiveAssetsResponse> {
  if (!DUMMY_MODE) {
    // Real API integration point
    const res = await fetch(`${API_BASE}/api/live/assets`);
    if (!res.ok) throw new Error("Failed to fetch live assets");
    return res.json() as Promise<LiveAssetsResponse>;
  }

  // Simulate live movement
  _simAssets = _simAssets.map(simulate);
  return { assets: _simAssets, timestamp: new Date().toISOString() };
}
