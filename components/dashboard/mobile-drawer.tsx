'use client'

import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import { X, LogOut, CreditCard } from 'lucide-react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { isNavActive, type NavGroup } from '@/lib/nav-config'
import type { DBUser } from '@/lib/db'

type MobileDrawerProps = {
  open: boolean
  onClose: () => void
  navGroups: NavGroup[]
  user?: DBUser | null
  brandTitle?: string
  brandBadge?: string
  onLogout: () => void
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
  onNavigate: () => void
}) {
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null)

  const handleTouch = (e: React.TouchEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
      id: Date.now(),
    })
    setTimeout(() => setRipple(null), 400)
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      onTouchStart={handleTouch}
      className={`relative flex min-h-[48px] items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all active:scale-[0.98] ${
        active
          ? 'border border-emerald-500/30 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
          : 'border border-transparent text-zinc-400 hover:bg-zinc-900/80 hover:text-white'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-emerald-300" />
      )}
      <Icon className={`relative z-10 h-[18px] w-[18px] shrink-0 ${active ? 'text-white' : 'text-zinc-500'}`} />
      <span className="relative z-10">{label}</span>
      {ripple && (
        <span
          className="pointer-events-none absolute h-8 w-8 animate-ping rounded-full bg-white/25"
          style={{ left: ripple.x - 16, top: ripple.y - 16 }}
        />
      )}
    </Link>
  )
}

function UserPremiumCard({ user }: { user: DBUser }) {
  const planLabel = user.plan === 'Free' ? 'Teste Grátis' : user.plan
  const progress = Math.min(100, (user.daysRemaining / (user.plan === 'Free' ? 7 : 365)) * 100)

  return (
    <div className="mx-3 mt-3 shrink-0 rounded-[18px] border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-black">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              {planLabel}
            </span>
            <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
              {user.role}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${
                user.status === 'Ativo'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/20 bg-red-500/10 text-red-400'
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>Dias restantes</span>
          <span className="font-semibold text-emerald-400">{user.daysRemaining} dias</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <Link
        href="/dashboard/subscription"
        className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-400 transition active:scale-[0.98]"
      >
        <CreditCard className="h-3.5 w-3.5" />
        Gerenciar Plano
      </Link>
    </div>
  )
}

function MobileDrawerInner({
  open,
  onClose,
  navGroups,
  user,
  brandTitle = 'MK Tips',
  brandBadge,
  onLogout,
}: MobileDrawerProps) {
  const pathname = usePathname()
  const panelRef = useRef<HTMLElement>(null)
  const touchStartX = useRef(0)

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta < -60) onClose()
  }

  const onNavigate = useCallback(() => onClose(), [onClose])

  if (!open) return null

  return createPortal(
    <>
      <div
        role="presentation"
        aria-hidden
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md md:hidden"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed inset-y-0 left-0 z-[101] flex w-[80%] max-w-[340px] flex-col border-r border-zinc-800/80 bg-zinc-950 shadow-2xl transition-transform duration-300 ease-out md:hidden"
      >
        {/* Header — max 70px */}
        <header className="flex h-[70px] max-h-[70px] shrink-0 items-center justify-between border-b border-zinc-900 px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="/logo-mktips.png"
              alt="MK Tips"
              className="h-9 w-9 rounded-xl border border-zinc-800 object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{brandTitle}</p>
              {brandBadge && (
                <span className="text-[10px] font-semibold text-emerald-400">{brandBadge}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition active:scale-95 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {user && <UserPremiumCard user={user} />}

        {/* Scrollable nav */}
        <nav className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.title && (
                <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href + item.label}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item.href)}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
              {gi < navGroups.length - 1 && (
                <div className="mx-2 mt-4 border-t border-zinc-900/80" />
              )}
            </div>
          ))}
        </nav>

        {/* Fixed footer */}
        <footer className="shrink-0 border-t border-zinc-900 bg-zinc-950/95 p-3 backdrop-blur-sm">
          {user ? (
            <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-zinc-900 bg-zinc-900/40 px-3 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{user.name}</p>
                <p className="truncate text-[10px] text-zinc-500">{user.email}</p>
                <p className="text-[9px] font-medium text-emerald-400">{user.plan}</p>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 text-sm font-medium text-red-400 transition active:scale-[0.98] hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </footer>
      </aside>
    </>,
    document.body,
  )
}

export const MobileDrawer = memo(MobileDrawerInner)
