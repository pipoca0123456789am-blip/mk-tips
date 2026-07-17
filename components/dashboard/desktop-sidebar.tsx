'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isNavActive, type NavItem } from '@/lib/nav-config'

type DesktopSidebarProps = {
  homeHref: string
  brandTitle: React.ReactNode
  menuItems: NavItem[]
  footer: React.ReactNode
  closeButton?: React.ReactNode
}

function DesktopSidebarInner({
  homeHref,
  brandTitle,
  menuItems,
  footer,
  closeButton,
}: DesktopSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-900 p-6">
        <Link href={homeHref} className="flex items-center gap-2">
          <img
            src="/logo-mktips.png"
            alt="MK Tips Logo"
            className="h-8 w-8 rounded-lg border border-zinc-800 object-cover shadow-lg shadow-emerald-500/10"
          />
          {brandTitle}
        </Link>
        {closeButton}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const isActive = isNavActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all group ${
                isActive
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                  : 'border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <item.icon
                className={`h-4 w-4 transition-colors ${isActive ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-4 border-t border-zinc-900 p-4">{footer}</div>
    </>
  )
}

export const DesktopSidebar = memo(DesktopSidebarInner)
