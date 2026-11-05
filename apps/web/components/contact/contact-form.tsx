"use client";

import { api } from "@/lib/api";
import type { ContactMessageDTO } from "@gift-homes/shared";
import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare, ShieldCheck, RefreshCw } from "lucide-react";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  agreeTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  category?: string;
  message?: string;
  agreeTerms?: string;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "general",
    message: "",
    agreeTerms: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (name: keyof FormValues, raw: string | boolean): string | undefined => {
    const value = typeof raw === "string" ? raw : "";
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "Must be at least 2 characters";
        return undefined;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2) return "Must be at least 2 characters";
        return undefined;
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return undefined;
      case "phone":
        if (value && !/^(\+?234|0)?[789][01]\d{8}$/.test(value.replace(/[\s-]/g, ""))) {
          return "Please enter a valid Nigerian phone number (e.g. 0803 123 4567)";
        }
        return undefined;
      case "category":
        if (!value) return "Please select an inquiry category";
        return undefined;
      case "message":
        if (!value.trim()) return "Message content is required";
        if (value.trim().length < 15) return "Message must be at least 15 characters long";
        return undefined;
      case "agreeTerms":
        if (!raw) return "You must accept the terms to continue";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (name: keyof FormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validate all fields
    const newErrors: FormErrors = {};
    (Object.keys(values) as (keyof FormValues)[]).forEach((key) => {
      const err = validateField(key, values[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await api.sendContact({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        category: values.category as ContactMessageDTO["category"],
        message: values.message,
      });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not send your message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      category: "general",
      message: "",
      agreeTerms: true,
    });
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  };

  return (
    <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 sm:p-10 shadow-2xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#262626] bg-[#141414] px-3.5 py-1 text-xs font-semibold text-[#946CF9] mb-3">
          <ShieldCheck className="size-3.5 text-[#703BF7]" />
          Verified Inquiry Form
        </div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Send Us a Direct Message
        </h2>
        <p className="mt-1.5 text-xs text-[#999999] sm:text-sm">
          Fill out the form below and an Enugu property consultant will respond to your inquiry.
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400 border border-green-500/30 mb-4">
            <CheckCircle2 className="size-8" />
          </div>

          <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">
            Message Received
          </h3>

          <p className="mt-3 max-w-lg mx-auto text-xs text-[#999999] sm:text-sm leading-relaxed">
            Thank you, <span className="font-semibold text-white">{values.firstName} {values.lastName}</span>! Your inquiry regarding{" "}
            <span className="font-medium text-[#EDE7FE]">
              {values.category.replace(/_/g, " ").toUpperCase()}
            </span>{" "}
            has been sent to our Enugu team. We will reply shortly.
          </p>

          <div className="my-6 rounded-xl border border-[#262626] bg-[#141414] p-4 text-xs text-[#999999] max-w-md mx-auto text-left">
            <p className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[#703BF7]" />
              Submission Summary:
            </p>
            <p>• <span className="text-white">Email:</span> {values.email}</p>
            {values.phone && <p>• <span className="text-white">Phone:</span> +234 {values.phone}</p>}
            <p>• <span className="text-white">Target Location:</span> Enugu, Nigeria</p>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-[#703BF7] px-6 py-3 text-xs font-semibold text-white hover:bg-[#8254F8] transition-colors"
          >
            <RefreshCw className="size-3.5" />
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">
                First Name <span className="text-red-400">*</span>
              </label>
              <div
                className={`flex items-center rounded-xl border bg-[#141414] px-3.5 py-2.5 transition-colors ${
                  errors.firstName && touched.firstName
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-[#262626] focus-within:border-[#703BF7]"
                }`}
              >
                <User className="size-4 text-[#666666] shrink-0" />
                <input
                  type="text"
                  value={values.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="e.g. Chinedu"
                  className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                />
              </div>
              {errors.firstName && touched.firstName && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                  <AlertCircle className="size-3" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">
                Last Name <span className="text-red-400">*</span>
              </label>
              <div
                className={`flex items-center rounded-xl border bg-[#141414] px-3.5 py-2.5 transition-colors ${
                  errors.lastName && touched.lastName
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-[#262626] focus-within:border-[#703BF7]"
                }`}
              >
                <User className="size-4 text-[#666666] shrink-0" />
                <input
                  type="text"
                  value={values.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="e.g. Nnamani"
                  className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                />
              </div>
              {errors.lastName && touched.lastName && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                  <AlertCircle className="size-3" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div
                className={`flex items-center rounded-xl border bg-[#141414] px-3.5 py-2.5 transition-colors ${
                  errors.email && touched.email
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-[#262626] focus-within:border-[#703BF7]"
                }`}
              >
                <Mail className="size-4 text-[#666666] shrink-0" />
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="e.g. chinedu@example.com"
                  className="w-full bg-transparent pl-2.5 text-sm text-white placeholder-[#666666] outline-none"
                />
              </div>
              {errors.email && touched.email && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                  <AlertCircle className="size-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#999999] mb-1.5">
                Phone Number (Nigerian Mobile)
              </label>
              <div
                className={`flex items-center rounded-xl border bg-[#141414] px-3.5 py-2.5 transition-colors ${
                  errors.phone && touched.phone
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-[#262626] focus-within:border-[#703BF7]"
                }`}
              >
                <span className="text-xs text-[#999999] font-mono border-r border-[#262626] pr-2 mr-1">
                  +234
                </span>
                <input
                  type="tel"
                  value={values.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="0803 123 4567"
                  className="w-full bg-transparent pl-2 text-sm text-white placeholder-[#666666] outline-none"
                />
              </div>
              {errors.phone && touched.phone && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                  <AlertCircle className="size-3" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Inquiry Category */}
          <div>
            <label className="block text-xs font-medium text-[#999999] mb-1.5">
              Inquiry Category <span className="text-red-400">*</span>
            </label>
            <div className="rounded-xl border border-[#262626] bg-[#141414] px-3.5 py-2.5 focus-within:border-[#703BF7] transition-colors">
              <select
                value={values.category}
                onChange={(e) => handleChange("category", e.target.value)}
                onBlur={() => handleBlur("category")}
                className="w-full bg-transparent text-sm font-medium text-white outline-none cursor-pointer"
              >
                <option value="general" className="bg-[#1A1A1A] text-white">
                  General Inquiry
                </option>
                <option value="buying" className="bg-[#1A1A1A] text-white">
                  Buying a Duplex or Land in Enugu
                </option>
                <option value="renting" className="bg-[#1A1A1A] text-white">
                  Renting an Apartment in Independence Layout / GRA
                </option>
                <option value="diaspora" className="bg-[#1A1A1A] text-white">
                  Diaspora Investment Advisory (Akulueuno)
                </option>
                <option value="inspection" className="bg-[#1A1A1A] text-white">
                  Schedule Property Inspection (Physical / Virtual Video)
                </option>
                <option value="valuation" className="bg-[#1A1A1A] text-white">
                  Property Valuation & Listing Advisory
                </option>
              </select>
            </div>
            {errors.category && touched.category && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="size-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-medium text-[#999999] mb-1.5">
              Your Message <span className="text-red-400">*</span>
            </label>
            <div
              className={`rounded-xl border bg-[#141414] p-3 transition-colors ${
                errors.message && touched.message
                  ? "border-red-500 focus-within:border-red-500"
                  : "border-[#262626] focus-within:border-[#703BF7]"
              }`}
            >
              <textarea
                rows={4}
                value={values.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                placeholder="Please describe what type of property you are looking for, preferred neighborhood in Enugu (e.g. GRA, Independence Layout, Golf Estate), and your budget..."
                className="w-full bg-transparent text-sm text-white placeholder-[#666666] outline-none resize-none leading-relaxed"
              />
            </div>
            <div className="flex justify-between items-center mt-1.5">
              {errors.message && touched.message ? (
                <p className="flex items-center gap-1 text-[11px] text-red-400">
                  <AlertCircle className="size-3" />
                  {errors.message}
                </p>
              ) : (
                <span className="text-[11px] text-[#666666]">
                  Minimum 15 characters
                </span>
              )}
              <span className="text-[11px] text-[#666666]">
                {values.message.length} characters
              </span>
            </div>
          </div>

          {/* Demonstration Notice & Terms */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-[#999999] cursor-pointer">
              <input
                type="checkbox"
                checked={values.agreeTerms}
                onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                className="size-4 mt-0.5 rounded border-[#262626] bg-[#141414] text-[#703BF7] focus:ring-0"
              />
              <span>
                I agree to the{" "}
                <span className="text-white underline">Terms of Service</span> and consent to GiftHomes contacting me about this inquiry.
              </span>
            </label>
            {errors.agreeTerms && touched.agreeTerms && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-400">
                <AlertCircle className="size-3" />
                {errors.agreeTerms}
              </p>
            )}
          </div>

          {submitError && (
            <p className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="size-3.5" />
              {submitError}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#703BF7] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/25 hover:bg-[#8254F8] disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </span>
              ) : (
                <>
                  Send Message
                  <Send className="size-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
