'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  Coins, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Megaphone,
  LogOut,
  Sliders,
  ChevronDown
} from 'lucide-react'
import { db, DBUser } from '@/lib/db'

export default function TipsterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<DBUser | null>(null)
  const [allUsers, setAllUsers] = useState<DBUser[]>([])

  useEffect(() => {
    const handleUpdate = () => {
      if (!db.isReady()) return
      const activeUser = db.getActiveUser()
      setUser(activeUser)
      setAllUsers(db.getUsers())
      
      // Enforce access control: only Tipsters allowed
      if (activeUser.role !== 'Tipster') {
        if (activeUser.role === 'Master') {
          router.push('/mktipsadmin/dashboard')
        } else {
          router.push('/dashboard')
        }
      }
    }

    handleUpdate()
    window.addEventListener('oddvault_db_update', handleUpdate)
    return () => {
      window.removeEventListener('oddvault_db_update', handleUpdate)
    }
  }, [router])

  if (!user || user.role !== 'Tipster') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6">
          <Link href="/tipster/dashboard" className="flex items-center gap-2 mb-8">
            <img 
              src="/logo-mktips.png" 
              alt="MK Tips Logo" 
              className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-emerald-500/10 border border-zinc-800"
            />
            <div className="flex flex-col">
              <span className="text-sm font-black text-white leading-none font-bold">MK TIPS</span>
              <span className="text-[8px] font-bold text-emerald-400 tracking-widest mt-1">PAINEL DO ANALISTA</span>
            </div>
          </Link>

          <nav className="space-y-1">
            <Link
              href="/tipster/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              <BarChart3 className="w-4 h-4" />
              Painel Geral
            </Link>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-zinc-900 space-y-4">
          <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-850">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-zinc-500 font-extrabold uppercase">Tipster ID</span>
              <span className="text-[9px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-850 font-semibold">{user.tipsterId}</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-2">Você está visualizando apenas os seus dados e os seus clientes.</p>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 bg-zinc-900/20 rounded-lg border border-zinc-900">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold uppercase text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white">{user.name}</p>
              <p className="text-[9px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 shrink-0 z-20">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Painel do Tipster</h2>
          </div>

          <div className="flex items-center gap-4">
            {allUsers.length > 1 && (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-850 rounded-lg px-2.5 py-1 text-[10px]">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8px]">Simulador:</span>
                <select
                  value={user.id}
                  onChange={(e) => db.setActiveUser(e.target.value)}
                  className="bg-transparent text-white font-bold border-none outline-none focus:ring-0 cursor-pointer text-[10px] pr-5"
                >
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id} className="bg-zinc-950 text-white font-bold">
                      {u.name} ({u.role === 'Master' ? 'Super Admin' : u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
