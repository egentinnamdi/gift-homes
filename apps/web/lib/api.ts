import type {
  Property,
  PropertyInputDTO,
  PropertyFilterParams,
  EnquiryRecord,
  EnquiryStatus,
  ContactMessageDTO,
  ContactMessageRecord,
  PropertyEnquiryDTO,
  DashboardStats,
  User,
  UserRole,
} from "@gift-homes/shared"

// In production the API is served from the same domain (Vercel services routes /api/* to it).
// Locally, `next dev` runs on :3000 and the API on :5000.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:5000/api/v1")

export const TOKEN_KEY = "gifthomes_token"

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // storage unavailable
  }
}

interface Envelope<T> {
  success: boolean
  message: string
  data: T
  meta?: Meta
}

export interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<Envelope<T>> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers["Content-Type"] = "application/json"
  const token = getToken()
  if (token && options.auth !== false) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    })
  } catch {
    throw new ApiError("Cannot reach the server. Please try again shortly.", 0)
  }
  const json = (await res.json().catch(() => null)) as Envelope<T> | null
  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message || `Request failed (${res.status})`, res.status)
  }
  return json
}

const get = <T,>(path: string, auth = true) => request<T>(path, { auth }).then((r) => r.data)
const send = <T,>(method: string, path: string, body?: unknown) =>
  request<T>(path, { method, body }).then((r) => r.data)

export const api = {
  // auth
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }).then((r) => r.data),
  register: (body: {
    name: string
    email: string
    password: string
    phone?: string
    role: UserRole
  }) =>
    request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body,
      auth: false,
    }).then((r) => r.data),
  forgotPassword: (email: string) =>
    send<null>("POST", "/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    send<null>("POST", "/auth/reset-password", { token, password }),
  me: () => get<User>("/auth/me"),

  // public
  properties: (params: PropertyFilterParams = {}) => {
    const q = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) q.set(k, String(v))
    })
    return request<Property[]>(`/properties?${q}`, { auth: false }).then((r) => ({
      items: r.data,
      meta: r.meta as Meta,
    }))
  },
  featured: () => get<Property[]>("/properties/featured", false),
  property: (slug: string) => get<Property>(`/properties/${slug}`, false),
  similar: (slug: string) => get<Property[]>(`/properties/${slug}/similar`, false),
  requestInspection: (body: Omit<PropertyEnquiryDTO, "propertyTitle">) =>
    send<EnquiryRecord>("POST", "/enquiries/inspections", body),
  sendContact: (body: ContactMessageDTO) =>
    send<ContactMessageRecord>("POST", "/enquiries/contact", body),

  // admin
  admin: {
    stats: () => get<DashboardStats>("/admin/stats"),
    properties: () => get<Property[]>("/admin/properties"),
    createProperty: (b: PropertyInputDTO) => send<Property>("POST", "/admin/properties", b),
    updateProperty: (id: string, b: PropertyInputDTO) =>
      send<Property>("PUT", `/admin/properties/${id}`, b),
    deleteProperty: (id: string) => send<null>("DELETE", `/admin/properties/${id}`),
    enquiries: () => get<EnquiryRecord[]>("/admin/enquiries"),
    setEnquiryStatus: (id: string, status: EnquiryStatus) =>
      send<EnquiryRecord>("PATCH", `/admin/enquiries/${id}`, { status }),
    deleteEnquiry: (id: string) => send<null>("DELETE", `/admin/enquiries/${id}`),
    messages: () => get<ContactMessageRecord[]>("/admin/messages"),
    setMessageRead: (id: string, read: boolean) =>
      send<ContactMessageRecord>("PATCH", `/admin/messages/${id}`, { read }),
    replyToMessage: (id: string, body: { subject?: string; body: string }) =>
      send<ContactMessageRecord>("POST", `/admin/messages/${id}/reply`, body),
    deleteMessage: (id: string) => send<null>("DELETE", `/admin/messages/${id}`),
    users: () => get<User[]>("/admin/users"),
    setUserRole: (id: string, role: UserRole) =>
      send<User>("PATCH", `/admin/users/${id}`, { role }),
    deleteUser: (id: string) => send<null>("DELETE", `/admin/users/${id}`),
  },
}
