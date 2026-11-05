"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { UserMenu } from "@/components/auth/user-menu"
import { Building2, Menu, X, ArrowRight, LogIn } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-[#1A1A1A]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#703BF7] text-white shadow-lg shadow-[#703BF7]/25 transition-colors group-hover:bg-[#8254F8]">
            <Building2 className="size-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            GiftHomes
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 rounded-2xl border border-[#262626] bg-[#141414] p-1.5 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border border-[#262626] bg-[#1A1A1A] text-white shadow-sm"
                    : "text-[#999999] hover:bg-[#1A1A1A]/50 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Auth Actions / User Menu */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl border border-[#262626] bg-[#141414] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:border-[#333333] hover:bg-[#1F1F1F]"
              >
                <LogIn className="size-3.5 text-[#703BF7]" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-xl bg-[#703BF7] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#703BF7]/20 transition-all hover:bg-[#8254F8]"
              >
                Sign Up
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <UserMenu />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-[#262626] bg-[#141414] p-2 text-[#999999] transition-colors hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="animate-in border-b border-[#262626] bg-[#141414] px-4 py-6 duration-150 slide-in-from-top-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border border-[#262626] bg-[#1A1A1A] text-white"
                      : "text-[#999999] hover:bg-[#1A1A1A] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {!user && (
              <div className="mt-4 flex flex-col gap-2 border-t border-[#262626] pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#1A1A1A] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#202020]"
                >
                  <LogIn className="size-4 text-[#703BF7]" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8254F8]"
                >
                  Sign Up
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
