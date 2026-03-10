import type { Camera, Vehicle, Violation, Challan, District, ViolationCategory } from "./types"

export const cameras: Camera[] = [
  { id: "PV-001", locationName: "Connaught Place", district: "south_delhi", status: "active" },
  { id: "PV-002", locationName: "Rajiv Chowk", district: "south_delhi", status: "active" },
  { id: "PV-003", locationName: "Lajpat Nagar", district: "south_delhi", status: "active" },
  { id: "PV-004", locationName: "Karol Bagh", district: "west_delhi", status: "active" },
  { id: "PV-005", locationName: "Patel Nagar", district: "west_delhi", status: "maintenance" },
  { id: "PV-006", locationName: "Chandni Chowk", district: "north_delhi", status: "active" },
  { id: "PV-007", locationName: "Civil Lines", district: "north_delhi", status: "active" },
  { id: "PV-008", locationName: "Shahdara", district: "east_delhi", status: "active" },
  { id: "PV-009", locationName: "Preet Vihar", district: "east_delhi", status: "inactive" },
  { id: "PV-010", locationName: "Yamuna Vihar", district: "northeast_delhi", status: "active" },
]

export const vehicles: Vehicle[] = [
  { id: "V001", number: "DL 01 AB 1234", type: "car", ownerName: "Rahul Sharma" },
  { id: "V002", number: "DL 02 CD 5678", type: "motorcycle", ownerName: "Priya Mehta" },
  { id: "V003", number: "DL 03 EF 9012", type: "truck", ownerName: "Suresh Kumar" },
  { id: "V004", number: "DL 04 GH 3456", type: "bus", ownerName: "Rajesh Transport Co." },
  { id: "V005", number: "DL 05 IJ 7890", type: "auto", ownerName: "Manoj Yadav" },
  { id: "V006", number: "DL 06 KL 2345", type: "car", ownerName: "Anita Singh" },
  { id: "V007", number: "DL 07 MN 6789", type: "motorcycle", ownerName: "Vikram Patel" },
  { id: "V008", number: "DL 08 OP 0123", type: "car", ownerName: "Sunita Gupta" },
  { id: "V009", number: "DL 09 QR 4567", type: "truck", ownerName: "Dinesh Logistics" },
  { id: "V010", number: "DL 10 ST 8901", type: "car", ownerName: "Kavita Joshi" },
  { id: "V011", number: "DL 11 UV 2345", type: "auto", ownerName: "Arun Kumar" },
  { id: "V012", number: "DL 12 WX 6789", type: "motorcycle", ownerName: "Pooja Sharma" },
  { id: "V013", number: "DL 13 YZ 0123", type: "car", ownerName: "Amit Verma" },
  { id: "V014", number: "DL 14 AA 4567", type: "bus", ownerName: "Metro Transit Ltd." },
  { id: "V015", number: "DL 15 BB 8901", type: "car", ownerName: "Neha Agarwal" },
  { id: "V016", number: "DL 16 CC 2345", type: "truck", ownerName: "Ram Carriers" },
  { id: "V017", number: "DL 17 DD 6789", type: "motorcycle", ownerName: "Sanjay Mishra" },
  { id: "V018", number: "DL 18 EE 0123", type: "car", ownerName: "Deepa Nair" },
  { id: "V019", number: "DL 19 FF 4567", type: "auto", ownerName: "Ashok Yadav" },
  { id: "V020", number: "DL 20 GG 8901", type: "car", ownerName: "Meena Kapoor" },
]

const today = new Date()
const todayStr = today.toISOString().split("T")[0]

function makeTimestamp(daysAgo: number, hour: number, minute: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

export const violations: Violation[] = [
  {
    id: "VIO-001",
    vehicleId: "V001",
    cameraId: "PV-001",
    categories: ["insurance_expired", "pucc_expired"],
    confidence: 94.2,
    timestamp: makeTimestamp(0, 8, 15),
    district: "south_delhi",
    locationName: "Connaught Place, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-002",
    vehicleId: "V002",
    cameraId: "PV-002",
    categories: ["overspeeding"],
    confidence: 88.7,
    timestamp: makeTimestamp(0, 9, 32),
    district: "south_delhi",
    locationName: "Rajiv Chowk, Delhi",
    status: "approved",
    challanId: "CHL-001",
    reviewedAt: makeTimestamp(0, 10, 0),
  },
  {
    id: "VIO-003",
    vehicleId: "V003",
    cameraId: "PV-006",
    categories: ["fitness_expired", "tax_unpaid"],
    confidence: 91.5,
    timestamp: makeTimestamp(0, 7, 45),
    district: "north_delhi",
    locationName: "Chandni Chowk, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-004",
    vehicleId: "V004",
    cameraId: "PV-007",
    categories: ["registration_expired"],
    confidence: 96.1,
    timestamp: makeTimestamp(0, 10, 20),
    district: "north_delhi",
    locationName: "Civil Lines, Delhi",
    status: "approved",
    challanId: "CHL-002",
    reviewedAt: makeTimestamp(0, 11, 0),
  },
  {
    id: "VIO-005",
    vehicleId: "V005",
    cameraId: "PV-004",
    categories: ["insurance_expired"],
    confidence: 82.3,
    timestamp: makeTimestamp(0, 11, 5),
    district: "west_delhi",
    locationName: "Karol Bagh, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-006",
    vehicleId: "V006",
    cameraId: "PV-008",
    categories: ["signal_jump"],
    confidence: 79.4,
    timestamp: makeTimestamp(0, 6, 50),
    district: "east_delhi",
    locationName: "Shahdara, Delhi",
    status: "rejected",
    reviewNotes: "Low confidence, inconclusive footage",
    reviewedAt: makeTimestamp(0, 9, 0),
  },
  {
    id: "VIO-007",
    vehicleId: "V007",
    cameraId: "PV-001",
    categories: ["pucc_expired"],
    confidence: 93.8,
    timestamp: makeTimestamp(0, 12, 30),
    district: "south_delhi",
    locationName: "Connaught Place, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-008",
    vehicleId: "V008",
    cameraId: "PV-010",
    categories: ["tax_unpaid", "registration_expired"],
    confidence: 87.6,
    timestamp: makeTimestamp(0, 13, 15),
    district: "northeast_delhi",
    locationName: "Yamuna Vihar, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-009",
    vehicleId: "V009",
    cameraId: "PV-003",
    categories: ["fitness_expired"],
    confidence: 90.2,
    timestamp: makeTimestamp(0, 14, 0),
    district: "south_delhi",
    locationName: "Lajpat Nagar, Delhi",
    status: "approved",
    challanId: "CHL-003",
    reviewedAt: makeTimestamp(0, 15, 0),
  },
  {
    id: "VIO-010",
    vehicleId: "V010",
    cameraId: "PV-002",
    categories: ["overspeeding", "wrong_lane"],
    confidence: 85.9,
    timestamp: makeTimestamp(0, 15, 45),
    district: "south_delhi",
    locationName: "Rajiv Chowk, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-011",
    vehicleId: "V011",
    cameraId: "PV-006",
    categories: ["insurance_expired"],
    confidence: 92.1,
    timestamp: makeTimestamp(0, 16, 10),
    district: "north_delhi",
    locationName: "Chandni Chowk, Delhi",
    status: "flagged",
    reviewNotes: "Vehicle appears stolen, escalated",
    reviewedAt: makeTimestamp(0, 17, 0),
  },
  {
    id: "VIO-012",
    vehicleId: "V012",
    cameraId: "PV-004",
    categories: ["pucc_expired", "insurance_expired"],
    confidence: 88.4,
    timestamp: makeTimestamp(0, 17, 25),
    district: "west_delhi",
    locationName: "Karol Bagh, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-013",
    vehicleId: "V013",
    cameraId: "PV-007",
    categories: ["registration_expired"],
    confidence: 95.7,
    timestamp: makeTimestamp(0, 7, 30),
    district: "north_delhi",
    locationName: "Civil Lines, Delhi",
    status: "approved",
    challanId: "CHL-004",
    reviewedAt: makeTimestamp(0, 9, 30),
  },
  {
    id: "VIO-014",
    vehicleId: "V014",
    cameraId: "PV-008",
    categories: ["fitness_expired", "registration_expired"],
    confidence: 91.0,
    timestamp: makeTimestamp(0, 8, 55),
    district: "east_delhi",
    locationName: "Shahdara, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-015",
    vehicleId: "V015",
    cameraId: "PV-001",
    categories: ["tax_unpaid"],
    confidence: 86.3,
    timestamp: makeTimestamp(0, 9, 40),
    district: "south_delhi",
    locationName: "Connaught Place, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-016",
    vehicleId: "V016",
    cameraId: "PV-010",
    categories: ["overspeeding"],
    confidence: 89.8,
    timestamp: makeTimestamp(0, 10, 50),
    district: "northeast_delhi",
    locationName: "Yamuna Vihar, Delhi",
    status: "approved",
    challanId: "CHL-005",
    reviewedAt: makeTimestamp(0, 11, 30),
  },
  {
    id: "VIO-017",
    vehicleId: "V017",
    cameraId: "PV-003",
    categories: ["signal_jump"],
    confidence: 77.2,
    timestamp: makeTimestamp(0, 11, 35),
    district: "south_delhi",
    locationName: "Lajpat Nagar, Delhi",
    status: "rejected",
    reviewNotes: "Camera angle obstructed",
    reviewedAt: makeTimestamp(0, 13, 0),
  },
  {
    id: "VIO-018",
    vehicleId: "V018",
    cameraId: "PV-002",
    categories: ["insurance_expired", "fitness_expired"],
    confidence: 93.5,
    timestamp: makeTimestamp(0, 12, 0),
    district: "south_delhi",
    locationName: "Rajiv Chowk, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-019",
    vehicleId: "V019",
    cameraId: "PV-006",
    categories: ["pucc_expired"],
    confidence: 84.7,
    timestamp: makeTimestamp(0, 13, 45),
    district: "north_delhi",
    locationName: "Chandni Chowk, Delhi",
    status: "pending_review",
  },
  {
    id: "VIO-020",
    vehicleId: "V020",
    cameraId: "PV-004",
    categories: ["registration_expired", "tax_unpaid"],
    confidence: 90.6,
    timestamp: makeTimestamp(0, 14, 30),
    district: "west_delhi",
    locationName: "Karol Bagh, Delhi",
    status: "approved",
    challanId: "CHL-006",
    reviewedAt: makeTimestamp(0, 15, 30),
  },
  {
    id: "VIO-021",
    vehicleId: "V001",
    cameraId: "PV-008",
    categories: ["wrong_lane"],
    confidence: 81.9,
    timestamp: makeTimestamp(1, 9, 0),
    district: "east_delhi",
    locationName: "Shahdara, Delhi",
    status: "approved",
    challanId: "CHL-007",
    reviewedAt: makeTimestamp(1, 10, 0),
  },
  {
    id: "VIO-022",
    vehicleId: "V003",
    cameraId: "PV-001",
    categories: ["fitness_expired"],
    confidence: 94.4,
    timestamp: makeTimestamp(1, 11, 0),
    district: "south_delhi",
    locationName: "Connaught Place, Delhi",
    status: "approved",
    challanId: "CHL-008",
    reviewedAt: makeTimestamp(1, 12, 0),
  },
  {
    id: "VIO-023",
    vehicleId: "V005",
    cameraId: "PV-007",
    categories: ["insurance_expired"],
    confidence: 87.2,
    timestamp: makeTimestamp(1, 14, 0),
    district: "north_delhi",
    locationName: "Civil Lines, Delhi",
    status: "rejected",
    reviewNotes: "Documents found to be valid",
    reviewedAt: makeTimestamp(1, 15, 0),
  },
  {
    id: "VIO-024",
    vehicleId: "V008",
    cameraId: "PV-010",
    categories: ["pucc_expired", "tax_unpaid"],
    confidence: 92.8,
    timestamp: makeTimestamp(1, 8, 0),
    district: "northeast_delhi",
    locationName: "Yamuna Vihar, Delhi",
    status: "approved",
    challanId: "CHL-009",
    reviewedAt: makeTimestamp(1, 9, 0),
  },
  {
    id: "VIO-025",
    vehicleId: "V012",
    cameraId: "PV-003",
    categories: ["registration_expired"],
    confidence: 96.3,
    timestamp: makeTimestamp(1, 16, 0),
    district: "south_delhi",
    locationName: "Lajpat Nagar, Delhi",
    status: "approved",
    challanId: "CHL-010",
    reviewedAt: makeTimestamp(1, 17, 0),
  },
  {
    id: "VIO-026",
    vehicleId: "V015",
    cameraId: "PV-002",
    categories: ["overspeeding"],
    confidence: 83.6,
    timestamp: makeTimestamp(2, 10, 0),
    district: "south_delhi",
    locationName: "Rajiv Chowk, Delhi",
    status: "approved",
    challanId: "CHL-011",
    reviewedAt: makeTimestamp(2, 11, 0),
  },
  {
    id: "VIO-027",
    vehicleId: "V017",
    cameraId: "PV-006",
    categories: ["fitness_expired", "insurance_expired"],
    confidence: 89.1,
    timestamp: makeTimestamp(2, 12, 0),
    district: "north_delhi",
    locationName: "Chandni Chowk, Delhi",
    status: "approved",
    challanId: "CHL-012",
    reviewedAt: makeTimestamp(2, 13, 0),
  },
  {
    id: "VIO-028",
    vehicleId: "V019",
    cameraId: "PV-004",
    categories: ["signal_jump"],
    confidence: 76.5,
    timestamp: makeTimestamp(2, 7, 0),
    district: "west_delhi",
    locationName: "Karol Bagh, Delhi",
    status: "rejected",
    reviewNotes: "Footage quality insufficient",
    reviewedAt: makeTimestamp(2, 8, 0),
  },
  {
    id: "VIO-029",
    vehicleId: "V020",
    cameraId: "PV-008",
    categories: ["tax_unpaid"],
    confidence: 90.0,
    timestamp: makeTimestamp(2, 15, 0),
    district: "east_delhi",
    locationName: "Shahdara, Delhi",
    status: "approved",
    challanId: "CHL-013",
    reviewedAt: makeTimestamp(2, 16, 0),
  },
  {
    id: "VIO-030",
    vehicleId: "V004",
    cameraId: "PV-001",
    categories: ["registration_expired", "fitness_expired"],
    confidence: 93.2,
    timestamp: makeTimestamp(3, 9, 0),
    district: "south_delhi",
    locationName: "Connaught Place, Delhi",
    status: "approved",
    challanId: "CHL-014",
    reviewedAt: makeTimestamp(3, 10, 0),
  },
  {
    id: "VIO-031",
    vehicleId: "V006",
    cameraId: "PV-010",
    categories: ["pucc_expired"],
    confidence: 85.4,
    timestamp: makeTimestamp(3, 11, 0),
    district: "northeast_delhi",
    locationName: "Yamuna Vihar, Delhi",
    status: "approved",
    challanId: "CHL-015",
    reviewedAt: makeTimestamp(3, 12, 0),
  },
]

export const challans: Challan[] = [
  {
    id: "CHL-001",
    violationId: "VIO-002",
    vehicleId: "V002",
    categories: ["overspeeding"],
    amount: 1500,
    issuedAt: makeTimestamp(0, 10, 0),
    status: "pending",
  },
  {
    id: "CHL-002",
    violationId: "VIO-004",
    vehicleId: "V004",
    categories: ["registration_expired"],
    amount: 2500,
    issuedAt: makeTimestamp(0, 11, 0),
    status: "pending",
  },
  {
    id: "CHL-003",
    violationId: "VIO-009",
    vehicleId: "V009",
    categories: ["fitness_expired"],
    amount: 2000,
    issuedAt: makeTimestamp(0, 15, 0),
    status: "paid",
  },
  {
    id: "CHL-004",
    violationId: "VIO-013",
    vehicleId: "V013",
    categories: ["registration_expired"],
    amount: 2500,
    issuedAt: makeTimestamp(0, 9, 30),
    status: "pending",
  },
  {
    id: "CHL-005",
    violationId: "VIO-016",
    vehicleId: "V016",
    categories: ["overspeeding"],
    amount: 1500,
    issuedAt: makeTimestamp(0, 11, 30),
    status: "contested",
  },
  {
    id: "CHL-006",
    violationId: "VIO-020",
    vehicleId: "V020",
    categories: ["registration_expired", "tax_unpaid"],
    amount: 7500,
    issuedAt: makeTimestamp(0, 15, 30),
    status: "pending",
  },
  {
    id: "CHL-007",
    violationId: "VIO-021",
    vehicleId: "V001",
    categories: ["wrong_lane"],
    amount: 500,
    issuedAt: makeTimestamp(1, 10, 0),
    status: "paid",
  },
  {
    id: "CHL-008",
    violationId: "VIO-022",
    vehicleId: "V003",
    categories: ["fitness_expired"],
    amount: 2000,
    issuedAt: makeTimestamp(1, 12, 0),
    status: "paid",
  },
  {
    id: "CHL-009",
    violationId: "VIO-024",
    vehicleId: "V008",
    categories: ["pucc_expired", "tax_unpaid"],
    amount: 6000,
    issuedAt: makeTimestamp(1, 9, 0),
    status: "pending",
  },
  {
    id: "CHL-010",
    violationId: "VIO-025",
    vehicleId: "V012",
    categories: ["registration_expired"],
    amount: 2500,
    issuedAt: makeTimestamp(1, 17, 0),
    status: "paid",
  },
  {
    id: "CHL-011",
    violationId: "VIO-026",
    vehicleId: "V015",
    categories: ["overspeeding"],
    amount: 1500,
    issuedAt: makeTimestamp(2, 11, 0),
    status: "paid",
  },
  {
    id: "CHL-012",
    violationId: "VIO-027",
    vehicleId: "V017",
    categories: ["fitness_expired", "insurance_expired"],
    amount: 4000,
    issuedAt: makeTimestamp(2, 13, 0),
    status: "pending",
  },
  {
    id: "CHL-013",
    violationId: "VIO-029",
    vehicleId: "V020",
    categories: ["tax_unpaid"],
    amount: 5000,
    issuedAt: makeTimestamp(2, 16, 0),
    status: "pending",
  },
  {
    id: "CHL-014",
    violationId: "VIO-030",
    vehicleId: "V004",
    categories: ["registration_expired", "fitness_expired"],
    amount: 4500,
    issuedAt: makeTimestamp(3, 10, 0),
    status: "paid",
  },
  {
    id: "CHL-015",
    violationId: "VIO-031",
    vehicleId: "V006",
    categories: ["pucc_expired"],
    amount: 1000,
    issuedAt: makeTimestamp(3, 12, 0),
    status: "paid",
  },
]

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id)
}

export function getCameraById(id: string): Camera | undefined {
  return cameras.find((c) => c.id === id)
}

export function getChallanById(id: string): Challan | undefined {
  return challans.find((c) => c.id === id)
}

export function getTodayViolations(allViolations: Violation[]): Violation[] {
  return allViolations.filter((v) => v.timestamp.startsWith(todayStr))
}

export function computeDashboardStats(
  allViolations: Violation[],
  allChallans: Challan[]
): {
  vehiclesDetectedToday: number
  violationsToday: number
  challansIssuedToday: number
  pendingReviews: number
  activeCameras: number
  highRiskZones: number
  yesterdayVehicles: number
  yesterdayViolations: number
  yesterdayChallans: number
  yesterdayPending: number
} {
  const todayViolations = getTodayViolations(allViolations)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]
  const yesterdayViolations = allViolations.filter((v) => v.timestamp.startsWith(yesterdayStr))

  const uniqueVehiclesToday = new Set(todayViolations.map((v) => v.vehicleId)).size
  const uniqueVehiclesYesterday = new Set(yesterdayViolations.map((v) => v.vehicleId)).size

  const challansToday = allChallans.filter((c) => c.issuedAt.startsWith(todayStr))
  const challansYesterday = allChallans.filter((c) => c.issuedAt.startsWith(yesterdayStr))

  const pendingToday = allViolations.filter((v) => v.status === "pending_review").length
  const pendingYesterday = Math.max(0, pendingToday - 3)

  const locationCounts = todayViolations.reduce<Record<string, number>>((acc, v) => {
    acc[v.locationName] = (acc[v.locationName] ?? 0) + 1
    return acc
  }, {})
  const highRisk = Object.values(locationCounts).filter((count) => count > 2).length

  const activeCams = cameras.filter((c) => c.status === "active").length

  return {
    vehiclesDetectedToday: uniqueVehiclesToday,
    violationsToday: todayViolations.length,
    challansIssuedToday: challansToday.length,
    pendingReviews: pendingToday,
    activeCameras: activeCams,
    highRiskZones: highRisk,
    yesterdayVehicles: uniqueVehiclesYesterday,
    yesterdayViolations: yesterdayViolations.length,
    yesterdayChallans: challansYesterday.length,
    yesterdayPending: pendingYesterday,
  }
}

export function getViolationCategoryDistribution(
  allViolations: Violation[]
): { category: ViolationCategory; count: number }[] {
  const counts: Partial<Record<ViolationCategory, number>> = {}
  allViolations.forEach((v) => {
    v.categories.forEach((cat) => {
      counts[cat] = (counts[cat] ?? 0) + 1
    })
  })
  return Object.entries(counts).map(([cat, count]) => ({
    category: cat as ViolationCategory,
    count: count as number,
  }))
}
