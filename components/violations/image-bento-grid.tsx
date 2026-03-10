"use client"

import * as React from "react"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"

type ImageBentoGridProps = {
  images: string[]
  assetName: string
  onImageClick: (index: number) => void
}

function getGridClass(index: number, total: number): string {
  if (total === 1) return "md:col-span-3 md:row-span-2"
  if (total === 2) return index === 0 ? "md:col-span-2" : "md:col-span-1"
  if (total === 3) {
    if (index === 0) return "md:col-span-2"
    if (index === 1) return "md:col-span-1"
    return "md:col-span-3"
  }
  const classes = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2"]
  return classes[index] ?? "md:col-span-1"
}

export function ImageBentoGrid({ images, assetName, onImageClick }: ImageBentoGridProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-muted rounded-xl">
        <p className="text-sm font-medium text-muted-foreground">No images available</p>
      </div>
    )
  }

  const maxDisplay = 4
  const displayImages = images.slice(0, maxDisplay)
  const remainingCount = images.length - maxDisplay

  return (
    <BentoGrid className="w-full md:auto-rows-[16rem]">
      {displayImages.map((imgSrc, i) => {
        const isLastVisible = i === maxDisplay - 1
        const hasMore = remainingCount > 0

        return (
          <BentoGridItem
            key={i}
            className={`${getGridClass(i, displayImages.length)} border-none shadow-none overflow-hidden p-0 relative group`}
            header={
              <div
                className="w-full h-full min-h-[12rem] relative rounded-xl overflow-hidden bg-muted/20 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => onImageClick(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onImageClick(i)
                  }
                }}
              >
                <img
                  src={imgSrc}
                  alt={`${assetName} proof ${i + 1}`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {isLastVisible && hasMore && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/40">
                    <span className="text-white font-bold text-2xl tracking-tight">
                      +{remainingCount} more
                    </span>
                  </div>
                )}
              </div>
            }
          />
        )
      })}
    </BentoGrid>
  )
}
