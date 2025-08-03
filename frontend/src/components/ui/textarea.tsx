import * as React from "react"

import { cn } from "@/utils/cn"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-cosmic-ethereal-purple/30 bg-glass-bg-medium/50 backdrop-blur-cosmic px-3 py-2 text-sm text-cosmic-starlight placeholder:text-cosmic-silver-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-ethereal-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-void focus-visible:border-cosmic-ethereal-purple disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-300 hover:border-cosmic-ethereal-purple/50 hover:bg-glass-bg-medium/70 hover:shadow-glow-purple/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
