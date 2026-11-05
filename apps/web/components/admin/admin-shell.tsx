"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Building2,
  LayoutDashboard,
  Home,
  CalendarCheck,
  Mail,
  Users,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Home },
  { label: "Inspections", href: "/admin/enquiries", icon: CalendarCheck },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Users", href: "/admin/users", icon: Users },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const isLogin = pathname === "/admin/login"

  useEffect(() => {
    if (!isLoading && !user && !isLogin) router.replace("/admin/login")
    if (!isLoading && user?.role === "admin" && isLogin) router.replace("/admin")
  }, [isLoading, user, isLogin, router])

  if (isLogin) {
    return <div className="min-h-screen bg-[#141414]">{children}</div>
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141414] text-sm text-[#999999]">
        Checking your session…
      </div>
    )
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141414] px-4">
        <div className="max-w-sm rounded-2xl border border-[#262626] bg-[#1A1A1A] p-8 text-center">
          <ShieldAlert className="mx-auto size-10 text-red-400" />
          <h1 className="mt-4 font-heading text-xl font-bold text-white">Admin access only</h1>
          <p className="mt-2 text-sm text-[#999999]">
            You are signed in as {user.email}, which doesn&apos;t have administrator permissions.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href="/" className="rounded-xl border border-[#262626] px-4 py-2.5 text-xs font-semibold text-white hover:border-[#703BF7]">
              Back to site
            </Link>
            <button
              onClick={() => {
                logout()
                router.replace("/admin/login")
              }}
              className="rounded-xl bg-[#703BF7] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8254F8]"
            >
              Switch account
            </button>
          </div>
        </div>
      </div>
    )
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-[#703BF7] text-white shadow-lg shadow-[#703BF7]/25">
          <Building2 className="size-5" />
        </div>
        <div>
          <p className="font-heading text-base leading-tight font-bold text-white">GiftHomes</p>
          <p className="text-[10px] font-semibold tracking-wider text-[#946CF9] uppercase">Admin</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border border-[#262626] bg-[#1A1A1A] text-white"
                  : "text-[#999999] hover:bg-[#1A1A1A]/60 hover:text-white"
              }`}
            >
              <item.icon className={`size-4 ${active ? "text-[#703BF7]" : ""}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#262626] p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#999999] hover:bg-[#1A1A1A]/60 hover:text-white">
          <ExternalLink className="size-4" /> View website
        </Link>
        <div className="mt-2 rounded-xl bg-[#1A1A1A] p-3">
          <p className="truncate text-xs font-semibold text-white">{user.name}</p>
          <p className="truncate text-[11px] text-[#999999]">{user.email}</p>
          <button
            onClick={() => {
              logout()
              router.replace("/admin/login")
            }}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#141414]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#262626] bg-[#141414] lg:block">{sidebar}</aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#262626] bg-[#1A1A1A]/95 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-heading text-base font-bold text-white">GiftHomes Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg border border-[#262626] p-2 text-[#999999]">
          <Menu className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-[#262626] bg-[#141414]">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-3 rounded-lg p-1.5 text-[#999999]">
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-[#999999]">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function useAdminData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [tick, setTick] = useState(0)
  const loaderRef = React.useRef(loader)

  useEffect(() => {
    let cancelled = false
    loaderRef
      .current()
      .then((d) => {
        if (cancelled) return
        setData(d)
        setError(null)
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [tick])

  const reload = React.useCallback(async () => setTick((t) => t + 1), [])

  return { data, setData, error, loading, reload }
}

export function StateMessage({ loading, error, empty }: { loading: boolean; error: string | null; empty?: string }) {
  if (loading) return <p className="py-16 text-center text-sm text-[#999999]">Loading…</p>
  if (error) return <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-400">{error}</p>
  if (empty) return <p className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-12 text-center text-sm text-[#999999]">{empty}</p>
  return null
}

export const inputCls =
  "w-full rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#703BF7]"

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
