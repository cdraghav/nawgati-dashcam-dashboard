import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const reviewSchema = z.object({
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional()
    .or(z.literal("")),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type ReviewFormValues = z.infer<typeof reviewSchema>
