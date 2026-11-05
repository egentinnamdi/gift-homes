"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Phone, Mail, Video, MapPin } from "lucide-react"
import { api } from "@/lib/api"
import type { EnquiryStatus } from "@gift-homes/shared"
import { PageHeader, StateMessage, useAdminData, fmtDate } from "@/components/admin/admin-shell"

const STATUSES: EnquiryStatus[] = ["pending", "confirmed", "completed", "cancelled"]
const badge: Record<EnquiryStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  completed: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
}

export default function AdminEnquiriesPage() {
  const { data, loading, error, reload } = useAdminData(() => api.admin.enquiries())
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all")
  const [actionError, setActionError] = useState<string | null>(null)

  const rows = (data ?? []).filter((e) => filter === "all" || e.status === filter)

  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn()
      setActionError(null)
      await reload()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed")
    }
  }

  return (
    <>
      <PageHeader title="Inspection requests" description="Track and respond to property inspection bookings." />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === s ? "bg-[#703BF7] text-white" : "border border-[#262626] bg-[#1A1A1A] text-[#999999] hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {actionError && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{actionError}</p>}
      <StateMessage loading={loading} error={error} empty={data && rows.length === 0 ? "No inspection requests." : undefined} />

      <ul className="space-y-3">
        {rows.map((e) => (
          <li key={e.id} className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{e.name}</p>
                <Link href={`/properties`} className="block truncate text-xs text-[#946CF9] hover:text-white">{e.propertyTitle}</Link>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#999999]">
                  <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="size-3.5" />{e.email}</a>
                  <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1.5 hover:text-white"><Phone className="size-3.5" />{e.phone}</a>
                  <span className="inline-flex items-center gap-1.5">
                    {e.inspectionType === "virtual_video" ? <Video className="size-3.5" /> : <MapPin className="size-3.5" />}
                    {e.inspectionType === "virtual_video" ? "Video tour" : "In person"}
                  </span>
                  {e.preferredDate && <span>Preferred: {e.preferredDate}</span>}
                </div>
                {e.message && <p className="mt-3 text-xs leading-relaxed text-[#999999]">&ldquo;{e.message}&rdquo;</p>}
                <p className="mt-2 text-[11px] text-[#666666]">Received {fmtDate(e.createdAt)}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${badge[e.status]}`}>{e.status}</span>
                <select
                  value={e.status}
                  aria-label="Change status"
                  onChange={(ev) => run(() => api.admin.setEnquiryStatus(e.id, ev.target.value as EnquiryStatus))}
                  className="rounded-lg border border-[#262626] bg-[#141414] px-2 py-1.5 text-xs text-white outline-none focus:border-[#703BF7]"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  aria-label="Delete"
                  onClick={() => confirm("Delete this request?") && run(() => api.admin.deleteEnquiry(e.id))}
                  className="rounded-lg border border-[#262626] p-2 text-[#999999] hover:border-red-500/50 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
