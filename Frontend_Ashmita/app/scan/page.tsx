"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScanLine, Camera, Scan, Hash, ShieldCheck } from "lucide-react"

export default function ScanPage() {
  const router = useRouter()
  const [manualId, setManualId] = useState("")

  const handleManualVerify = () => {
    if (!manualId.trim()) return
    router.push(`/verify?id=${manualId.trim()}`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/40">
            <ScanLine className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Scan Product</h1>
          <p className="text-muted-foreground">
            Point your camera at the QR code or enter the Product ID manually
          </p>
        </div>

        {/* Scanner Card */}
        <GlassCard className="w-full max-w-md relative overflow-hidden">
          <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-primary/20 blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-accent/20 blur-[80px]" />

          <div className="relative">
            {/* Scanner Box */}
            <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl">
              <div className="absolute inset-0 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30" />
                <div className="absolute inset-[2px] rounded-2xl bg-background/90" />
              </div>

              <div className="absolute inset-[3px] rounded-xl bg-gradient-to-br from-secondary/80 to-muted/50 backdrop-blur-sm">
                {/* Corner markers */}
                <div className="absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                <div className="absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-primary rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

                <div className="flex h-full flex-col items-center justify-center px-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-8 w-8 text-primary/70" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Camera Preview</p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    Position QR code within the frame
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">1</div>
                <span>Locate the QR code on the product packaging</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">2</div>
                <span>Align the code within the scanner frame</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">3</div>
                <span>Hold steady for automatic verification</span>
              </div>
            </div>

            {/* Camera Scan Button (UI only on desktop) */}
            <Button
              disabled
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/40 opacity-50 cursor-not-allowed"
              size="lg"
            >
              <Scan className="mr-2 h-5 w-5" />
              Start Scanning (Mobile Only)
            </Button>

            {/* ── Divider ── */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">or enter manually</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            {/* ── Manual Product ID Input ── */}
            <div className="space-y-3">
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                  placeholder="e.g. TRZ-B2514EK9"
                  className="pl-9 rounded-xl bg-background/50 border-border/60 font-mono tracking-wider text-foreground placeholder:text-muted-foreground/50 focus:border-primary"
                />
              </div>
              <Button
                onClick={handleManualVerify}
                disabled={!manualId.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/40 hover:shadow-xl hover:scale-[1.02] transition-all"
                size="lg"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Verify Product ID
              </Button>
            </div>
          </div>
        </GlassCard>

        <p className="mt-6 max-w-md text-center text-xs text-muted-foreground">
          Truenza uses advanced verification to ensure your products are authentic and safely sourced through the entire supply chain.
        </p>
      </div>
    </div>
  )
}