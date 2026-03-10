import { eachDayOfInterval, format, subDays, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns"
import type { ApiViolation, IncidentType } from "@/lib/api-types"
import { INCIDENT_TYPE_META } from "@/lib/api-types"

export type QuickRange = "today" | "7d" | "30d" | "month" | "all"

export function getDateRange(range: QuickRange): { start: Date; end: Date } | null {
  const now = new Date()
  if (range === "all") return null
  if (range === "today") return { start: startOfDay(now), end: endOfDay(now) }
  if (range === "7d") return { start: startOfDay(subDays(now, 6)), end: endOfDay(now) }
  if (range === "30d") return { start: startOfDay(subDays(now, 29)), end: endOfDay(now) }
  if (range === "month") return { start: startOfMonth(now), end: endOfMonth(now) }
  return null
}

export function applyDateFilter(violations: ApiViolation[], range: QuickRange): ApiViolation[] {
  const dateRange = getDateRange(range)
  if (!dateRange) return violations
  const { start, end } = dateRange
  return violations.filter((v) => {
    const ts = new Date(v.timestamp)
    return ts >= start && ts <= end
  })
}

export function applyTypeFilter(
  violations: ApiViolation[],
  type: IncidentType | "all"
): ApiViolation[] {
  if (type === "all") return violations
  return violations.filter((v) => v.incident.type === type)
}

export function getDailyTrend(
  violations: ApiViolation[],
  range: QuickRange
): { label: string; key: string; count: number }[] {
  const dateRange = getDateRange(range)
  const now = new Date()
  const start = dateRange ? dateRange.start : startOfDay(subDays(now, 29))
  const end = dateRange ? dateRange.end : endOfDay(now)

  const days = eachDayOfInterval({ start, end })
  const countByKey: Record<string, number> = {}

  for (const v of violations) {
    const dateInIST = new Date(v.timestamp).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    })
    countByKey[dateInIST] = (countByKey[dateInIST] ?? 0) + 1
  }

  return days.map((day) => {
    const key = format(day, "yyyy-MM-dd")
    const label = format(day, "MMM d")
    return { label, key, count: countByKey[key] ?? 0 }
  })
}

export function getHourlyDistribution(
  violations: ApiViolation[]
): { hour: number; label: string; count: number }[] {
  const counts = Array.from({ length: 24 }, () => 0)
  for (const v of violations) {
    const istHour = new Date(v.timestamp).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    })
    const hour = parseInt(istHour, 10) % 24
    counts[hour] = (counts[hour] ?? 0) + 1
  }
  return counts.map((count, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, "0")}:00`,
    count,
  }))
}

export type TypeBreakdownItem = {
  type: IncidentType
  label: string
  shortLabel: string
  count: number
  finePotential: number
  fineAmount: number
}

const SHORT_LABELS: Record<IncidentType, string> = {
  pucc_expired: "PUCC",
  insurance_expired: "Insurance",
  fitness_expired: "Fitness",
  eol: "EOL",
  road_tax_unpaid: "Road Tax",
}

export function getTypeBreakdown(violations: ApiViolation[]): TypeBreakdownItem[] {
  const counts: Record<string, number> = {}
  for (const v of violations) {
    counts[v.incident.type] = (counts[v.incident.type] ?? 0) + 1
  }
  const types = Object.keys(INCIDENT_TYPE_META) as IncidentType[]
  return types
    .map((type) => {
      const count = counts[type] ?? 0
      const fineAmount = INCIDENT_TYPE_META[type].fineAmount
      return {
        type,
        label: INCIDENT_TYPE_META[type].label,
        shortLabel: SHORT_LABELS[type],
        count,
        finePotential: count * fineAmount,
        fineAmount,
      }
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
}

export function getTopAreas(
  violations: ApiViolation[],
  limit = 8
): { area: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const v of violations) {
    const area = v.address.area
    if (area) counts[area] = (counts[area] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getReviewSummary(
  violations: ApiViolation[],
  reviews: Record<number, { decision: string }>
): { pending: number; approved: number; rejected: number; flagged: number; total: number } {
  let approved = 0
  let rejected = 0
  let flagged = 0
  let pending = 0
  for (const v of violations) {
    const review = reviews[v.id]
    if (!review) {
      pending++
    } else if (review.decision === "approved") {
      approved++
    } else if (review.decision === "rejected") {
      rejected++
    } else if (review.decision === "flagged") {
      flagged++
    }
  }
  return { pending, approved, rejected, flagged, total: violations.length }
}

export function getFinePotential(violations: ApiViolation[]): number {
  return violations.reduce((sum, v) => {
    return sum + (INCIDENT_TYPE_META[v.incident.type]?.fineAmount ?? 0)
  }, 0)
}

export function exportViolationsCSV(violations: ApiViolation[]): void {
  const headers = ["ID", "Vehicle Number", "Violation Type", "Area", "Date (DD/MM/YYYY)", "Time", "Fine Amount (₹)"]
  const rows = violations.map((v) => {
    const date = new Date(v.timestamp)
    const dateStr = date.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" })
    const timeStr = date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    })
    const fineAmount = INCIDENT_TYPE_META[v.incident.type]?.fineAmount ?? 0
    return [
      v.id,
      v.vehicle_number,
      INCIDENT_TYPE_META[v.incident.type]?.label ?? v.incident.type,
      v.address.area,
      dateStr,
      timeStr,
      fineAmount,
    ]
  })

  const csvContent =
    "\uFEFF" +
    [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            const str = String(cell)
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`
            }
            return str
          })
          .join(",")
      )
      .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `violations-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
