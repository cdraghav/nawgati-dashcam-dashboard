import type { OverviewResponse, ViolationsListResponse, ApiViolationDetail } from "./api-types"

const BASE_URL = "https://nawgati-dashcam-server.vercel.app"

function todayRangeIST(): { start_timestamp: string; end_timestamp: string } {
  const now = new Date()
  const istDateStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
  return {
    start_timestamp: `${istDateStr}T00:00:00+05:30`,
    end_timestamp: `${istDateStr}T23:59:59+05:30`,
  }
}

export async function fetchOverview(params?: { start_timestamp: string; end_timestamp: string }): Promise<OverviewResponse> {
  const res = await fetch(`${BASE_URL}/api/overview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params ?? todayRangeIST()),
  })
  if (!res.ok) throw new Error("Failed to fetch overview")
  return res.json()
}

export async function fetchViolations(page: number, limit: number): Promise<ViolationsListResponse> {
  const res = await fetch(`${BASE_URL}/api/violations?page=${page}&limit=${limit}`)
  if (!res.ok) throw new Error("Failed to fetch violations")
  return res.json()
}

export async function fetchViolationById(id: number): Promise<ApiViolationDetail> {
  const res = await fetch(`${BASE_URL}/api/violations/${id}`)
  if (!res.ok) throw new Error("Failed to fetch violation")
  return res.json()
}
