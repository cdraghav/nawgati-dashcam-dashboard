import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ReviewDecision = "approved" | "rejected" | "flagged"

export type ReviewEntry = {
  decision: ReviewDecision
  notes: string
  reviewedAt: string
}

type VisualsStore = {
  reviews: Record<number, ReviewEntry>
  reviewViolation: (id: number, decision: ReviewDecision, notes: string) => void
}

export const useVisualsStore = create<VisualsStore>()(
  persist(
    (set) => ({
      reviews: {},

      reviewViolation: (id, decision, notes) => {
        set((state) => ({
          reviews: {
            ...state.reviews,
            [id]: { decision, notes, reviewedAt: new Date().toISOString() },
          },
        }))
      },
    }),
    {
      name: "visuals-store",
    }
  )
)
