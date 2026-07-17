const REF_STORAGE_KEY = 'mktips_ref_code'

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

export function captureReferralCodeFromUrl(search?: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(search ?? window.location.search)
  const code = params.get('ref')?.trim().toUpperCase()
  if (!code) return null
  localStorage.setItem(REF_STORAGE_KEY, code)
  return code
}

export function getPendingReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REF_STORAGE_KEY)
}

export function clearPendingReferralCode(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(REF_STORAGE_KEY)
}

export function findUserIdByReferralCode(
  users: { id: string }[],
  code: string,
): string | null {
  const normalized = code.trim().toUpperCase()
  const match = users.find((u) => getUserReferralCode(u.id) === normalized)
  return match?.id ?? null
}
