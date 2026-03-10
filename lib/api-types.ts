export type IncidentType =
  | "pucc_expired"
  | "insurance_expired"
  | "fitness_expired"
  | "eol"
  | "road_tax_unpaid"

export const INCIDENT_TYPE_META: Record<IncidentType, { label: string; fineAmount: number }> = {
  pucc_expired: { label: "PUCC Expired", fineAmount: 1000 },
  insurance_expired: { label: "Insurance Expired", fineAmount: 2000 },
  fitness_expired: { label: "Fitness/CF Expired", fineAmount: 2000 },
  eol: { label: "End of Life (EOL)", fineAmount: 5000 },
  road_tax_unpaid: { label: "Road Tax Unpaid", fineAmount: 3000 },
}

export type ApiAddress = {
  area: string
}

export type ApiAddressDetail = {
  area: string
  long: string
  short: string
}

export type ApiIncident = {
  type: IncidentType
}

export type ApiIncidentDetail = {
  type: IncidentType
  certificate_number?: string
  expiry_date?: string
}

export type ApiRc = {
  is_commercial: boolean
  vehicle_class: string
}

export type ApiRcDetail = {
  is_commercial: boolean
  vehicle_class: string
  color?: string
  maker?: string
  model?: string
}

export type ApiViolation = {
  id: number
  vehicle_number: string
  timestamp: string
  address: ApiAddress
  incident: ApiIncident
  rc: ApiRc
}

export type ApiViolationDetail = {
  id: number
  vehicle_number: string
  timestamp: string
  address: ApiAddressDetail
  incident: ApiIncidentDetail
  rc: ApiRcDetail
  location: {
    latitude: number
    longitude: number
  }
  proof: Array<{
    media_type: string
    url: string
  }>
}

export type StatEntry = {
  count: number
  change_bps: number
}

export type OverviewResponse = {
  start_timestamp: string
  end_timestamp: string
  recent_violations: ApiViolation[]
  stats: {
    challans_issued: StatEntry
    high_risk_zones: StatEntry
    vehicles_detected: StatEntry
    violations_detected: StatEntry
  }
}

export type ViolationsListResponse = {
  data: ApiViolation[]
  page: number
  limit: number
  total: number
  total_pages: number
}
