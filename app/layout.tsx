import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "ChromaGen — AI Color Palettes with Accessibility",
  description:
    "Generate designer-ready, accessible color palettes from text or images. Includes WCAG audits and color-blindness previews.",
  generator: "ChromaGen",
  openGraph: {
    title: "ChromaGen — AI-Powered Generative Palettes for Designers",
    description:
      "Generate creative color palettes from text or images — with built-in WCAG accessibility auditing and color-blindness previews.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
