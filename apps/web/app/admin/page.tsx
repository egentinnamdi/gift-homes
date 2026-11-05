"use client"

import Link from "next/link"
import { Home, CalendarCheck, Mail, Users, Star, ArrowRight } from "lucide-react"
import { api } from "@/lib/api"
import { PageHeader, StateMessage, useAdminData, fmtDate } from "@/components/admin/admin-shell"

export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminData(() => api.admin.stats())

  return (
    <>
      <PageHeader title="Dashboard" description="An overview of listings and incoming activity." />
      <StateMessage loading={loading} error={error} />
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { icon: Home, label: "Properties", value: data.totalProperties, sub: `${data.forSale} sale · ${data.forRent} rent`, href: "/admin/properties" },
              { icon: Star, label: "Featured", value: data.featuredProperties, sub: "shown on homepage", href: "/admin/properties" },
              { icon: CalendarCheck, label: "Pending inspections", value: data.pendingEnquiries, sub: `${data.totalEnquiries} total`, href: "/admin/enquiries" },
              { icon: Mail, label: "Unread messages", value: data.unreadMessages, sub: "contact form", href: "/admin/messages" },
            ].map((c) => (
              <Link key={c.label} href={c.href} className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-5 transition-colors hover:border-[#703BF7]/60">
                <c.icon className="size-5 text-[#703BF7]" />
                <p className="mt-3 font-heading text-3xl font-extrabold text-white">{c.value}</p>
                <p className="text-xs font-medium text-white">{c.label}</p>
                <p className="text-[11px] text-[#999999]">{c.sub}</p>
              </Link>
            ))}
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs text-[#999999]">
            <Users className="size-3.5" /> {data.totalUsers} registered users
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-base font-bold text-white">Recent inspection requests</h2>
                <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-xs text-[#946CF9] hover:text-white">
                  View all <ArrowRight className="size-3" />
                </Link>
              </div>
              {data.recentEnquiries.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#666666]">No requests yet.</p>
              ) : (
                <ul className="divide-y divide-[#262626]">
                  {data.recentEnquiries.map((e) => (
                    <li key={e.id} className="py-3">
                      <p className="text-sm font-medium text-white">{e.name}</p>
                      <p className="truncate text-xs text-[#999999]">{e.propertyTitle}</p>
                      <p className="mt-0.5 text-[11px] text-[#666666]">
                        {fmtDate(e.createdAt)} · {e.status}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-base font-bold text-white">Recent messages</h2>
                <Link href="/admin/messages" className="inline-flex items-center gap-1 text-xs text-[#946CF9] hover:text-white">
                  View all <ArrowRight className="size-3" />
                </Link>
              </div>
              {data.recentMessages.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#666666]">No messages yet.</p>
              ) : (
                <ul className="divide-y divide-[#262626]">
                  {data.recentMessages.map((m) => (
                    <li key={m.id} className="py-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-white">
                        {m.firstName} {m.lastName}
                        {!m.read && <span className="size-1.5 rounded-full bg-[#703BF7]" />}
                      </p>
                      <p className="line-clamp-1 text-xs text-[#999999]">{m.message}</p>
                      <p className="mt-0.5 text-[11px] text-[#666666]">{fmtDate(m.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  )
}
