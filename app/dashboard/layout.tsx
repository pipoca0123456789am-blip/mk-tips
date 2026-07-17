'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Bookmark,
  History,
  BarChart3,
  Coins,
  Bell,
  User,
  CreditCard,
  LifeBuoy,
  Trophy,
  Search,
  Settings,
  ArrowUpRight,
  Sparkles,
  Calendar as CalendarIcon,
  Rocket,
  Gift,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { db, DBUser } from '@/lib/db'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<DBUser | null>(null)
  const [allUsers, setAllUsers] = useState<DBUser[]>([])
  const [search, setSearch] = useState('')
  const [notifications, setNotifications] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleUpdate = () => {
      const activeUser = db.getActiveUser()
      setUser(activeUser)
      setAllUsers(db.getUsers())
      setNotifications(db.getLogs().slice(0, 5))
    }

    const init = async () => {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('oddvault_user_session')
        if (session !== 'true') {
          router.push('/login')
          return
        }
      }
      await db.refresh()
      handleUpdate()
    }

    init()
    window.addEventListener('oddvault_db_update', handleUpdate)
    return () => {
      window.removeEventListener('oddvault_db_update', handleUpdate)
    }
  }, [router])

  // Close drawer on path change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    )
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Tips do Dia', icon: TrendingUp, href: '/dashboard/tips' },
    { label: 'Desafios', icon: Rocket, href: '/dashboard/leveraging' },
    { label: 'VALE TUDO', icon: Trophy, href: '/dashboard/valetudo' },
    { label: 'Minha Carteira', icon: Coins, href: '/dashboard/wallet' },
    { label: 'Indique e Ganhe', icon: Gift, href: '/dashboard/referrals' },
    { label: 'Central de IA', icon: Sparkles, href: '/dashboard/ai-assistant' },
    { label: 'Calendário', icon: CalendarIcon, href: '/dashboard/calendar' },
    { label: 'Favoritas', icon: Bookmark, href: '/dashboard/favorites' },
    { label: 'Histórico', icon: History, href: '/dashboard/history' },
    { label: 'Estatísticas', icon: BarChart3, href: '/dashboard/stats' },
    { label: 'Gestão de Banca', icon: Coins, href: '/dashboard/bankroll' },
    { label: 'Gamificação', icon: Trophy, href: '/dashboard/gamification' },
    { label: 'Notificações', icon: Bell, href: '/dashboard/notifications' },
    { label: 'Minha Conta', icon: User, href: '/dashboard/account' },
    { label: 'Assinatura', icon: CreditCard, href: '/dashboard/subscription' },
    { label: 'Suporte', icon: LifeBuoy, href: '/dashboard/support' }
  ]

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img 
            src="/logo-mktips.png" 
            alt="MK Tips Logo" 
            className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-emerald-500/10 border border-zinc-800"
          />
          <span className="font-bold tracking-tight text-white">MK Tips</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded border border-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
              }`}
            >
              <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-900 space-y-4">
        <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-850">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">{user.plan === 'Free' ? 'TESTE GRÁTIS' : user.plan}</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/20 font-semibold">{user.daysRemaining} dias restando</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(user.daysRemaining / (user.plan === 'Free' ? 7 : 365)) * 100}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-2 bg-zinc-900/20 rounded-lg border border-zinc-900">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white uppercase text-xs">
            {user.name.charAt(0)}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white">{user.name}</p>
            <p className="text-[9px] text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('oddvault_user_session')
            localStorage.removeItem('oddvault_admin_session')
            window.location.href = '/'
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg text-sm font-medium transition-all cursor-pointer border border-transparent"
        >
          <LogOut className="w-4 h-4 text-zinc-500" />
          Sair da Conta
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Drawer (Left sidebar drawer sliding) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50 transform transition-transform duration-300 md:hidden flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-0 -left-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex w-64 bg-zinc-950 border-r border-zinc-900 flex-col shrink-0">
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-4 md:px-6 shrink-0 relative z-20 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 hover:border-zinc-700 rounded-lg transition-all cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="relative w-44 sm:w-64 md:w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {user.role === 'Master' && allUsers.length > 1 && (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-1 text-[10px]">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] hidden md:inline">Simulador:</span>
                <select
                  value={user.id}
                  onChange={(e) => db.setActiveUser(e.target.value)}
                  className="bg-transparent text-white font-bold border-none outline-none focus:ring-0 cursor-pointer text-[10px] pr-5"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id} className="bg-zinc-950 text-white font-bold">
                      {u.name.split(' ')[0]} ({u.role === 'Master' ? 'Admin' : u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 hover:border-zinc-700 rounded-lg transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950" />
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-zinc-950 border border-zinc-850 rounded-lg shadow-2xl p-2 z-50 text-[10px] space-y-1">
                  <div className="p-2 border-b border-zinc-900 font-bold text-white flex justify-between items-center">
                    <span>Notificações</span>
                    <Link href="/dashboard/notifications" onClick={() => setShowDropdown(false)} className="text-[9px] text-emerald-400 hover:underline">Ver todas</Link>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-zinc-900">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="p-2.5 hover:bg-zinc-900/40 space-y-1 text-left">
                          <p className="font-semibold text-zinc-200 leading-snug">{n.message}</p>
                          <span className="text-[8px] text-zinc-500 block">{n.timestamp.replace('T', ' ').split('.')[0]}</span>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-zinc-600">Nenhum alerta recente.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}
