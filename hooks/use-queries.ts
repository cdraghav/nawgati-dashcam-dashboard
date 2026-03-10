"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchOverview, fetchViolations, fetchViolationById } from "@/lib/api"
import { getDateRange, type QuickRange } from "@/lib/analytics-utils"

function rangeToTimestamps(range: QuickRange): { start_timestamp: string; end_timestamp: string } {
  const dateRange = getDateRange(range)
  if (!dateRange) {
    const end = new Date()
    const start = new Date(end)
    start.setFullYear(start.getFullYear() - 1)
    return {
      start_timestamp: start.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00+05:30",
      end_timestamp: end.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T23:59:59+05:30",
    }
  }
  return {
    start_timestamp: dateRange.start.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T00:00:00+05:30",
    end_timestamp: dateRange.end.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) + "T23:59:59+05:30",
  }
}

export function useOverview(range: QuickRange = "today") {
  return useQuery({
    queryKey: ["overview", range],
    queryFn: () => fetchOverview(rangeToTimestamps(range)),
    staleTime: 60_000,
  })
}

export function useViolationsList(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["violations", page, limit],
    queryFn: () => fetchViolations(page, limit),
    staleTime: 30_000,
  })
}

export function useViolationDetail(id: number | null) {
  return useQuery({
    queryKey: ["violation", id],
    queryFn: () => fetchViolationById(id!),
    enabled: id !== null,
    staleTime: 60_000,
  })
}
