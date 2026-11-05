"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { KeyRound, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"

const inputWrap =
  "flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 transition-colors focus-within:border-[#703BF7]"

export function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) return setError("Password must be at least 8 characters")
    if (password !== confirm) return setError("Passwords do not match")
    setBusy(true)
    try {
      await api.resetPassword(token, password)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset your password")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9]">
          <KeyRound className="size-3.5 text-[#703BF7]" />
          Account Recovery
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Choose a New Password</h1>
      </div>

      <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 shadow-2xl sm:p-8">
        {done ? (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-green-500/20 bg-green-500/10 text-green-400">
              <CheckCircle2 className="size-6" />
            </div>
            <h2 className="font-heading text-lg font-bold text-white">Password updated</h2>
            <p className="text-xs text-[#999999]">You can now sign in with your new password.</p>
            <Link href="/login" className="inline-flex w-full items-center justify-center rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white hover:bg-[#8254F8]">
              Go to Sign In
            </Link>
          </div>
        ) : !token ? (
          <div className="space-y-4 py-4 text-center">
            <AlertCircle className="mx-auto size-8 text-red-400" />
            <p className="text-sm text-[#999999]">This reset link is missing or incomplete.</p>
            <Link href="/forgot-password" className="inline-flex w-full items-center justify-center rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white hover:bg-[#8254F8]">
              Request a new link
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  {error}{" "}
                  {/invalid|expired/i.test(error) && (
                    <Link href="/forgot-password" className="underline">
                      Request a new link
                    </Link>
                  )}
                </span>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#999999]">New password</label>
              <div className={inputWrap}>
                <Lock className="size-4 shrink-0 text-[#666666]" />
                <input type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#999999]">Confirm new password</label>
              <div className={inputWrap}>
                <Lock className="size-4 shrink-0 text-[#666666]" />
                <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none" />
              </div>
            </div>
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/20 transition-all hover:bg-[#8254F8] disabled:opacity-50">
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
