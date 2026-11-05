"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) {
    return <>{children}</>
  }
  return (
    <div className="flex min-h-screen flex-col bg-[#141414]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
