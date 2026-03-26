"use client"

import { useState } from "react"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Send, CheckCircle2, FileWarning } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function ReportPage() {
  const [productId, setProductId] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [reportId, setReportId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId.trim() || !description.trim()) return

    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch(`${API}/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, description }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Submission failed")

      setReportId(data.reportId)
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewReport = () => {
    setProductId("")
    setDescription("")
    setIsSubmitted(false)
    setReportId("")
    setError("")
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
          <FileWarning className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Report Product</h1>
        <p className="mt-2 text-muted-foreground">Report suspicious or counterfeit products</p>
      </div>

      {!isSubmitted ? (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="productId" className="text-sm font-medium text-foreground">
                Product ID
              </label>
              <Input
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="e.g. TRZ-A8F3K2M1"
                className="h-12 rounded-xl border-border bg-secondary/50 font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue with this product..."
                rows={5}
                className="rounded-xl border-border bg-secondary/50 px-4 py-3 resize-none"
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting || !productId.trim() || !description.trim()}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Submit Report
                </span>
              )}
            </Button>
          </form>
        </GlassCard>
      ) : (
        <GlassCard className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-valid/10 to-transparent" />
          <div className="relative space-y-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-valid/20 shadow-lg shadow-valid/30">
              <CheckCircle2 className="h-10 w-10 text-valid" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-valid mb-2">Report Submitted</h2>
              <p className="text-muted-foreground">Report logged permanently. Thank you for helping protect the supply chain.</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Report Reference ID</p>
              <p className="text-lg font-mono font-semibold text-foreground">{reportId}</p>
            </div>
            <Button onClick={handleNewReport} variant="outline" className="rounded-xl">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Submit Another Report
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
