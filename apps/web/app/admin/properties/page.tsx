"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Star, Search, X } from "lucide-react"
import { api } from "@/lib/api"
import type { Property, PropertyInputDTO } from "@/types/property"
import { PageHeader, StateMessage, useAdminData, inputCls } from "@/components/admin/admin-shell"
import { ENUGU_NEIGHBORHOODS } from "@gift-homes/shared"

const TYPES = ["Duplex", "Apartment", "Villa", "Bungalow", "Commercial", "Land"] as const
const TITLES = ["", "C of O", "Governor's Consent", "Deed of Assignment", "Gazette", "Registered Survey"] as const

interface FormState {
  title: string
  tagline: string
  description: string
  price: string
  priceType: "total" | "per_year"
  listingType: "sale" | "rent"
  propertyType: (typeof TYPES)[number]
  neighborhood: string
  address: string
  landmark: string
  bedrooms: string
  bathrooms: string
  areaSqm: string
  titleDocument: string
  featured: boolean
  images: string
  amenities: string
  waterSource: string
  powerBackup: string
  agentName: string
  agentRole: string
  agentPhone: string
  agentEmail: string
  agentAvatar: string
}

const empty: FormState = {
  title: "",
  tagline: "",
  description: "",
  price: "",
  priceType: "total",
  listingType: "sale",
  propertyType: "Duplex",
  neighborhood: "GRA",
  address: "",
  landmark: "",
  bedrooms: "3",
  bathrooms: "3",
  areaSqm: "",
  titleDocument: "",
  featured: false,
  images: "",
  amenities: "",
  waterSource: "",
  powerBackup: "",
  agentName: "",
  agentRole: "",
  agentPhone: "",
  agentEmail: "",
  agentAvatar: "",
}

const fromProperty = (p: Property): FormState => ({
  title: p.title,
  tagline: p.tagline,
  description: p.description,
  price: String(p.price),
  priceType: p.priceType,
  listingType: p.listingType,
  propertyType: p.propertyType as FormState["propertyType"],
  neighborhood: p.location.neighborhood,
  address: p.location.address,
  landmark: p.location.landmark ?? "",
  bedrooms: String(p.bedrooms),
  bathrooms: String(p.bathrooms),
  areaSqm: String(p.areaSqm),
  titleDocument: p.titleDocument ?? "",
  featured: p.featured,
  images: p.images.join("\n"),
  amenities: p.amenities.join("\n"),
  waterSource: p.powerAndWater?.waterSource ?? "",
  powerBackup: p.powerAndWater?.powerBackup ?? "",
  agentName: p.agent.name,
  agentRole: p.agent.role,
  agentPhone: p.agent.phone,
  agentEmail: p.agent.email,
  agentAvatar: p.agent.avatar,
})

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean)

const toDTO = (f: FormState): PropertyInputDTO => ({
  title: f.title,
  tagline: f.tagline,
  description: f.description,
  price: Number(f.price),
  priceType: f.priceType,
  listingType: f.listingType,
  propertyType: f.propertyType,
  location: {
    neighborhood: f.neighborhood,
    city: "Enugu",
    state: "Enugu State",
    address: f.address,
    landmark: f.landmark || undefined,
  },
  bedrooms: Number(f.bedrooms),
  bathrooms: Number(f.bathrooms),
  areaSqm: Number(f.areaSqm),
  titleDocument: (f.titleDocument || undefined) as PropertyInputDTO["titleDocument"],
  featured: f.featured,
  images: lines(f.images),
  amenities: lines(f.amenities),
  powerAndWater: f.waterSource || f.powerBackup ? { waterSource: f.waterSource, powerBackup: f.powerBackup } : undefined,
  agent: {
    name: f.agentName,
    role: f.agentRole,
    phone: f.agentPhone,
    email: f.agentEmail,
    avatar: f.agentAvatar,
  },
})

export default function AdminPropertiesPage() {
  const { data, loading, error, reload } = useAdminData(() => api.admin.properties())
  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState<{ id: string | null; form: FormState } | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter(
      (p) => !q || p.title.toLowerCase().includes(q) || p.location.neighborhood.toLowerCase().includes(q)
    )
  }, [data, query])

  const remove = async (p: Property) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    try {
      await api.admin.deleteProperty(p.id)
      await reload()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Delete failed")
    }
  }

  const toggleFeatured = async (p: Property) => {
    try {
      await api.admin.updateProperty(p.id, { ...toDTO(fromProperty(p)), featured: !p.featured })
      await reload()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed")
    }
  }

  return (
    <>
      <PageHeader
        title="Properties"
        description="Create, edit and remove listings."
        action={
          <button
            onClick={() => setEditing({ id: null, form: empty })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#703BF7] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/25 hover:bg-[#8254F8]"
          >
            <Plus className="size-4" /> Add property
          </button>
        }
      />

      <div className="mb-4 flex items-center rounded-xl border border-[#262626] bg-[#1A1A1A] px-3 focus-within:border-[#703BF7] sm:max-w-sm">
        <Search className="size-4 text-[#666666]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search listings" className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-[#666666]" />
      </div>

      {actionError && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{actionError}</p>}
      <StateMessage loading={loading} error={error} empty={data && rows.length === 0 ? "No properties found." : undefined} />

      {rows.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#262626] bg-[#1A1A1A]">
          <ul className="divide-y divide-[#262626]">
            {rows.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg bg-[#262626] sm:w-32">
                  <Image src={p.images[0]} alt="" fill sizes="128px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{p.title}</p>
                  <p className="text-xs text-[#999999]">
                    {p.location.neighborhood} · {p.propertyType} · {p.bedrooms} bd · {p.listingType === "rent" ? "Rent" : "Sale"}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-[#946CF9]">{p.priceFormatted}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleFeatured(p)}
                    title={p.featured ? "Remove from featured" : "Mark as featured"}
                    aria-label="Toggle featured"
                    className={`rounded-lg border border-[#262626] p-2 hover:border-[#333333] ${p.featured ? "text-yellow-400" : "text-[#666666]"}`}
                  >
                    <Star className={`size-4 ${p.featured ? "fill-current" : ""}`} />
                  </button>
                  <button onClick={() => setEditing({ id: p.id, form: fromProperty(p) })} aria-label="Edit" className="rounded-lg border border-[#262626] p-2 text-[#999999] hover:border-[#703BF7] hover:text-white">
                    <Pencil className="size-4" />
                  </button>
                  <button onClick={() => remove(p)} aria-label="Delete" className="rounded-lg border border-[#262626] p-2 text-[#999999] hover:border-red-500/50 hover:text-red-400">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {editing && (
        <PropertyForm
          id={editing.id}
          initial={editing.form}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null)
            await reload()
          }}
        />
      )}
    </>
  )
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-[#999999]">{label}</span>
      {children}
    </label>
  )
}

function PropertyForm({
  id,
  initial,
  onClose,
  onSaved,
}: {
  id: string | null
  initial: FormState
  onClose: () => void
  onSaved: () => void
}) {
  const [f, setF] = useState<FormState>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const dto = toDTO(f)
      if (id) await api.admin.updateProperty(id, dto)
      else await api.admin.createProperty(dto)
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <form onSubmit={submit} className="w-full max-w-3xl rounded-2xl border border-[#262626] bg-[#1A1A1A] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#262626] p-5">
          <h2 className="font-heading text-lg font-bold text-white">{id ? "Edit property" : "Add property"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-[#999999] hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <Field label="Title *" className="sm:col-span-2">
            <input required className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <input className={inputCls} value={f.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea rows={4} className={inputCls} value={f.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <Field label="Listing type">
            <select className={inputCls} value={f.listingType} onChange={(e) => {
              const v = e.target.value as "sale" | "rent"
              setF((s) => ({ ...s, listingType: v, priceType: v === "rent" ? "per_year" : "total" }))
            }}>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
          </Field>
          <Field label="Property type">
            <select className={inputCls} value={f.propertyType} onChange={(e) => set("propertyType", e.target.value as FormState["propertyType"])}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Price (₦) *">
            <input required type="number" min={1} className={inputCls} value={f.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Price basis">
            <select className={inputCls} value={f.priceType} onChange={(e) => set("priceType", e.target.value as "total" | "per_year")}>
              <option value="total">Total price</option>
              <option value="per_year">Per year</option>
            </select>
          </Field>

          <Field label="Neighborhood *">
            <input required list="neighborhoods" className={inputCls} value={f.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
            <datalist id="neighborhoods">
              {ENUGU_NEIGHBORHOODS.filter((n) => n !== "All Neighborhoods").map((n) => <option key={n} value={n} />)}
            </datalist>
          </Field>
          <Field label="Landmark">
            <input className={inputCls} value={f.landmark} onChange={(e) => set("landmark", e.target.value)} />
          </Field>
          <Field label="Address *" className="sm:col-span-2">
            <input required className={inputCls} value={f.address} onChange={(e) => set("address", e.target.value)} />
          </Field>

          <Field label="Bedrooms"><input type="number" min={0} className={inputCls} value={f.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></Field>
          <Field label="Bathrooms"><input type="number" min={0} className={inputCls} value={f.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></Field>
          <Field label="Area (m²)"><input type="number" min={0} className={inputCls} value={f.areaSqm} onChange={(e) => set("areaSqm", e.target.value)} /></Field>
          <Field label="Title document">
            <select className={inputCls} value={f.titleDocument} onChange={(e) => set("titleDocument", e.target.value)}>
              {TITLES.map((t) => <option key={t} value={t}>{t || "Not specified"}</option>)}
            </select>
          </Field>

          <Field label="Image URLs * (one per line, first is the cover)" className="sm:col-span-2">
            <textarea required rows={4} className={inputCls} value={f.images} onChange={(e) => set("images", e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Amenities (one per line)" className="sm:col-span-2">
            <textarea rows={4} className={inputCls} value={f.amenities} onChange={(e) => set("amenities", e.target.value)} />
          </Field>
          <Field label="Water source"><input className={inputCls} value={f.waterSource} onChange={(e) => set("waterSource", e.target.value)} /></Field>
          <Field label="Power backup"><input className={inputCls} value={f.powerBackup} onChange={(e) => set("powerBackup", e.target.value)} /></Field>

          <p className="text-xs font-semibold text-white sm:col-span-2">Listing agent (optional — defaults to GiftHomes Team)</p>
          <Field label="Name"><input className={inputCls} value={f.agentName} onChange={(e) => set("agentName", e.target.value)} /></Field>
          <Field label="Role"><input className={inputCls} value={f.agentRole} onChange={(e) => set("agentRole", e.target.value)} /></Field>
          <Field label="Phone"><input className={inputCls} value={f.agentPhone} onChange={(e) => set("agentPhone", e.target.value)} /></Field>
          <Field label="Email"><input type="email" className={inputCls} value={f.agentEmail} onChange={(e) => set("agentEmail", e.target.value)} /></Field>
          <Field label="Avatar URL" className="sm:col-span-2"><input className={inputCls} value={f.agentAvatar} onChange={(e) => set("agentAvatar", e.target.value)} /></Field>

          <label className="flex items-center gap-2 text-sm text-white sm:col-span-2">
            <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 rounded border-[#262626] bg-[#141414]" />
            Feature on the homepage
          </label>
        </div>

        {error && <p className="mx-5 mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-[#262626] p-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#262626] px-5 py-2.5 text-sm font-semibold text-white hover:border-[#333333]">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-xl bg-[#703BF7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8254F8] disabled:opacity-50">
            {busy ? "Saving…" : id ? "Save changes" : "Create property"}
          </button>
        </div>
      </form>
    </div>
  )
}
