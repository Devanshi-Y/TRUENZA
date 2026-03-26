import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: "none" | "primary" | "valid" | "tampered"
}

export function GlassCard({ children, className, glow = "none" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl transition-all duration-300",
        // Subtle gradient border effect
        "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-br before:from-primary/10 before:to-accent/10 before:opacity-0 before:transition-opacity hover:before:opacity-100",
        glow === "primary" && "border-primary/40 shadow-primary/30 shadow-lg",
        glow === "valid" && "border-valid/50 shadow-valid/40 shadow-lg ring-1 ring-valid/30",
        glow === "tampered" && "border-tampered/50 shadow-tampered/40 shadow-lg ring-1 ring-tampered/30",
        className
      )}
    >
      {children}
    </div>
  )
}
