"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import type { UserRole } from "@gift-homes/shared"
import { PageHeader, StateMessage, useAdminData, fmtDate } from "@/components/admin/admin-shell"

const ROLES: UserRole[] = ["buyer", "owner", "diaspora", "admin"]

export default function AdminUsersPage() {
  const { user: me } = useAuth()
  const { data, loading, error, reload } = useAdminData(() => api.admin.users())
  const [actionError, setActionError] = useState<string | null>(null)

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
      <PageHeader title="Users" description="Registered accounts and their roles." />
      {actionError && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{actionError}</p>}
      <StateMessage loading={loading} error={error} />

      {data && (
        <div className="overflow-x-auto rounded-2xl border border-[#262626] bg-[#1A1A1A]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#262626] text-[11px] tracking-wider text-[#666666] uppercase">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {data.map((u) => {
                const self = u.id === me?.id
                return (
                  <tr key={u.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-white">{u.name}{self && <span className="ml-2 text-[10px] text-[#946CF9]">(you)</span>}</p>
                      <p className="text-xs text-[#999999]">{u.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={u.role}
                        disabled={self}
                        aria-label={`Role for ${u.name}`}
                        onChange={(e) => run(() => api.admin.setUserRole(u.id, e.target.value as UserRole))}
                        className="rounded-lg border border-[#262626] bg-[#141414] px-2 py-1.5 text-xs text-white capitalize outline-none focus:border-[#703BF7] disabled:opacity-50"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#999999]">{u.createdAt ? fmtDate(u.createdAt) : "—"}</td>
                    <td className="px-5 py-3 text-right">
                      {!self && (
                        <button
                          aria-label={`Delete ${u.name}`}
                          onClick={() => confirm(`Delete ${u.email}?`) && run(() => api.admin.deleteUser(u.id))}
                          className="rounded-lg border border-[#262626] p-2 text-[#999999] hover:border-red-500/50 hover:text-red-400"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
