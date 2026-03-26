"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  ShieldAlert,
  Package,
  Calendar,
  MapPin,
  Factory,
  Hash,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/glass-card"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type VerificationStatus = "idle" | "loading" | "valid" | "tampered" | "error"

export default function VerifyPage() {
  const [inputId, setInputId] = useState("")
  const [status, setStatus] = useState<VerificationStatus>("idle")
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const handleVerify = async () => {
    if (!inputId.trim()) return
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch(`${API}/api/verify/${inputId.trim()}`)
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || "Product not found")
        setStatus("error")
        return
      }

      setResult(data)
      setStatus(data.status) // "valid" or "tampered"
    } catch (err) {
      setErrorMsg("Could not connect to server. Is the backend running?")
      setStatus("error")
    }
  }

  const reset = () => {
    setStatus("idle")
    setResult(null)
    setInputId("")
    setErrorMsg("")
  }

  return (
    <div className="container mx-auto min-h-[calc(100vh-4rem)] px-4 py-8">
      {/* Background glow */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {status === "valid" && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-valid/20 blur-[150px] animate-pulse" />
        )}
        {status === "tampered" && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-tampered/20 blur-[150px] animate-pulse" />
        )}
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center">
        <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/scan">
            <ArrowLeft className="h-4 w-4" />
            Back to Scan
          </Link>
        </Button>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">

        {/* Search Bar — always visible */}
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-3">Enter the Product ID to verify its blockchain integrity</p>
          <div className="flex gap-3">
            <Input
              placeholder="e.g. TRZ-A8F3K2M1"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="h-12 rounded-xl border-border/50 bg-secondary/30 font-mono"
            />
            <Button
              onClick={handleVerify}
              disabled={status === "loading" || !inputId.trim()}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold"
            >
              {status === "loading" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </GlassCard>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/20 animate-ping" />
              <div className="absolute inset-0 flex items-center justify-center h-24 w-24 rounded-full bg-primary/30">
                <ShieldCheck className="h-12 w-12 text-primary" />
              </div>
            </div>
            <p className="mt-6 text-lg text-muted-foreground animate-pulse">Verifying product integrity on blockchain...</p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <GlassCard className="border-red-500/30 bg-red-500/5 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium">{errorMsg}</p>
            <Button onClick={reset} variant="outline" className="mt-4 rounded-xl">Try Again</Button>
          </GlassCard>
        )}

        {/* Valid Result */}
        {status === "valid" && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-valid/50 via-valid/30 to-valid/50 blur-xl opacity-75" />
              <GlassCard glow="valid" className="relative rounded-3xl border-valid/40 p-8 text-center">
                <div className="relative mx-auto mb-6 h-28 w-28">
                  <div className="absolute inset-0 rounded-full bg-valid/20 animate-ping" style={{ animationDuration: "2s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-valid to-valid/80 shadow-2xl shadow-valid/50">
                      <ShieldCheck className="h-12 w-12 text-valid-foreground" />
                    </div>
                  </div>
                </div>
                <h1 className="mb-3 text-4xl font-bold text-valid">Product is Authentic</h1>
                <p className="text-lg text-muted-foreground">All verification checks passed. Supply chain intact.</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {["Hash Verified", "Chain Intact", "Origin Confirmed"].map((label) => (
                    <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-valid/20 px-4 py-1.5 text-sm font-medium text-valid">
                      <CheckCircle2 className="h-4 w-4" /> {label}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Product Details */}
            <GlassCard className="border-valid/20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Package className="h-5 w-5 text-valid" /> Product Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Package, label: "Product Name", value: result.product.name },
                  { icon: MapPin, label: "Origin", value: result.product.origin },
                  { icon: Factory, label: "Manufacturer", value: result.product.manufacturer },
                  { icon: Calendar, label: "Expiry Date", value: result.product.expiryDate },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
                    <Icon className="mt-0.5 h-5 w-5 text-valid" />
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-valid/20 bg-valid/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-valid" />
                  <span className="text-sm font-medium text-valid">Verified Hash (Blockchain)</span>
                </div>
                <code className="block break-all rounded-lg bg-background/50 p-3 font-mono text-xs text-muted-foreground">
                  {result.expectedHash}
                </code>
                {result.blockchainTxHash && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    ⛓️ Tx: <span className="font-mono">{result.blockchainTxHash}</span>
                  </p>
                )}
              </div>
            </GlassCard>

            <div className="text-center">
              <Button onClick={reset} variant="outline" className="rounded-xl">Verify Another Product</Button>
            </div>
          </div>
        )}

        {/* Tampered Result */}
        {status === "tampered" && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-tampered/50 via-tampered/30 to-tampered/50 blur-xl opacity-75" />
              <GlassCard glow="tampered" className="relative rounded-3xl border-tampered/40 p-8 text-center">
                <div className="relative mx-auto mb-6 h-28 w-28">
                  <div className="absolute inset-0 rounded-full bg-tampered/20 animate-ping" style={{ animationDuration: "1.5s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-tampered to-tampered/80 shadow-2xl shadow-tampered/50">
                      <ShieldAlert className="h-12 w-12 text-tampered-foreground" />
                    </div>
                  </div>
                </div>
                <h1 className="mb-3 text-4xl font-bold text-tampered">⚠️ Product is TAMPERED</h1>
                <p className="text-lg text-muted-foreground">Hash mismatch detected. Supply chain integrity compromised.</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {["Hash Mismatch", "Chain Broken", "Do Not Consume"].map((label) => (
                    <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-tampered/20 px-4 py-1.5 text-sm font-medium text-tampered">
                      <XCircle className="h-4 w-4" /> {label}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Hash Comparison — THE MONEY SLIDE */}
            <GlassCard className="border-tampered/20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <Hash className="h-5 w-5 text-tampered" /> Hash Mismatch Details
              </h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-valid/30 bg-valid/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-valid" />
                    <span className="text-sm font-medium text-valid">Expected Hash (Original — on Blockchain)</span>
                  </div>
                  <code className="block break-all rounded-lg bg-background/50 p-3 font-mono text-xs text-muted-foreground">
                    {result.expectedHash}
                  </code>
                </div>
                <div className="rounded-xl border border-tampered/30 bg-tampered/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-tampered" />
                    <span className="text-sm font-medium text-tampered">Actual Hash (Current Data — DIFFERENT)</span>
                  </div>
                  <code className="block break-all rounded-lg bg-background/50 p-3 font-mono text-xs text-muted-foreground">
                    {result.actualHash}
                  </code>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl bg-tampered/10 py-3">
                  <AlertTriangle className="h-5 w-5 text-tampered" />
                  <span className="font-medium text-tampered">Tampering Detected — Data Has Been Modified</span>
                </div>
              </div>
            </GlassCard>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="destructive" size="lg" className="rounded-xl">
                <Link href="/report">Report This Product</Link>
              </Button>
              <Button onClick={reset} variant="outline" size="lg" className="rounded-xl">
                Verify Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
