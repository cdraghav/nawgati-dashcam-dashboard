"use client"

import * as React from "react"
import Image from "next/image"
import { X } from "lucide-react"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type ImageViewerModalProps = {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export function ImageViewerModal({ images, initialIndex, onClose }: ImageViewerModalProps) {
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        api?.scrollPrev()
      } else if (e.key === "ArrowRight") {
        api?.scrollNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, api])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 w-full p-6 flex justify-end items-center z-50">
        <button
          className="p-3 rounded-full bg-secondary-foreground/10 text-secondary-foreground hover:bg-secondary-foreground/25 hover:scale-110 active:scale-95 transition-all duration-200 backdrop-blur-md"
          onClick={onClose}
        >
          <X size={28} />
        </button>
      </div>

      <div
        className="relative w-full flex-1 max-w-4xl md:max-w-6xl flex items-center justify-center px-16 md:px-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Carousel
          setApi={setApi}
          opts={{ startIndex: initialIndex, loop: true }}
          className="w-full"
        >
          <CarouselContent className="items-center">
            {images.map((src, index) => (
              <CarouselItem key={index} className="flex items-center justify-center">
                <Image
                  src={src}
                  alt={`Viewing image ${index + 1}`}
                  width={1280}
                  height={720}
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none mx-auto"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12 md:-left-16 h-12 w-12 bg-secondary-foreground/10 border-2 border-transparent text-secondary-foreground hover:bg-secondary-foreground/20 hover:text-secondary-foreground hover:border-secondary-foreground/30 hover:scale-110 active:scale-95 backdrop-blur-md transition-all duration-200" />
          <CarouselNext className="right-[-3rem] md:right-[-4rem] h-12 w-12 bg-secondary-foreground/10 border-2 border-transparent text-secondary-foreground hover:bg-secondary-foreground/20 hover:text-secondary-foreground hover:border-secondary-foreground/30 hover:scale-110 active:scale-95 backdrop-blur-md transition-all duration-200" />
        </Carousel>
      </div>
    </div>
  )
}
