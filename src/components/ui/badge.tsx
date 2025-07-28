
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        tertiary:
          "border-transparent bg-tertiary text-tertiary-foreground hover:bg-tertiary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground hover:bg-accent hover:text-accent-foreground",
        success: 
          "border-transparent bg-emerald-500/90 text-white hover:bg-emerald-500",
        warning:
          "border-transparent bg-yellow-500/90 text-white hover:bg-yellow-500",
        info:
          "border-transparent bg-blue-500/90 text-white hover:bg-blue-500",
        glass: 
          "border-transparent bg-white/10 backdrop-blur-md text-foreground hover:bg-white/20"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
