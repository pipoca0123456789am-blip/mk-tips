'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { db } from '@/lib/db'

const ADMIN_LOGIN_PATH = '/mktipsadmin'
const ADMIN_ROLES = ['Master', 'Admin', 'Gerente', 'Suporte', 'Financeiro', 'Moderador']

function hasAdminSession(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('oddvault_admin_session') === 'true'
}

export function SecurityGuard() {
  const pathname = usePathname()

  useEffect(() => {
    // Never trap the black-box page or public marketing routes
    if (pathname === '/caixa-preta') return
    if (!pathname.startsWith('/mktipsadmin')) return

    // Login page must stay accessible — otherwise owners get auto-banned
    if (pathname === ADMIN_LOGIN_PATH || pathname === `${ADMIN_LOGIN_PATH}/`) {
      return
    }

    if (!db.isReady()) return

    const checkSecurity = () => {
      const clientIp = db.getClientIp()
      const blockedIps = db.getBlockedIps()

      if (blockedIps.includes(clientIp)) {
        window.location.replace('/caixa-preta')
        return
      }

      // Dashboard/admin routes only
      if (!pathname.startsWith(`${ADMIN_LOGIN_PATH}/dashboard`)) return

      const currentUser = db.getActiveUser()
      const roleOk =
        currentUser && ADMIN_ROLES.includes(currentUser.role)
      const sessionOk = hasAdminSession()

      if (!roleOk && !sessionOk) {
        const reason = `Tentativa de acesso não autorizado à rota administrativa: ${pathname}`
        db.blockIp(clientIp, reason)
        window.location.replace('/caixa-preta')
      }
    }

    checkSecurity()
    window.addEventListener('oddvault_db_update', checkSecurity)
    return () => window.removeEventListener('oddvault_db_update', checkSecurity)
  }, [pathname])

  return null
}
