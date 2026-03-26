"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Package, MapPin, Calendar, CheckCircle2, Hash, Copy, Check, Sparkles, Factory, QrCode } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatedHash, setGeneratedHash] = useState("")
  const [productId, setProductId] = useState("")
  const [blockchainTxHash, setBlockchainTxHash] = useState("")
  const [qrCode, setQrCode] = useState("")         // ← new
  const [verifyUrl, setVerifyUrl] = useState("")   // ← new
  const [formData, setFormData] = useState({
    productName: "",
    expiryDate: "",
    origin: "",
    manufacturer: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Registration failed")

      setGeneratedHash(data.hash)
      setProductId(data.productId)
      setBlockchainTxHash(data.blockchainTxHash)
      setQrCode(data.qrCode)         // ← new
      setVerifyUrl(data.verifyUrl)   // ← new
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyHash = () => {
    navigator.clipboard.writeText(generatedHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegisterAnother = () => {
    setSubmitted(false)
    setGeneratedHash("")
    setProductId("")
    setBlockchainTxHash("")
    setQrCode("")
    setVerifyUrl("")
    setFormData({ productName: "", expiryDate: "", origin: "", manufacturer: "" })
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-valid/30 blur-[100px]" />
          </div>

          <GlassCard glow="valid" className="text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-valid/5 via-transparent to-primary/5" />

            <div className="relative">
              <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-valid/20 to-valid/10 shadow-lg shadow-valid/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-valid/20">
                  <CheckCircle2 className="h-10 w-10 text-valid" />
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-foreground">Product Registered Successfully</h2>
              <p className="text-muted-foreground mb-6">
                Your product has been hashed and anchored on blockchain.
              </p>

              {/* Product ID */}
              <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 p-4">
                <p className="text-xs text-muted-foreground mb-1">Product ID (use this to verify)</p>
                <p className="text-2xl font-mono font-bold text-primary">{productId}</p>
              </div>

              {/* QR Code — scan to verify */}
              {qrCode && (
                <div className="mb-6 rounded-xl border border-border/50 bg-secondary/30 p-5">
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <QrCode className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground text-sm">Scan to Verify</span>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={qrCode}
                      alt="Product QR Code"
                      className="h-48 w-48 rounded-lg border border-border/50"
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Consumer scans this → instantly sees if product is authentic or tampered
                  </p>
                </div>
              )}

              {/* Product Summary */}
              <div className="mb-6 rounded-xl border border-border/50 bg-secondary/30 p-4 text-left">
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product Name</span>
                    <span className="font-medium text-foreground">{formData.productName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date</span>
                    <span className="font-medium text-foreground">{formData.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Origin</span>
                    <span className="font-medium text-foreground">{formData.origin}</span>
                  </div>
                </div>
              </div>

              {/* Hash Card */}
              <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-5">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">SHA-256 Hash (Anchored on Blockchain)</span>
                </div>
                <div className="relative group">
                  <div className="rounded-lg border border-border/50 bg-background/50 p-3 font-mono text-xs break-all text-muted-foreground">
                    {generatedHash}
                  </div>
                  <button
                    onClick={copyHash}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/20 text-primary opacity-0 transition-opacity group-hover:opacity-100 hover:bg-primary/30"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                {copied && <p className="mt-2 text-xs text-valid font-medium">Hash copied to clipboard</p>}

                {blockchainTxHash && !blockchainTxHash.startsWith("simulated") && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Polygon Tx: </span>
                    <span className="font-mono break-all">{blockchainTxHash}</span>
                  </div>
                )}
                {blockchainTxHash?.startsWith("simulated") && (
                  <p className="mt-2 text-xs text-muted-foreground">⛓️ Anchored on Polygon Testnet (simulated for demo)</p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleRegisterAnother}
                  className="rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Register Another Product
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-48 bg-primary/20 blur-[80px] -z-10" />
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/40">
          <Package className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Register Product</h1>
        <p className="text-muted-foreground">Add a new product to the Truenza supply chain</p>
      </div>

      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        <form onSubmit={handleSubmit} className="relative">
          <FieldGroup>
            <Field>
              <FieldLabel className="text-foreground font-medium">Product Name</FieldLabel>
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter product name"
                  className="h-12 pl-12 rounded-xl border-border/50 bg-secondary/30"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel className="text-foreground font-medium">Expiry Date</FieldLabel>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  className="h-12 pl-12 rounded-xl border-border/50 bg-secondary/30"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel className="text-foreground font-medium">Origin</FieldLabel>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="City, Country"
                  className="h-12 pl-12 rounded-xl border-border/50 bg-secondary/30"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  required
                />
              </div>
            </Field>

            <Field>
              <FieldLabel className="text-foreground font-medium">Manufacturer (optional)</FieldLabel>
              <div className="relative group">
                <Factory className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Company name"
                  className="h-12 pl-12 rounded-xl border-border/50 bg-secondary/30"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>
            </Field>
          </FieldGroup>

          {error && (
            <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
          )}

          <div className="mt-8">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-base shadow-lg shadow-primary/40 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Registering on Blockchain...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Register Product
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}