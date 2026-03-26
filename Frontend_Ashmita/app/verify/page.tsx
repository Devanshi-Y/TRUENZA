"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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

function VerifyPage() {
  const searchParams = useSearchParams()
  const [inputId, setInputId] = useState("")
  const [status, setStatus] = useState<VerificationStatus>("idle")
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const handleVerify = async (idOverride?: string) => {
    const id = idOverride || inputId
    if (!id.trim()) return
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch(`${API}/api/verify/${id.trim()}`)
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

  // Auto-fill and auto-verify if ?id= is in the URL (from QR scan)
  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setInputId(id)
      handleVerify(id)
    }
  }, [])

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
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-valid/20 blur-[150px] animate-pulse" />
            <div className="absolute top-1/3 left-1/3 h-[300px] w-[300px] rounded-full bg-valid/15 blur-[100px]" />
          </>
        )}
        {status === "tampered" && (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-tampered/20 blur-[150px] animate-pulse" />
            <div className="absolute top-1/3 right-1/3 h-[300px] w-[300px] rounded-full bg-tampered/15 blur-[100px]" />
          </>
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

        {/* Search bar — always visible */}
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
              onClick={() => handleVerify()}
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

        {/* Loading animation */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/20 animate-ping" />
              <div className="absolute inset-0 flex items-center justify-center h-24 w-24 rounded-full bg-primary/30 backdrop-blur-sm">
                <ShieldCheck className="h-12 w-12 text-primary" />
              </div>
            </div>
            <p className="mt-6 text-lg text-muted-foreground animate-pulse">Verifying product integrity on blockchain...</p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <GlassCard className="border-red-500/30 bg-red-500/5 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-medium">{errorMsg}</p>
            <Button onClick={reset} variant="outline" className="mt-4 rounded-xl">Try Again</Button>
          </GlassCard>
        )}

        {/* VALID state */}
        {status === "valid" && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-valid/50 via-valid/30 to-valid/50 blur-xl opacity-75" />
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-valid/40 to-valid/60 opacity-50" />

              <GlassCard glow="valid" className="relative overflow-hidden rounded-3xl border-valid/40 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-valid/10 via-transparent to-valid/5" />
                <div className="relative text-center">
                  <div className="relative mx-auto mb-6 h-28 w-28">
                    <div className="absolute inset-0 rounded-full bg-valid/20 animate-ping" style={{ animationDuration: "2s" }} />
                    <div className="absolute inset-2 rounded-full bg-valid/30 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-valid to-valid/80 shadow-2xl shadow-valid/50">
                        <ShieldCheck className="h-12 w-12 text-valid-foreground" />
                      </div>
                    </div>
                  </div>
                  <h1 className="mb-3 text-4xl font-bold text-valid drop-shadow-lg">Product is Authentic</h1>
                  <p className="text-lg text-muted-foreground">This product has passed all verification checks and is confirmed genuine.</p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {["Hash Verified", "Chain Intact", "Origin Confirmed"].map((label) => (
                      <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-valid/20 px-4 py-1.5 text-sm font-medium text-valid">
                        <CheckCircle2 className="h-4 w-4" />{label}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Product details from real API */}
            <GlassCard className="border-valid/20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Package className="h-5 w-5 text-valid" />Product Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Package, label: "Product Name", value: result.product?.name },
                  { icon: MapPin, label: "Origin", value: result.product?.origin },
                  { icon: Factory, label: "Manufacturer", value: result.product?.manufacturer },
                  { icon: Calendar, label: "Expiry Date", value: result.product?.expiryDate },
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

              {/* Real hash from blockchain */}
              <div className="mt-4 rounded-xl border border-valid/20 bg-valid/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-valid" />
                  <span className="text-sm font-medium text-valid">Verified Hash (Anchored on Blockchain)</span>
                </div>
                <code className="block break-all rounded-lg bg-background/50 p-3 font-mono text-xs text-muted-foreground">
                  {result.expectedHash}
                </code>
                {result.blockchainTxHash && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    ⛓️ Tx: <span className="font-mono break-all">{result.blockchainTxHash}</span>
                  </p>
                )}
              </div>
            </GlassCard>

            <div className="text-center">
              <Button onClick={reset} variant="outline" className="rounded-xl border-border bg-card/60 backdrop-blur-xl hover:bg-card/80">
                Verify Another Product
              </Button>
            </div>
          </div>
        )}

        {/* TAMPERED state */}
        {status === "tampered" && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-tampered/50 via-tampered/30 to-tampered/50 blur-xl opacity-75" />
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-tampered/40 to-tampered/60 opacity-50" />

              <GlassCard glow="tampered" className="relative overflow-hidden rounded-3xl border-tampered/40 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-tampered/10 via-transparent to-tampered/5" />
                <div className="relative text-center">
                  <div className="relative mx-auto mb-6 h-28 w-28">
                    <div className="absolute inset-0 rounded-full bg-tampered/20 animate-ping" style={{ animationDuration: "1.5s" }} />
                    <div className="absolute inset-2 rounded-full bg-tampered/30 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-tampered to-tampered/80 shadow-2xl shadow-tampered/50">
                        <ShieldAlert className="h-12 w-12 text-tampered-foreground" />
                      </div>
                    </div>
                  </div>
                  <h1 className="mb-3 text-4xl font-bold text-tampered drop-shadow-lg">⚠️ Product is TAMPERED</h1>
                  <p className="text-lg text-muted-foreground">Warning: Supply chain integrity compromised. Hash mismatch detected.</p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    {[
                      { label: "Hash Mismatch", icon: XCircle },
                      { label: "Chain Broken", icon: XCircle },
                      { label: "Do Not Consume", icon: AlertTriangle },
                    ].map(({ label, icon: Icon }) => (
                      <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-tampered/20 px-4 py-1.5 text-sm font-medium text-tampered">
                        <Icon className="h-4 w-4" />{label}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Security warning */}
            <GlassCard className="border-tampered/30 bg-tampered/5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tampered/20">
                  <AlertTriangle className="h-6 w-6 text-tampered" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-tampered">Security Warning</h3>
                  <p className="mt-1 text-muted-foreground">
                    The cryptographic hash of this product does not match the value anchored on blockchain.
                    This indicates tampering, counterfeiting, or data corruption in the supply chain.
                    Do not consume this product and report it immediately.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* REAL hash comparison — the money slide */}
            <GlassCard className="border-tampered/20">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Hash className="h-5 w-5 text-tampered" />Hash Mismatch Details
              </h2>
              <div className="space-y-4">
                <div className="rounded-xl border border-valid/30 bg-valid/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-valid" />
                    <span className="text-sm font-medium text-valid">Expected Hash (Original — Locked on Blockchain)</span>
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

            {/* Claimed product details */}
            <GlassCard className="border-tampered/20 opacity-75">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                <Package className="h-5 w-5 text-muted-foreground" />
                Claimed Product Details
                <span className="ml-2 rounded-full bg-tampered/20 px-2 py-0.5 text-xs font-medium text-tampered">Unverified</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Package, label: "Product Name", value: result.product?.name },
                  { icon: MapPin, label: "Claimed Origin", value: result.product?.origin },
                  { icon: Factory, label: "Claimed Manufacturer", value: result.product?.manufacturer },
                  { icon: Calendar, label: "Claimed Expiry", value: result.product?.expiryDate },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-4">
                    <Icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="destructive"
                size="lg"
                asChild
                className="rounded-xl bg-gradient-to-r from-tampered to-tampered/80 shadow-lg shadow-tampered/30 hover:shadow-xl hover:shadow-tampered/40"
              >
                <Link href="/report">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report This Product
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={reset}
                className="rounded-xl border-border bg-card/60 backdrop-blur-xl hover:bg-card/80"
              >
                Verify Another Product
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Suspense wrapper required by Next.js for useSearchParams
export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <VerifyPage />
    </Suspense>
  )
}