"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { UserRole } from "@/types/auth"
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const { register, isLoading } = useAuth()

  const [role, setRole] = useState<UserRole>("buyer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Compute simple password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-transparent" }
    if (pass.length < 6) return { score: 1, label: "Weak", color: "bg-red-500" }
    if (pass.length < 9)
      return { score: 2, label: "Medium", color: "bg-yellow-500" }
    return { score: 3, label: "Strong", color: "bg-green-500" }
  }

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name.trim()) {
      setError("Please provide your full name")
      return
    }

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreeTerms) {
      setError("Please accept the terms and conditions to continue")
      return
    }

    const res = await register({
      name,
      email,
      password,
      phone: phone ? `+234 ${phone.replace(/^0/, "")}` : undefined,
      role,
    })

    if (!res.ok) {
      setError(res.error || "Registration failed")
      return
    }
    {
      setSuccess("Account successfully created! Redirecting to home page...")
      setTimeout(() => {
        router.push("/")
      }, 900)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9]">
          <UserPlus className="size-3.5 text-[#703BF7]" />
          Join GiftHomes Enugu
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm text-[#999999]">
          Connect with trusted landlords, verified duplexes, and diaspora
          property consultants across Enugu.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 shadow-2xl sm:p-8">
        {/* Role Selector */}
        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold text-[#999999]">
            I am joining GiftHomes as:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`rounded-xl border p-3 text-left transition-all ${
                role === "buyer"
                  ? "border-[#703BF7] bg-[#703BF7]/10 text-white"
                  : "border-[#262626] bg-[#141414] text-[#999999] hover:border-[#333333] hover:text-white"
              }`}
            >
              <p className="text-xs leading-tight font-bold">
                Home Seeker / Renter
              </p>
              <p className="mt-0.5 text-[11px] text-[#999999]">
                Looking to rent or buy in Enugu
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("diaspora")}
              className={`rounded-xl border p-3 text-left transition-all ${
                role === "diaspora"
                  ? "border-[#703BF7] bg-[#703BF7]/10 text-white"
                  : "border-[#262626] bg-[#141414] text-[#999999] hover:border-[#333333] hover:text-white"
              }`}
            >
              <p className="text-xs leading-tight font-bold">
                Diaspora Investor
              </p>
              <p className="mt-0.5 text-[11px] text-[#999999]">
                Living abroad, investing in Enugu
              </p>
            </button>
          </div>
        </div>

        {/* Error / Success Alerts */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#999999]">
              Full Name
            </label>
            <div className="flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 transition-colors focus-within:border-[#703BF7]">
              <User className="size-4 shrink-0 text-[#666666]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Somtochukwu Eze"
                className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                required
              />
            </div>
          </div>

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
                placeholder="e.g. somto@example.com"
                className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#999999]">
              Phone Number (Optional / Nigerian Mobile)
            </label>
            <div className="flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 transition-colors focus-within:border-[#703BF7]">
              <span className="mr-1 border-r border-[#262626] pr-2 font-mono text-xs text-[#999999]">
                +234
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0803 123 4567"
                className="w-full bg-transparent pl-2 text-sm text-white placeholder-[#666666] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#999999]">
                Password
              </label>
              <div className="flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 transition-colors focus-within:border-[#703BF7]">
                <Lock className="size-4 shrink-0 text-[#666666]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent pl-2 text-sm text-white placeholder-[#666666] outline-none"
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

            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#999999]">
                Confirm Password
              </label>
              <div className="flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 transition-colors focus-within:border-[#703BF7]">
                <Lock className="size-4 shrink-0 text-[#666666]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent pl-2 text-sm text-white placeholder-[#666666] outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[#999999]">
                <span>Strength:</span>
                <span className="font-medium text-white">{strength.label}</span>
              </div>
              <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-[#262626]">
                <div
                  className={`h-full flex-1 rounded-full ${
                    strength.score >= 1 ? strength.color : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 rounded-full ${
                    strength.score >= 2 ? strength.color : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 rounded-full ${
                    strength.score >= 3 ? strength.color : "bg-transparent"
                  }`}
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="flex cursor-pointer items-start gap-2.5 text-xs text-[#999999]">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 size-4 rounded border-[#262626] bg-[#141414] text-[#703BF7] focus:ring-0"
              />
              <span>
                I agree to the{" "}
                <span className="text-white underline">Terms of Service</span>{" "}
                and <span className="text-white underline">Privacy Policy</span>{" "}
                of GiftHomes Enugu.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/20 transition-all hover:bg-[#8254F8] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating Account...
              </span>
            ) : (
              <>
                Create GiftHomes Account
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#999999]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-[#703BF7]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
