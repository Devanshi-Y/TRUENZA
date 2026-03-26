import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Truenza - Food Supply Chain Integrity',
  description: 'Trust Your Food with Truenza - Ensuring supply chain integrity through verification',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a1628',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background">
          {/* Gradient mesh background */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Primary blue glow - top right */}
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/30 blur-[100px]" />
            {/* Accent cyan glow - left center */}
            <div className="absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-accent/25 blur-[120px]" />
            {/* Secondary glow - bottom */}
            <div className="absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-primary/20 blur-[80px]" />
            {/* Subtle grid pattern overlay */}
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>
          <Navbar />
          <main className="relative">
            {children}
          </main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
