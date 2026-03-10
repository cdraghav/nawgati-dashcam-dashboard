export type District =
  | "all"
  | "east_delhi"
  | "south_delhi"
  | "north_delhi"
  | "west_delhi"
  | "northeast_delhi"

export type VehicleType = "car" | "truck" | "motorcycle" | "bus" | "auto"

export type ViolationCategory =
  | "insurance_expired"
  | "pucc_expired"
  | "tax_unpaid"
  | "registration_expired"
  | "fitness_expired"
  | "overspeeding"
  | "signal_jump"
  | "wrong_lane"

export type ReviewStatus = "pending_review" | "approved" | "rejected" | "flagged"

export type ChallanStatus = "pending" | "paid" | "contested"

export type CameraStatus = "active" | "inactive" | "maintenance"

export type Camera = {
  id: string
  locationName: string
  district: District
  status: CameraStatus
}

export type Vehicle = {
  id: string
  number: string
  type: VehicleType
  ownerName: string
}

export type Violation = {
  id: string
  vehicleId: string
  cameraId: string
  categories: ViolationCategory[]
  confidence: number
  timestamp: string
  district: District
  locationName: string
  status: ReviewStatus
  challanId?: string
  reviewNotes?: string
  reviewedAt?: string
}

export type Challan = {
  id: string
  violationId: string
  vehicleId: string
  categories: ViolationCategory[]
  amount: number
  issuedAt: string
  status: ChallanStatus
}

export type ViolationCategoryMeta = {
  label: string
  fineAmount: number
}

export const VIOLATION_CATEGORY_META: Record<ViolationCategory, ViolationCategoryMeta> = {
  insurance_expired: { label: "Insurance Expired", fineAmount: 2000 },
  pucc_expired: { label: "PUCC Expired", fineAmount: 1000 },
  tax_unpaid: { label: "Tax Unpaid", fineAmount: 5000 },
  registration_expired: { label: "Registration Expired", fineAmount: 2500 },
  fitness_expired: { label: "Fitness/CF Expired", fineAmount: 2000 },
  overspeeding: { label: "Overspeeding", fineAmount: 1500 },
  signal_jump: { label: "Signal Jump", fineAmount: 1000 },
  wrong_lane: { label: "Wrong Lane", fineAmount: 500 },
}

export const REVIEW_STATUS_META: Record<
  ReviewStatus,
  { label: string; className: string }
> = {
  pending_review: {
    label: "Pending",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/60 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    className:
      "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/60 dark:text-red-400",
  },
  flagged: {
    label: "Flagged",
    className:
      "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/60 dark:text-orange-400",
  },
}

export const DISTRICT_LABELS: Record<District, string> = {
  all: "All Districts",
  east_delhi: "East Delhi",
  south_delhi: "South Delhi",
  north_delhi: "North Delhi",
  west_delhi: "West Delhi",
  northeast_delhi: "Northeast Delhi",
}
