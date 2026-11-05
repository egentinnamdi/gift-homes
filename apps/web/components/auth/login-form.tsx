"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    const res = await login(email, password)
    if (res.ok) {
      setSuccess("Welcome back! Redirecting...")
      setTimeout(() => {
        router.push(res.user?.role === "admin" ? "/admin" : "/")
      }, 600)
    } else {
      setError(res.error || "Sign in failed")
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9]">
          <Building2 className="size-3.5 text-[#703BF7]" />
          Enugu Real Estate Gateway
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-[#999999]">
          Sign in to access verified listings and manage your Enugu property
          inspections.
        </p>
      </div>

      {/* Main Card Container */}
      <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 shadow-2xl sm:p-8">

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#999999]">
              Email Address
            </label>
            <div className="flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 transition-colors focus-within:border-[#703BF7]">
              <Mail className="size-4 shrink-0 text-[#666666]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. chidi.nnamani@example.com"
                className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-[#999999]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#703BF7] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 transition-colors focus-within:border-[#703BF7]">
              <Lock className="size-4 shrink-0 text-[#666666]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-0.5 text-[#666666] hover:text-[#999999]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-[#999999]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3.5 rounded border-[#262626] bg-[#141414] text-[#703BF7] focus:ring-0"
              />
              Remember my session
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/20 transition-all hover:bg-[#8254F8] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </span>
            ) : (
              <>
                Sign In to GiftHomes
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-[#999999]">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-[#703BF7]"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
