'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { db } from '@/lib/db'

export function SecurityGuard() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!db.isReady()) return

    const checkSecurity = () => {
      const clientIp = db.getClientIp()
      const blockedIps = db.getBlockedIps()

      // 1. If IP is blocked, send to Black Box (unless they are already there)
      if (blockedIps.includes(clientIp)) {
        if (pathname !== '/caixa-preta') {
          window.location.replace('/caixa-preta')
        }
        return
      }

      // 2. Intrusion Detection on Admin Routes (/mktipsadmin)
      if (pathname.startsWith('/mktipsadmin')) {
        const currentUser = db.getActiveUser()
        const isAuthorized = currentUser && ['Master', 'Admin', 'Gerente', 'Suporte', 'Financeiro', 'Moderador'].includes(currentUser.role)

        if (!isAuthorized) {
          // Automatic intrusion block!
          const reason = `Tentativa de acesso não autorizado à rota administrativa: ${pathname}`
          db.blockIp(clientIp, reason)
          window.location.replace('/caixa-preta')
        }
      }
    }

    checkSecurity()

    // Listen to database changes (e.g. if IP gets blocked in settings live)
    window.addEventListener('oddvault_db_update', checkSecurity)
    return () => window.removeEventListener('oddvault_db_update', checkSecurity)
  }, [pathname, router])

  return null
}
