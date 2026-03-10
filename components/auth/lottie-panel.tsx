"use client"

import * as React from "react"
import Lottie from "lottie-react"

function getCaretNormX(el: HTMLInputElement): number {
  const pos = el.selectionStart ?? el.value.length
  const text = el.type === "password" ? "\u2022".repeat(pos) : el.value.slice(0, pos)
  const cs = window.getComputedStyle(el)
  const mirror = document.createElement("span")
  mirror.style.cssText = `position:fixed;visibility:hidden;white-space:pre;font:${cs.font};letter-spacing:${cs.letterSpacing};padding-left:${cs.paddingLeft}`
  mirror.textContent = text || "\u200b"
  document.body.appendChild(mirror)
  const textW = mirror.getBoundingClientRect().width
  document.body.removeChild(mirror)
  const rect = el.getBoundingClientRect()
  return Math.min(Math.max((rect.left + textW) / window.innerWidth, 0), 1)
}

function buildAnimData(raw: any, hasError: boolean): any {
  const clone = JSON.parse(JSON.stringify(raw))
  for (const asset of clone.assets ?? []) {
    for (const layer of asset.layers ?? []) {
      // Hide blue background circle
      if (layer.nm === "Layer 5 Outlines 2") {
        layer.hd = true
        continue
      }
      // Tint lens on error
      if (layer.nm === "Layer 5 Outlines" && hasError) {
        const frontGroup = layer.shapes?.find((s: any) => s.nm === "front")
        if (!frontGroup) continue
        const red = [0.93, 0.15, 0.15, 1]
        // Center dot fill (Group 7)
        const g7 = frontGroup.it?.find((s: any) => s.nm === "Group 7")
        const g7fill = g7?.it?.find((s: any) => s.ty === "fl")
        if (g7fill) g7fill.c.k = red
        // Outer ring stroke (Group 5)
        const g5 = frontGroup.it?.find((s: any) => s.nm === "Group 5")
        const g5stroke = g5?.it?.find((s: any) => s.ty === "st")
        if (g5stroke) g5stroke.c.k = red
        // Inner ring stroke (Group 6)
        const g6 = frontGroup.it?.find((s: any) => s.nm === "Group 6")
        const g6stroke = g6?.it?.find((s: any) => s.ty === "st")
        if (g6stroke) g6stroke.c.k = red
      }
    }
  }
  return clone
}

type LottiePanelProps = { hasError: boolean }

export function LottiePanel({ hasError }: LottiePanelProps) {
  const [rawData, setRawData] = React.useState<any>(null)
  const lottieRef = React.useRef<any>(null)
  const rafRef = React.useRef<number>(null)
  const targetX = React.useRef(0.5)
  const frameRef = React.useRef(60)

  React.useEffect(() => {
    fetch("/cctv.json").then((r) => r.json()).then(setRawData)
  }, [])

  React.useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (!(document.activeElement instanceof HTMLInputElement)) {
        targetX.current = e.clientX / window.innerWidth
      }
    }
    const onCaret = () => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement) targetX.current = getCaretNormX(el)
    }
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const tick = () => {
      const target = (1 - targetX.current) * 120
      frameRef.current = lerp(frameRef.current, target, 0.14)
      lottieRef.current?.goToAndStop(frameRef.current, true)
      rafRef.current = requestAnimationFrame(tick)
    }
    document.addEventListener("mousemove", onMouse)
    document.addEventListener("selectionchange", onCaret)
    document.addEventListener("input", onCaret)
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      document.removeEventListener("mousemove", onMouse)
      document.removeEventListener("selectionchange", onCaret)
      document.removeEventListener("input", onCaret)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const animData = React.useMemo(
    () => (rawData ? buildAnimData(rawData, hasError) : null),
    [rawData, hasError]
  )

  if (!animData) return null

  return (
    <div style={{ marginBottom: -20, zIndex: 0, position: "relative" }}>
      <Lottie
        key={hasError ? "error" : "normal"}
        lottieRef={lottieRef}
        animationData={animData}
        autoplay={false}
        loop={false}
        style={{ width: 200 }}
      />
    </div>
  )
}
