"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { inputCls } from "@/components/admin/admin-shell"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, logout } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const res = await login(email.trim(), password)
    setBusy(false)
    if (!res.ok) return setError(res.error || "Sign in failed")
    if (res.user?.role !== "admin") {
      logout()
      return setError("This account does not have administrator access.")
    }
    router.replace("/admin")
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#703BF7] text-white shadow-lg shadow-[#703BF7]/25">
            <Building2 className="size-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Admin sign in</h1>
          <p className="mt-1 text-sm text-[#999999]">Manage listings, inspections and messages.</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 shadow-2xl sm:p-8">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="size-4 shrink-0" /> {error}
            </div>
          )}
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#999999]">Email</span>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#666666]" />
              <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} pl-9`} placeholder="admin@gifthomes.ng" />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[#999999]">Password</span>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#666666]" />
              <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pl-9`} placeholder="••••••••" />
            </div>
          </label>
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/25 transition-all hover:bg-[#8254F8] disabled:opacity-50">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#666666]">
          <Link href="/" className="hover:text-white">← Back to website</Link>
        </p>
      </div>
    </div>
  )
}
