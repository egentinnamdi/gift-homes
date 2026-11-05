"use client"

import { useState } from "react"
import { Trash2, MailOpen, Mail, Phone, Reply, Send, CheckCheck, X } from "lucide-react"
import { api } from "@/lib/api"
import type { ContactMessageRecord } from "@gift-homes/shared"
import { PageHeader, StateMessage, useAdminData, fmtDate, inputCls } from "@/components/admin/admin-shell"

export default function AdminMessagesPage() {
  const { data, loading, error, reload } = useAdminData(() => api.admin.messages())
  const [actionError, setActionError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

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
      <PageHeader title="Messages" description="Enquiries submitted through the contact form." />
      {actionError && <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{actionError}</p>}
      <StateMessage loading={loading} error={error} empty={data && data.length === 0 ? "No messages yet." : undefined} />

      <ul className="space-y-3">
        {data?.map((m) => (
          <li key={m.id} className={`rounded-2xl border bg-[#1A1A1A] p-5 ${m.read ? "border-[#262626]" : "border-[#703BF7]/50"}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  {m.firstName} {m.lastName}
                  {!m.read && <span className="rounded-full bg-[#703BF7] px-2 py-0.5 text-[10px] font-semibold text-white">New</span>}
                  <span className="rounded-full border border-[#262626] px-2 py-0.5 text-[10px] font-medium text-[#999999] capitalize">{m.category}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-[#999999]">
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="size-3.5" />{m.email}</a>
                  {m.phone && <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 hover:text-white"><Phone className="size-3.5" />{m.phone}</a>}
                </div>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-[#cccccc]">{m.message}</p>
                <p className="mt-2 text-[11px] text-[#666666]">{fmtDate(m.createdAt)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => setReplyingTo(replyingTo === m.id ? null : m.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#703BF7] px-3 py-2 text-xs font-semibold text-white hover:bg-[#8254F8]"
                >
                  <Reply className="size-3.5" /> Reply
                </button>
                <button
                  onClick={() => run(() => api.admin.setMessageRead(m.id, !m.read))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#262626] px-3 py-2 text-xs font-medium text-[#999999] hover:border-[#703BF7] hover:text-white"
                >
                  <MailOpen className="size-3.5" /> {m.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  aria-label="Delete"
                  onClick={() => confirm("Delete this message?") && run(() => api.admin.deleteMessage(m.id))}
                  className="rounded-lg border border-[#262626] p-2 text-[#999999] hover:border-red-500/50 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {m.replies && m.replies.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-[#262626] pt-4">
                {m.replies.map((r) => (
                  <div key={r.id} className="rounded-xl border border-[#262626] bg-[#141414] p-3">
                    <p className="flex items-center gap-1.5 text-[11px] text-green-400">
                      <CheckCheck className="size-3.5" /> Replied by {r.sentBy} · {fmtDate(r.sentAt)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-white">{r.subject}</p>
                    <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap text-[#999999]">{r.body}</p>
                  </div>
                ))}
              </div>
            )}

            {replyingTo === m.id && (
              <ReplyComposer
                message={m}
                onCancel={() => setReplyingTo(null)}
                onSent={async () => {
                  setReplyingTo(null)
                  await reload()
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

function ReplyComposer({
  message,
  onCancel,
  onSent,
}: {
  message: ContactMessageRecord
  onCancel: () => void
  onSent: () => void
}) {
  const [subject, setSubject] = useState("Re: Your enquiry to GiftHomes")
  const [body, setBody] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (body.trim().length < 2) return setError("Write a reply first.")
    setBusy(true)
    try {
      await api.admin.replyToMessage(message.id, { subject, body })
      onSent()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reply")
      setBusy(false)
    }
  }

  return (
    <form onSubmit={send} className="mt-4 space-y-3 rounded-xl border border-[#703BF7]/40 bg-[#141414] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-white">
          Reply to {message.firstName} &lt;{message.email}&gt;
        </p>
        <button type="button" onClick={onCancel} aria-label="Cancel reply" className="text-[#999999] hover:text-white">
          <X className="size-4" />
        </button>
      </div>
      <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" maxLength={200} />
      <textarea
        className={`${inputCls} min-h-36 resize-y`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`Write your reply. The greeting "Hi ${message.firstName}," is added for you.`}
        required
      />
      <p className="text-[11px] text-[#666666]">
        Sent from GiftHomes in a branded email template, with their original message quoted below your reply.
      </p>
      {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400">{error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-xl border border-[#262626] px-4 py-2 text-xs font-semibold text-white hover:border-[#333333]">
          Cancel
        </button>
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#703BF7] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8254F8] disabled:opacity-50">
          <Send className="size-3.5" /> {busy ? "Sending…" : "Send reply"}
        </button>
      </div>
    </form>
  )
}
