import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/* ============================================================
   VSLText — typography primitive
   Variants: heading | subheading | body | muted | label | caption | mono
   ============================================================ */

const vslTextVariants = cva("", {
  variants: {
    variant: {
      heading: "text-xl font-bold tracking-tight text-foreground",
      subheading: "text-base font-semibold text-foreground",
      body: "text-sm font-medium text-foreground",
      muted: "text-sm font-medium text-muted-foreground",
      label: "text-xs font-semibold uppercase tracking-wider text-foreground",
      caption: "text-xs font-medium text-muted-foreground",
      mono: "text-xs font-mono text-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

type VSLTextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof vslTextVariants> & {
    as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "div" | "label"
  }

function VSLText({ variant, className, as: Tag = "p", ...props }: VSLTextProps) {
  return (
    <Tag
      data-slot="vsl-text"
      data-variant={variant}
      className={cn(vslTextVariants({ variant }), className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    />
  )
}

/* ============================================================
   VSLButton — button primitive with loading state
   Inherits all variants/sizes from button.tsx
   Extra prop: loading — shows spinner, disables interaction
   ============================================================ */

type VSLButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function VSLButton({
  loading,
  disabled,
  children,
  className,
  variant,
  size,
  asChild = false,
  ...props
}: VSLButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="vsl-button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size }), "relative", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      )}
      <span className={cn("contents", loading && "invisible")}>{children}</span>
    </Comp>
  )
}

/* ============================================================
   NgtNumber — numeric display in Geist Sans, tabular figures
   Variants: xs | sm | md | lg | xl (default)
   Use for all numeric values: stats, counts, chart totals
   ============================================================ */

const ngtNumberVariants = cva("font-sans font-bold tabular-nums tracking-tight", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
      xl: "text-2xl",
    },
  },
  defaultVariants: {
    size: "xl",
  },
})

type NgtNumberProps = React.ComponentProps<"span"> &
  VariantProps<typeof ngtNumberVariants> & {
    value: number | string
  }

function NgtNumber({ value, size, className, ...props }: NgtNumberProps) {
  return (
    <span
      data-slot="ngt-number"
      className={cn(ngtNumberVariants({ size }), className)}
      {...props}
    >
      {value}
    </span>
  )
}

export { VSLText, vslTextVariants, VSLButton, NgtNumber, ngtNumberVariants }
