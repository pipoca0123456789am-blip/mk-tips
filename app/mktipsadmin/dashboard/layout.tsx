'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Search, LogOut, ShieldCheck } from 'lucide-react'
import { db } from '@/lib/db'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { adminNavFlat, adminNavGroups } from '@/lib/nav-config'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationCount] = useState(3)

  useEffect(() => {
    const session = localStorage.getItem('oddvault_admin_session')
    if (session === 'true') {
      setIsAdmin(true)
    } else {
      router.push('/mktipsadmin')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('oddvault_admin_session')
    // Keep admin out of the client PWA session
    localStorage.removeItem('oddvault_user_session')
    db.clearActiveUser()
    router.push('/mktipsadmin')
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-emerald-500" />
      </div>
    )
  }

  const sidebarFooter = (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white">
          AM
        </div>
        <div className="truncate">
          <p className="text-xs font-semibold text-white">Admin Master</p>
          <p className="truncate text-[10px] text-zinc-500">Administrador</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-red-500/5 hover:text-red-400"
      >
        <LogOut className="h-4 w-4 text-zinc-500" />
        Sair do Painel
      </button>
    </>
  )

  const header = (
    <>
      <div className="relative min-w-0 flex-1 md:w-96">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-4 text-xs text-white transition-colors focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-white"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Área do Usuário</span>
        </Link>

        <button
          type="button"
          className="relative cursor-pointer rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white"
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>
    </>
  )

  return (
    <DashboardShell
      homeHref="/mktipsadmin/dashboard"
      brandTitle={
        <span className="font-bold tracking-tight text-white">
          MK TIPS
          <span className="ml-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-500">
            ADMIN
          </span>
        </span>
      }
      desktopMenuItems={adminNavFlat}
      mobileNavGroups={adminNavGroups}
      sidebarFooter={sidebarFooter}
      header={header}
      mobileBrandTitle="MK Tips Admin"
      mobileBrandBadge="Painel Admin"
      onLogout={handleLogout}
    >
      {children}
    </DashboardShell>
  )
}
