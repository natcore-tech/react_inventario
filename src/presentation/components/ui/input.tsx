import * as React from "react"

import { cn } from "@/presentation/utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base layout
        "h-9 w-full min-w-0 rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm",
        "outline-none transition-all duration-200",
        // placeholder
        "placeholder:text-muted-foreground/55",
        // focus: neon purple glow matching design system
        "focus-visible:border-primary/70 focus-visible:bg-muted/50",
        "focus-visible:ring-2 focus-visible:ring-primary/20",
        "focus-visible:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_0_16px_hsl(var(--primary)/0.12)]",
        // hover
        "hover:border-primary/35 hover:bg-muted/40",
        // invalid
        "aria-invalid:border-destructive/70 aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // file input
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // dark bg tweak
        "dark:bg-input/25 dark:hover:bg-input/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
