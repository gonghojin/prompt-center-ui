import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white transition-all duration-300",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        
        // 기능별 계층구조 variant 추가
        // Primary Actions (주요 액션) - 핵심 기능
        primary: 
          "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg hover:from-purple-700 hover:to-cyan-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300",
        
        // Secondary Actions (보조 액션) - 보조 기능  
        "secondary-action":
          "bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 text-white hover:from-purple-600/30 hover:to-cyan-600/30 hover:border-purple-400/50 backdrop-blur-sm transition-all duration-300",
        
        // Tertiary Actions (정보성 액션) - 탐색/정보
        "tertiary":
          "border border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300",
        
        // Success Actions (성공 액션)
        "success":
          "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg transition-all duration-300",
        
        // Warning Actions (경고 액션)  
        "warning":
          "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg transition-all duration-300",
        
        // Danger Actions (위험 액션)
        "danger":
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg transition-all duration-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
