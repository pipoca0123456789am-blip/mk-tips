'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBUser } from '@/lib/db'
import { User, Shield, Key, History } from 'lucide-react'

export default function UserAccountPage() {
  const [user, setUser] = useState<DBUser | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () => {
      if (!db.isReady()) return
      const currentUser = db.getActiveUser()
      setUser(currentUser)
      if (currentUser) {
        setName(currentUser.name || '')
        setPhone(currentUser.phone || '')
        setEmail(currentUser.email || '')
      }
      setLoading(false)
    }

    load()
    window.addEventListener('oddvault_db_update', load)
    return () => window.removeEventListener('oddvault_db_update', load)
  }, [])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const updated = db.getUsers().map(u => {
      if (u.id === user.id) {
        return { ...u, name, phone }
      }
      return u
    })
    db.setUsers(updated)
    db.addLog('System', 'Perfil editado pelo usuário', '127.0.0.1', 'Web App', name)
    alert('Perfil atualizado com sucesso!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#00E08A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-zinc-500 text-xs">
        Nenhum usuário ativo selecionado no simulador ou cadastrado no banco.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Minha Conta</h1>
        <p className="text-sm text-zinc-400">Gerencie informações cadastrais, segurança da conta e logins ativos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile form */}
        <Card className="lg:col-span-2 border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Informações Básicas</CardTitle>
            <CardDescription>Edite suas informações visíveis.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveProfile}>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-955 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">E-mail (Não editável)</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-zinc-950/40 border border-zinc-850 rounded-lg p-2.5 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (00) 00000-0000"
                    className="w-full bg-zinc-955 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Salvar Alterações
              </button>
            </CardContent>
          </form>
        </Card>

        {/* Security / Info */}
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Segurança & Plano</CardTitle>
            <CardDescription>Status geral da sua credencial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
              <span className="text-zinc-400">Plano Atual</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold">{user.plan}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
              <span className="text-zinc-400">Tipo de Conta</span>
              <span className="text-white font-medium">{user.role}</span>
            </div>
            <div className="flex justify-between items-center pb-2.5">
              <span className="text-zinc-400">Status</span>
              <span className="text-emerald-400 font-medium">Ativo</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
