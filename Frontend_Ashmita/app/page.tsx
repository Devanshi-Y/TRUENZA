import Link from "next/link"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Package, ScanLine, FileBarChart, ShieldCheck, TrendingUp, Clock } from "lucide-react"

const stats = [
  { label: "Products Registered", value: "12,847", icon: Package, trend: "+12%" },
  { label: "Verified Today", value: "1,284", icon: ShieldCheck, trend: "+8%" },
  { label: "Supply Chain Score", value: "98.7%", icon: TrendingUp, trend: "+2.3%" },
  { label: "Avg. Response Time", value: "1.2s", icon: Clock, trend: "-0.3s" },
]

const quickActions = [
  {
    title: "Register Product",
    description: "Add a new product to the supply chain tracking system",
    href: "/register",
    icon: Package,
    color: "from-primary to-accent",
  },
  {
    title: "Scan Product",
    description: "Verify product authenticity and view supply chain history",
    href: "/scan",
    icon: ScanLine,
    color: "from-accent to-primary",
  },
  {
    title: "View Reports",
    description: "Access analytics and supply chain integrity reports",
    href: "/reports",
    icon: FileBarChart,
    color: "from-primary/80 to-accent/80",
  },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="mb-8 relative">
          {/* Glow effect behind heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-96 bg-primary/30 blur-[100px] -z-10" />
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-balance">Trust Your Food with</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
              Truenza
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            Ensuring food supply chain integrity through advanced verification, tracking, and 
            transparency. Every product, every step, fully verified.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/40 transition-all hover:shadow-xl hover:shadow-primary/50 hover:scale-105">
            <Link href="/scan">
              <ScanLine className="mr-2 h-5 w-5" />
              Scan Product
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl border-border bg-card/60 backdrop-blur-xl hover:bg-card/80 hover:border-primary/50 transition-all">
            <Link href="/register">
              <Package className="mr-2 h-5 w-5" />
              Register Product
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <GlassCard key={stat.label} className="text-center group hover:-translate-y-1">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="mb-1 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-xs font-semibold text-valid">{stat.trend}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href} className="group">
                <GlassCard className="h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </GlassCard>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
