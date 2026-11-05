import type { Metadata } from "next"
import { Urbanist, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { SiteShell } from "@/components/layout/site-shell"
import { cn } from "@/lib/utils"

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "GiftHomes - Enugu Real Estate Listing Platform",
  description:
    "Discover verified residential, luxury, and commercial properties for rent and sale in Enugu, Nigeria. Explore duplexes in GRA, executive apartments in Independence Layout, and golf view terraces.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark antialiased", urbanist.variable, inter.variable)}
    >
      <body className="min-h-screen bg-[#141414] font-sans text-white selection:bg-[#703BF7]/30 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <SiteShell>{children}</SiteShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
