"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  MapPinIcon,
  CalendarIcon,
  Loader2Icon,
  CarIcon,
  PlayIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FlagIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { ImageViewerModal } from "@/components/ui/image-viewer-modal"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NumberPlate } from "@/components/ui/number-plate"
import { ImageBentoGrid } from "@/components/violations/image-bento-grid"
import { INCIDENT_TYPE_META } from "@/lib/api-types"
import { reviewSchema } from "@/lib/schemas"
import { useVisualsStore } from "@/lib/store"
import { useViolationDetail } from "@/hooks/use-queries"

type ViolationDetailProps = {
  violationId: number
}

const DECISION_META = {
  approved: {
    label: "Approved — Challan Issued",
    icon: CheckCircle2Icon,
    bannerClass: "border-success-3 bg-success-0 text-success-3 dark:text-success-2",
    iconClass: "text-success-3 dark:text-success-2",
  },
  rejected: {
    label: "Violation Rejected",
    icon: XCircleIcon,
    bannerClass: "border-error-3 bg-error-0 text-error-3 dark:text-error-2",
    iconClass: "text-error-3 dark:text-error-2",
  },
  flagged: {
    label: "Flagged for Review",
    icon: FlagIcon,
    bannerClass: "border-warning-3 bg-warning-0 text-warning-3 dark:text-warning-2",
    iconClass: "text-warning-3 dark:text-warning-2",
  },
}

export function ViolationDetail({ violationId }: ViolationDetailProps) {
  const { data: violation, isPending: isLoadingDetail, isError } = useViolationDetail(violationId)
  const reviews = useVisualsStore((s) => s.reviews)
  const reviewViolation = useVisualsStore((s) => s.reviewViolation)

  const review = reviews[violationId]
  const isReviewPending = !review

  const [notes, setNotes] = React.useState("")
  const [notesError, setNotesError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [pendingDecision, setPendingDecision] = React.useState<"approved" | "rejected" | "flagged" | null>(null)
  const [viewerIndex, setViewerIndex] = React.useState<number | null>(null)

  React.useEffect(() => {
    setNotes("")
    setNotesError("")
    setPendingDecision(null)
  }, [violationId])

  async function handleDecision(decision: "approved" | "rejected" | "flagged") {
    setNotesError("")

    const result = reviewSchema.safeParse({ notes })
    if (!result.success) {
      setNotesError(result.error.issues[0]?.message ?? "Invalid notes")
      return
    }

    setPendingDecision(decision)
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600))

    reviewViolation(violationId, decision, notes)

    const messages = {
      approved: "Challan issued successfully",
      rejected: "Violation rejected",
      flagged: "Violation flagged for review",
    }

    toast.success(messages[decision])
    setIsSubmitting(false)
    setPendingDecision(null)
  }

  if (isLoadingDetail) {
    return (
      <div className="flex flex-col w-full h-full p-5 gap-4">
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-px bg-muted" />
        <div className="aspect-video w-full animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (isError || !violation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Failed to load violation details</p>
      </div>
    )
  }

  const incidentLabel = INCIDENT_TYPE_META[violation.incident.type]?.label ?? violation.incident.type
  const vehicleDescription = [violation.rc.maker, violation.rc.model, violation.rc.color]
    .filter(Boolean)
    .join(" · ")

  const images = violation.proof.filter((p) => p.media_type === "image").map((p) => p.url)
  const videos = violation.proof.filter((p) => p.media_type === "video").map((p) => p.url)

  const reviewMeta = review ? DECISION_META[review.decision] : null
  const ReviewIcon = reviewMeta?.icon

  return (
    <>
      {viewerIndex !== null && images.length > 0 && (
        <ImageViewerModal
          images={images}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      <div data-slot="violation-detail" className="flex flex-col flex-1 min-h-0 w-full">
        <div className="shrink-0 px-5 pt-5 pb-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <NumberPlate value={violation.vehicle_number} isCommercial={violation.rc.is_commercial} className="text-base" />
              {vehicleDescription && (
                <p className="text-sm text-muted-foreground">{vehicleDescription}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-2.5 py-1.5 shrink-0">
              <CarIcon className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">{violation.rc.vehicle_class}</span>
              {violation.rc.is_commercial && (
                <span className="text-xs text-muted-foreground">· Commercial</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-3.5" />
              {format(new Date(violation.timestamp), "dd MMM yyyy, HH:mm")}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="size-3.5" />
              {violation.address.short ?? violation.address.area}
            </span>
          </div>
        </div>

        <Separator />

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-5 space-y-6">
            {violation.proof.length > 0 ? (
              <div className="space-y-3">
                {images.length > 0 && (
                  <ImageBentoGrid
                    images={images}
                    assetName={violation.vehicle_number}
                    onImageClick={setViewerIndex}
                  />
                )}
                {videos.map((url, i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg border bg-muted aspect-video">
                    <video
                      src={url}
                      controls
                      className="h-full w-full object-contain"
                      preload="metadata"
                    >
                      <track kind="captions" />
                    </video>
                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-sm pointer-events-none">
                      <PlayIcon className="size-3 text-white" />
                      <span className="text-[10px] font-medium text-white">Video</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                <p className="text-xs text-muted-foreground">No footage available</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Detected Violation
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="destructive" className="text-xs">{incidentLabel}</Badge>
                {violation.incident.expiry_date && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Expired: {violation.incident.expiry_date}
                  </Badge>
                )}
                {violation.incident.certificate_number && (
                  <Badge variant="outline" className="text-xs text-muted-foreground font-mono">
                    {violation.incident.certificate_number}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Review Decision
              </p>

              {isReviewPending ? (
                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Notes <span className="font-normal text-muted-foreground">(optional)</span></FieldLabel>
                    <Textarea
                      placeholder="Add context or reasoning for your decision..."
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value)
                        setNotesError("")
                      }}
                      disabled={isSubmitting}
                      rows={3}
                      className="resize-none"
                      aria-invalid={!!notesError}
                    />
                    {notesError && <FieldError>{notesError}</FieldError>}
                    <p className="text-xs text-muted-foreground">{notes.length}/500 characters</p>
                  </Field>

                  <div className="flex flex-col gap-2.5">
                    <Button
                      size="lg"
                      disabled={isSubmitting}
                      onClick={() => handleDecision("approved")}
                      className="w-full justify-start gap-3 h-12 bg-success-3 text-white hover:bg-success-3/90 dark:bg-success-3 dark:hover:bg-success-3/90"
                    >
                      {isSubmitting && pendingDecision === "approved" ? (
                        <Loader2Icon className="size-5 animate-spin" />
                      ) : (
                        <CheckCircle2Icon className="size-5 shrink-0" />
                      )}
                      <span className="font-semibold">Approve &amp; Issue Challan</span>
                    </Button>

                    <Button
                      size="lg"
                      variant="destructive"
                      disabled={isSubmitting}
                      onClick={() => handleDecision("rejected")}
                      className="w-full justify-start gap-3 h-12"
                    >
                      {isSubmitting && pendingDecision === "rejected" ? (
                        <Loader2Icon className="size-5 animate-spin" />
                      ) : (
                        <XCircleIcon className="size-5 shrink-0" />
                      )}
                      <span className="font-semibold">Reject Violation</span>
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => handleDecision("flagged")}
                      className="w-full justify-start gap-3 h-12 border-warning-3 text-warning-3 hover:bg-warning-0 hover:text-warning-3 dark:hover:bg-warning-0/10"
                    >
                      {isSubmitting && pendingDecision === "flagged" ? (
                        <Loader2Icon className="size-5 animate-spin" />
                      ) : (
                        <FlagIcon className="size-5 shrink-0" />
                      )}
                      <span className="font-semibold">Flag for Review</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={cn("rounded-xl border-2 p-4 space-y-3", reviewMeta?.bannerClass)}>
                  <div className="flex items-center gap-3">
                    {ReviewIcon && (
                      <ReviewIcon className={cn("size-6 shrink-0", reviewMeta?.iconClass)} />
                    )}
                    <div>
                      <p className="font-semibold text-base leading-tight">{reviewMeta?.label}</p>
                      {review.reviewedAt && (
                        <p className="text-xs opacity-70 mt-0.5">
                          {format(new Date(review.reviewedAt), "dd MMM yyyy 'at' HH:mm")}
                        </p>
                      )}
                    </div>
                  </div>
                  {review.notes && (
                    <div className="pt-2 border-t border-current/20">
                      <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                        Notes
                      </p>
                      <p className="text-sm leading-relaxed">{review.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
