'use client'

import React, { memo, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { MobileDrawer } from '@/components/dashboard/mobile-drawer'
import { DesktopSidebar } from '@/components/dashboard/desktop-sidebar'
import type { NavGroup, NavItem } from '@/lib/nav-config'
import type { DBUser } from '@/lib/db'

type DashboardShellProps = {
  homeHref: string
  brandTitle: React.ReactNode
  desktopMenuItems: NavItem[]
  mobileNavGroups: NavGroup[]
  sidebarFooter: React.ReactNode
  header: React.ReactNode
  children: React.ReactNode
  mobileUser?: DBUser | null
  mobileBrandTitle?: string
  mobileBrandBadge?: string
  onLogout: () => void
}

function DashboardShellInner({
  homeHref,
  brandTitle,
  desktopMenuItems,
  mobileNavGroups,
  sidebarFooter,
  header,
  children,
  mobileUser,
  mobileBrandTitle,
  mobileBrandBadge,
  onLogout,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-black text-zinc-100 md:flex-row">
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navGroups={mobileNavGroups}
        user={mobileUser}
        brandTitle={mobileBrandTitle}
        brandBadge={mobileBrandBadge}
        onLogout={onLogout}
      />

      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-900 bg-zinc-950 md:flex">
        <DesktopSidebar
          homeHref={homeHref}
          brandTitle={brandTitle}
          menuItems={desktopMenuItems}
          footer={sidebarFooter}
        />
      </aside>

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 md:blur-0 md:brightness-100 ${
          mobileOpen
            ? 'pointer-events-none overflow-hidden blur-sm brightness-75 md:pointer-events-auto md:overflow-auto'
            : ''
        }`}
        aria-hidden={mobileOpen}
      >
        <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b border-zinc-900 bg-zinc-950 px-4 md:px-6">
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="shrink-0 cursor-pointer rounded-lg border border-zinc-850 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-zinc-700 hover:text-white md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2 md:gap-4">{header}</div>
        </header>

        <main className="dashboard-main flex-1 overflow-x-hidden overflow-y-auto bg-zinc-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export const DashboardShell = memo(DashboardShellInner)
