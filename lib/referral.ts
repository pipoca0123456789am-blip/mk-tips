const REF_STORAGE_KEY = 'mktips_ref_code'
const REF_SESSION_KEY = 'mktips_ref_code_session'

/** Short unique affiliate code from user id */
export function getUserReferralCode(userId: string): string {
  const clean = userId.replace(/-/g, '').toUpperCase()
  return clean.slice(-8) || 'MK000000'
}

export function buildReferralLink(userId: string, origin?: string): string {
  const base =
    origin ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://saa-s-sports-tips-three.vercel.app')
  return `${base}/?ref=${getUserReferralCode(userId)}`
}

function persistReferralCode(code: string): void {
  if (typeof window === 'undefined') return
  const normalized = code.trim().toUpperCase()
  if (!normalized) return
  try {
    localStorage.setItem(REF_STORAGE_KEY, normalized)
  } catch {
    /* private mode */
  }
  try {
    sessionStorage.setItem(REF_SESSION_KEY, normalized)
  } catch {
    /* private mode */
  }
}

export function captureReferralCodeFromUrl(search?: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(search ?? window.location.search)
  const code = params.get('ref')?.trim().toUpperCase()
  if (!code) return null
  persistReferralCode(code)
  return code
}

export function getPendingReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const fromSession = sessionStorage.getItem(REF_SESSION_KEY)
    if (fromSession) return fromSession
  } catch {
    /* ignore */
  }
  try {
    return localStorage.getItem(REF_STORAGE_KEY)
  } catch {
    return null
  }
}

export function clearPendingReferralCode(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(REF_STORAGE_KEY)
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(REF_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

/** Keep ?ref= on any path (checkout, login, etc.) so the affiliate is never lost */
export function withReferralParam(path: string): string {
  if (typeof window === 'undefined') return path
  captureReferralCodeFromUrl()
  const code = getPendingReferralCode()
  if (!code) return path

  const [pathnameAndQuery, hash = ''] = path.split('#')
  const [pathname, query = ''] = pathnameAndQuery.split('?')
  const params = new URLSearchParams(query)
  if (!params.get('ref')) params.set('ref', code)
  const qs = params.toString()
  return `${pathname}${qs ? `?${qs}` : ''}${hash ? `#${hash}` : ''}`
}

export function findUserIdByReferralCode(
  users: { id: string }[],
  code: string,
): string | null {
  const normalized = code.trim().toUpperCase()
  const match = users.find((u) => getUserReferralCode(u.id) === normalized)
  return match?.id ?? null
}
