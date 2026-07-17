'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Award,
  Radio,
  BookOpen,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Search,
  Database,
  ShieldCheck,
  Building,
  Sparkles,
  Rocket,
  Gift,
  Menu,
  X,
  Trophy,
  Coins,
  MessageCircle
} from 'lucide-react'
import { db } from '@/lib/db'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationCount, setNotificationCount] = useState(3)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Session validation
    const session = localStorage.getItem('oddvault_admin_session')
    if (session === 'true') {
      setIsAdmin(true)
    } else {
      router.push('/mktipsadmin')
    }
  }, [router])

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('oddvault_admin_session')
    router.push('/mktipsadmin')
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    )
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/mktipsadmin/dashboard' },
    { label: 'CRM & Funis', icon: TrendingUp, href: '/mktipsadmin/dashboard/crm' },
    { label: 'WhatsApp CRM', icon: MessageCircle, href: '/mktipsadmin/dashboard/crm/whatsapp' },
    { label: 'Usuários', icon: Users, href: '/mktipsadmin/dashboard/users' },
    { label: 'Tipsters', icon: Award, href: '/mktipsadmin/dashboard/tipsters' },
    { label: 'Tips Control', icon: Radio, href: '/mktipsadmin/dashboard/tips' },
    { label: 'Casas de Apostas', icon: Building, href: '/mktipsadmin/dashboard/bookmakers' },
    { label: 'Alavancagem', icon: Rocket, href: '/mktipsadmin/dashboard/leveraging' },
    { label: 'VALE TUDO', icon: Trophy, href: '/mktipsadmin/dashboard/valetudo' },
    { label: 'Carteiras & Saques', icon: Coins, href: '/mktipsadmin/dashboard/wallet' },
    { label: 'Indique e Ganhe', icon: Gift, href: '/mktipsadmin/dashboard/referrals' },
    { label: 'Painel de IA', icon: Sparkles, href: '/mktipsadmin/dashboard/ai-panel' },
    { label: 'Segurança & Configs', icon: Settings, href: '/mktipsadmin/dashboard/settings' }
  ]

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
        <Link href="/mktipsadmin/dashboard" className="flex items-center gap-2">
          <img 
            src="/logo-mktips.png" 
            alt="MK Tips Logo" 
            className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-emerald-500/10 border border-zinc-800"
          />
          <span className="font-bold tracking-tight text-white">
            MK TIPS 
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 ml-1">ADMIN</span>
          </span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded border border-zinc-850"
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
        <div className="flex items-center gap-3 px-3 py-2 bg-zinc-900/40 rounded-lg border border-zinc-900">
          <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-semibold text-xs text-white">
            AM
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white">Admin Master</p>
            <p className="text-[10px] text-zinc-550 truncate">mktips@gmail.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg text-sm font-medium transition-all cursor-pointer border border-transparent"
        >
          <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
          Sair do Painel
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 z-50 transform transition-transform duration-300 md:hidden flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-0 -left-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Desktop Fixed Sidebar */}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 border border-zinc-850 hover:border-zinc-700 bg-zinc-900 rounded-lg"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Área do Usuário</span>
            </Link>

            <button className="relative p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 hover:border-zinc-700 rounded-lg transition-all cursor-pointer">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  )
}
