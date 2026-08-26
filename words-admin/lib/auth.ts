export type AdminUser = {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export type Session = {
  id: string
  name: string
  email: string
}

export const USERS_STORAGE_KEY = "words_admin_users"
export const SESSION_STORAGE_KEY = "words_admin_session"

export function readUsers(): AdminUser[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as AdminUser[]) : []
  } catch {
    return []
  }
}

export function writeUsers(users: AdminUser[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function readSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function writeSession(session: Session) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

export function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
