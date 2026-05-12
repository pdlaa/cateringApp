import type { Metadata } from "next"
import { Inter, Playfair_Display, Geist } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { SmoothScroll } from "@/components/layout/smooth-scroll"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import RootLayoutClient from "@/components/layout/root-layout-client"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Catering App - Premium Culinary Experience",
  description: "Pesan catering premium untuk momen spesial Anda",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={cn(inter.variable, playfair.variable, "font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-cream-100 dark:bg-charcoal-900">
        <SmoothScroll>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </SmoothScroll>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}