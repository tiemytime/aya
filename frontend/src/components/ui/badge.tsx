import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-glass-border-light px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Cosmic variants
        cosmic: "border-cosmic-ethereal-purple/40 bg-glass-bg-medium/70 backdrop-blur-cosmic text-cosmic-starlight hover:bg-glass-bg-medium/90 hover:shadow-glow-purple/20",
        "cosmic-gold": "border-cosmic-stellar-gold/40 bg-gradient-to-r from-cosmic-solar-gold/20 to-cosmic-stellar-gold/20 backdrop-blur-cosmic text-cosmic-deep-space font-semibold shadow-glow-gold/50 hover:from-cosmic-solar-gold/30 hover:to-cosmic-stellar-gold/30",
        "cosmic-green": "border-cosmic-spirit-teal/40 bg-gradient-to-r from-cosmic-aurora-green/20 to-cosmic-spirit-teal/20 backdrop-blur-cosmic text-cosmic-starlight shadow-glow-blue/50 hover:from-cosmic-aurora-green/30 hover:to-cosmic-spirit-teal/30",
        "cosmic-purple": "border-cosmic-ethereal-purple/40 bg-gradient-to-r from-cosmic-spirit-purple/20 to-cosmic-ethereal-purple/20 backdrop-blur-cosmic text-cosmic-starlight shadow-glow-purple/50 hover:from-cosmic-spirit-purple/30 hover:to-cosmic-ethereal-purple/30",
        priority: "border-cosmic-plasma-pink/40 bg-gradient-to-r from-cosmic-plasma-pink/20 to-cosmic-rose/20 backdrop-blur-cosmic text-cosmic-starlight shadow-glow-plasma/50 animate-glow-pulse"
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

export { Badge }
