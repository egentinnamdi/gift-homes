"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowLeft,
  BadgeCheck,
  Droplets,
  Zap,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from "lucide-react"
import { api, ApiError } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import type { Property } from "@/types/property"
import { PropertyCard } from "@/components/properties/property-card"

const input =
  "w-full rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#703BF7]"

export function PropertyDetail({ slug }: { slug: string }) {
  const { user } = useAuth()
  const [loaded, setLoaded] = useState<{ slug: string; property: Property | null; failed: boolean; missing: boolean } | null>(null)
  const [similar, setSimilar] = useState<Property[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let cancelled = false
    api
      .property(slug)
      .then((p) => {
        if (cancelled) return
        setLoaded({ slug, property: p, failed: false, missing: false })
        setActive(0)
        api.similar(slug).then((s) => !cancelled && setSimilar(s)).catch(() => {})
      })
      .catch((e) => {
        if (cancelled) return
        setLoaded({ slug, property: null, failed: true, missing: e instanceof ApiError && e.status === 404 })
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const current = loaded?.slug === slug ? loaded : null
  const property = current?.property ?? null
  const status = !current ? "loading" : current.missing ? "missing" : current.failed ? "error" : "ready"

  if (status === "loading") {
    return <div className="py-32 text-center text-sm text-[#999999]">Loading property…</div>
  }
  if (status !== "ready" || !property) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-heading text-2xl font-bold text-white">
          {status === "missing" ? "Property not found" : "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-[#999999]">
          {status === "missing"
            ? "This listing may have been removed or sold."
            : "We could not load this listing. Please try again."}
        </p>
        <Link href="/properties" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#703BF7] px-5 py-3 text-sm font-semibold text-white hover:bg-[#8254F8]">
          <ArrowLeft className="size-4" /> Back to Properties
        </Link>
      </div>
    )
  }

  const isRent = property.listingType === "rent"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/properties" className="inline-flex items-center gap-2 text-xs font-medium text-[#999999] hover:text-white">
        <ArrowLeft className="size-3.5" /> All properties
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#262626] bg-[#1A1A1A]">
            <Image
              src={property.images[active] || property.images[0]}
              alt={property.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${isRent ? "bg-[#703BF7]" : "border border-[#262626] bg-[#141414]/90"}`}>
                {isRent ? "For Rent" : "For Sale"}
              </span>
              {property.featured && (
                <span className="rounded-full border border-[#262626] bg-[#141414]/90 px-3 py-1 text-xs font-medium text-[#946CF9]">
                  Featured
                </span>
              )}
            </div>
          </div>

          {property.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
              {property.images.slice(0, 5).map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={`relative aspect-[4/3] overflow-hidden rounded-xl border bg-[#1A1A1A] transition-all ${
                    i === active ? "border-[#703BF7]" : "border-[#262626] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center gap-1.5 text-xs text-[#999999]">
              <MapPin className="size-3.5 text-[#703BF7]" />
              {property.location.address}
            </div>
            <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {property.title}
            </h1>
            {property.tagline && <p className="mt-2 text-sm text-[#946CF9]">{property.tagline}</p>}

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Maximize2, label: "Area", value: `${property.areaSqm} m²` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#262626] bg-[#1A1A1A] p-4">
                  <s.icon className="size-4 text-[#703BF7]" />
                  <p className="mt-2 font-heading text-lg font-bold text-white">{s.value}</p>
                  <p className="text-[11px] text-[#999999]">{s.label}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-8 font-heading text-lg font-bold text-white">About this property</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#999999]">{property.description}</p>

            {(property.titleDocument || property.location.landmark) && (
              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                {property.titleDocument && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#262626] bg-[#1A1A1A] px-3 py-1.5 text-white">
                    <FileCheck2 className="size-3.5 text-[#703BF7]" /> {property.titleDocument}
                  </span>
                )}
                {property.location.landmark && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#262626] bg-[#1A1A1A] px-3 py-1.5 text-white">
                    <MapPin className="size-3.5 text-[#703BF7]" /> {property.location.landmark}
                  </span>
                )}
              </div>
            )}

            {property.amenities.length > 0 && (
              <>
                <h2 className="mt-8 font-heading text-lg font-bold text-white">Amenities</h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {property.amenities.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm text-[#999999]">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#703BF7]" />
                      {a}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {property.powerAndWater && (
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#262626] bg-[#1A1A1A] p-4">
                  <Droplets className="size-4 text-[#703BF7]" />
                  <p className="mt-2 text-xs font-semibold text-white">Water</p>
                  <p className="mt-1 text-xs text-[#999999]">{property.powerAndWater.waterSource}</p>
                </div>
                <div className="rounded-xl border border-[#262626] bg-[#1A1A1A] p-4">
                  <Zap className="size-4 text-[#703BF7]" />
                  <p className="mt-2 text-xs font-semibold text-white">Power</p>
                  <p className="mt-1 text-xs text-[#999999]">{property.powerAndWater.powerBackup}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6">
            <span className="text-[10px] font-semibold tracking-wider text-[#666666] uppercase">Price</span>
            <p className="font-heading text-3xl font-extrabold text-white">{property.priceFormatted}</p>

            <div className="mt-5 flex items-center gap-3 border-t border-[#262626] pt-5">
              <div className="relative size-12 overflow-hidden rounded-xl bg-[#262626]">
                <Image src={property.agent.avatar} alt={property.agent.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{property.agent.name}</p>
                <p className="truncate text-xs text-[#999999]">{property.agent.role}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-xs">
              <a href={`tel:${property.agent.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-2 text-[#999999] hover:text-white">
                <Phone className="size-3.5 text-[#703BF7]" /> {property.agent.phone}
              </a>
              <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-[#999999] hover:text-white">
                <Mail className="size-3.5 text-[#703BF7]" /> {property.agent.email}
              </a>
            </div>
          </div>

          <InspectionForm property={property} defaultName={user?.name} defaultEmail={user?.email} defaultPhone={user?.phone} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16 border-t border-[#262626] pt-12">
          <h2 className="font-heading text-2xl font-bold text-white">Similar properties</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function InspectionForm({
  property,
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
}: {
  property: Property
  defaultName?: string
  defaultEmail?: string
  defaultPhone?: string
}) {
  const [edits, setForm] = useState<Partial<Record<"name" | "email" | "phone", string>>>({})
  const [rest, setRest] = useState({
    preferredDate: "",
    inspectionType: "physical" as "physical" | "virtual_video",
    message: "",
  })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = {
    name: edits.name ?? defaultName,
    email: edits.email ?? defaultEmail,
    phone: edits.phone ?? defaultPhone,
    ...rest,
  }

  const set = (k: keyof typeof form, v: string) =>
    k === "name" || k === "email" || k === "phone"
      ? setForm((f) => ({ ...f, [k]: v }))
      : setRest((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.phone.trim()) {
      setError("Please provide your name, a valid email and phone number.")
      return
    }
    setBusy(true)
    try {
      await api.requestInspection({ ...form, propertyId: property.id, preferredDate: form.preferredDate || undefined })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your request")
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <CheckCircle2 className="mx-auto size-8 text-green-400" />
        <p className="mt-3 font-heading text-lg font-bold text-white">Request received</p>
        <p className="mt-1 text-xs text-[#999999]">
          Our team will contact you to confirm your inspection of {property.title}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6" noValidate>
      <h3 className="font-heading text-lg font-bold text-white">Book an inspection</h3>
      <p className="mt-1 text-xs text-[#999999]">Visit in person or join a live video tour.</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(["physical", "virtual_video"] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => set("inspectionType", t)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              form.inspectionType === t ? "bg-[#703BF7] text-white" : "border border-[#262626] bg-[#141414] text-[#999999] hover:text-white"
            }`}
          >
            {t === "physical" ? "In person" : "Video tour"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        <input className={input} placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className={input} type="email" placeholder="Email address" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input className={input} type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className={input} type="date" min={new Date().toISOString().slice(0, 10)} value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} aria-label="Preferred date" />
        <textarea className={`${input} min-h-20 resize-y`} placeholder="Anything we should know? (optional)" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle className="size-3.5 shrink-0" /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-xl bg-[#703BF7] py-3 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/25 transition-all hover:bg-[#8254F8] disabled:opacity-50"
      >
        {busy ? "Sending…" : "Request inspection"}
      </button>
    </form>
  )
}
