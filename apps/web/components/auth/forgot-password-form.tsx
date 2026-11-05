"use client";

import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { KeyRound, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reset link");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9] mb-4">
          <KeyRound className="size-3.5 text-[#703BF7]" />
          Account Recovery
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Reset Your Password
        </h1>
        <p className="mt-2 text-sm text-[#999999]">
          Enter your registered email and we will send you a link to choose a new password.
        </p>
      </div>

      <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 sm:p-8 shadow-2xl">
        {submitted ? (
          <div className="text-center py-4 space-y-4 animate-in fade-in">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400 border border-green-500/20">
              <CheckCircle2 className="size-6" />
            </div>
            <h2 className="font-heading text-lg font-bold text-white">
              Check Your Inbox
            </h2>
            <p className="text-xs text-[#999999] leading-relaxed">
              If an account exists for{" "}
              <span className="font-medium text-white">{email}</span>, a reset link is on its way. It expires in 1 hour. Check your spam folder if you do not see it.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white hover:bg-[#8254F8] transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">
                Registered Email Address
              </label>
              <div className="flex items-center rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 focus-within:border-[#703BF7] transition-colors">
                <Mail className="size-4 text-[#666666] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. chidi@example.com"
                  className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/20 hover:bg-[#8254F8] disabled:opacity-50 transition-all mt-4"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending Link...
                </span>
              ) : (
                <>
                  Send Reset Link
                  <Send className="size-4" />
                </>
              )}
            </button>

            <div className="pt-3 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#999999] hover:text-white transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
