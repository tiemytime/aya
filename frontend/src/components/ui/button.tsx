import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Cosmic variants with glassmorphism and glowing effects
        cosmic: "bg-glass-bg-medium backdrop-blur-cosmic border border-glass-border-light text-cosmic-starlight hover:bg-glass-bg-light hover:shadow-glow-gold transform hover:scale-[1.02] active:scale-95 transition-all duration-300",
        "cosmic-primary": "bg-gradient-to-r from-cosmic-celestial-blue to-cosmic-ethereal-purple backdrop-blur-cosmic border border-glass-border-medium text-cosmic-starlight shadow-glow-blue hover:shadow-glow-ethereal hover:from-cosmic-ethereal-purple hover:to-cosmic-celestial-blue transform hover:scale-[1.02] active:scale-95 transition-all duration-300",
        "cosmic-gold": "bg-gradient-to-r from-cosmic-solar-gold/20 via-cosmic-stellar-gold/30 to-cosmic-divine-gold/20 backdrop-blur-cosmic border border-cosmic-stellar-gold/40 text-cosmic-deep-space font-semibold shadow-glow-gold hover:shadow-glow-intense hover:from-cosmic-solar-gold/30 hover:via-cosmic-stellar-gold/40 hover:to-cosmic-divine-gold/30 transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:from-cosmic-silver-mist/20 disabled:to-cosmic-moonlight/20 disabled:text-cosmic-silver-mist disabled:shadow-none disabled:border-cosmic-silver-mist/20",
        "cosmic-ethereal": "bg-gradient-to-r from-cosmic-spirit-purple/20 via-cosmic-ethereal-purple/30 to-cosmic-dream-purple/20 backdrop-blur-cosmic border border-cosmic-ethereal-purple/40 text-cosmic-starlight shadow-glow-purple hover:shadow-glow-ethereal hover:from-cosmic-spirit-purple/30 hover:via-cosmic-ethereal-purple/40 hover:to-cosmic-dream-purple/30 transform hover:scale-[1.02] active:scale-95 transition-all duration-300",
        "cosmic-green": "bg-gradient-to-r from-cosmic-aurora-green/20 via-cosmic-spirit-teal/30 to-cosmic-ethereal-cyan/20 backdrop-blur-cosmic border border-cosmic-spirit-teal/40 text-cosmic-starlight shadow-glow-blue hover:shadow-glow-ethereal hover:from-cosmic-aurora-green/30 hover:via-cosmic-spirit-teal/40 hover:to-cosmic-ethereal-cyan/30 transform hover:scale-[1.02] active:scale-95 transition-all duration-300",
        "cosmic-outline": "border border-cosmic-ethereal-purple/50 bg-cosmic-void/20 backdrop-blur-cosmic text-cosmic-starlight hover:bg-cosmic-ethereal-purple/10 hover:border-cosmic-ethereal-purple hover:shadow-glow-purple",
        "cosmic-ghost": "text-cosmic-starlight hover:bg-cosmic-ethereal-purple/10 hover:text-cosmic-violet-mist transition-colors duration-300"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
