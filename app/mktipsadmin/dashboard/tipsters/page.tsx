'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBTipster } from '@/lib/db'
import { Plus, Check, Award, Eye, Settings, Ban, ArrowUpRight } from 'lucide-react'

export default function AdminTipstersPage() {
  const router = useRouter()
  const [tipsters, setTipsters] = useState<DBTipster[]>([])
  const [selectedTipster, setSelectedTipster] = useState<DBTipster | null>(null)
  
  // Registration form
  const [showAddModal, setShowAddModal] = useState(false)
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [bio, setBio] = useState('')
  const [badge, setBadge] = useState('Pro')

  useEffect(() => {
    setTipsters(db.getTipsters())
  }, [])

  const handleBlockUnblock = (tipsterId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Ativo' ? 'Bloqueado' : 'Ativo'
    const updated = tipsters.map(t => {
      if (t.id === tipsterId) {
        db.addAuditLog('Admin Master', 'CHANGE_TIPSTER_STATUS', t.id, t.status, nextStatus)
        db.addLog('Audit', `Status do tipster ${t.name} alterado para ${nextStatus}`, '189.120.45.10', 'MacBook Pro', 'Admin Master')
        return { ...t, status: nextStatus }
      }
      return t
    })
    setTipsters(updated)
    db.setTipsters(updated)
  }

  const handleAcessarPainel = (tipsterId: string) => {
    const users = db.getUsers()
    let tipsterUser = users.find(u => u.role === 'Tipster' && u.tipsterId === tipsterId)
    
    if (!tipsterUser) {
      const tipsterDetail = tipsters.find(t => t.id === tipsterId)
      if (!tipsterDetail) {
        alert('Tipster não encontrado no sistema.')
        return
      }

      // Create simulated user on the fly if missing from localStorage cache
      const newU: DBUser = {
        id: crypto.randomUUID(),
        name: tipsterDetail.name,
        email: `${tipsterDetail.name.toLowerCase().replace(/[^a-z]/g, '')}@mktips.com`,
        phone: '+55 (11) 99999-9999',
        city: 'São Paulo',
        country: 'Brasil',
        language: 'pt-BR',
        plan: 'VIP Anual',
        role: 'Tipster',
        status: 'Ativo',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        lastLoginIp: '127.0.0.1',
        device: 'Desktop',
        os: 'Windows',
        browser: 'Chrome',
        daysRemaining: 365,
        revenueGenerated: 0,
        totalPaid: 0,
        lastPaymentDate: '-',
        bankroll: 1000,
        bankrollCurrency: 'R$',
        roiIndividual: 0,
        tipsterId: tipsterId
      }

      const updatedUsers = [...users, newU]
      db.setUsers(updatedUsers)
      tipsterUser = newU
    }

    db.setActiveUser(tipsterUser.id)
    router.push('/tipster/dashboard')
  }

  const handleAddTipster = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !specialty) return

    const newTipster: DBTipster = {
      id: `t-${Date.now()}`,
      name,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
      specialty,
      sports: ['Futebol'],
      markets: ['1X2', 'Over/Under'],
      bio,
      socials: { twitter: '@' + name.toLowerCase().replace(/ /g, '') },
      status: 'Ativo',
      verified: true,
      badge,
      color: badge === 'Pro' ? '#3B82F6' : '#10B981',
      stats: {
        tipsCount: 0,
        greens: 0,
        reds: 0,
        voids: 0,
        roi: 0,
        yield: 0,
        profit: 0,
        avgStake: 1.0,
        avgOdd: 1.80,
        accuracy: 0,
        maxGreen: 0,
        maxRed: 0,
        currentStreak: 0
      }
    }

    const updated = [...tipsters, newTipster]
    setTipsters(updated)
    db.setTipsters(updated)
    db.addAuditLog('Admin Master', 'MANUAL_CREATE_TIPSTER', newTipster.id, '', name)

    // Reset
    setName('')
    setSpecialty('')
    setBio('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Gestão de Tipsters</h1>
          <p className="text-sm text-zinc-400">Gerencie a equipe de analistas, permissões de publicação e acompanhe o ROI individual.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-3.5 h-3.5" />
          Cadastrar Analista
        </button>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tipsters.map(tipster => (
          <Card key={tipster.id} className="border-zinc-850 bg-zinc-900/30 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <img src={tipster.avatar} alt={tipster.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {tipster.name}
                    {tipster.verified && (
                      <span className="w-3.5 h-3.5 bg-emerald-500 text-black rounded-full flex items-center justify-center text-[8px] font-extrabold" title="Analista Verificado">
                        ✓
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-zinc-500">{tipster.specialty}</p>
                </div>
              </div>
              <span 
                className="px-2 py-0.5 rounded text-[9px] font-bold border"
                style={{ borderColor: `${tipster.color}40`, color: tipster.color, backgroundColor: `${tipster.color}10` }}
              >
                {tipster.badge}
              </span>
            </CardHeader>

            <CardContent className="py-2 space-y-3">
              <p className="text-zinc-400 text-xs line-clamp-2 italic">"{tipster.bio || 'Sem biografia disponível.'}"</p>
              
              {/* Key performance metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-850 text-center text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 font-semibold block uppercase">ROI</span>
                  <span className="font-bold text-emerald-400">+{tipster.stats.roi}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Precisão</span>
                  <span className="font-bold text-white">{tipster.stats.accuracy}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Tips</span>
                  <span className="font-bold text-zinc-300">{tipster.stats.tipsCount}</span>
                </div>
              </div>
            </CardContent>

            <div className="p-4 border-t border-zinc-850 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTipster(tipster)}
                  className="flex-1 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => handleBlockUnblock(tipster.id, tipster.status)}
                  className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer ${
                    tipster.status === 'Ativo' 
                      ? 'border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10' 
                      : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {tipster.status === 'Ativo' ? 'Bloquear' : 'Liberar'}
                </button>
              </div>
              <button
                onClick={() => handleAcessarPainel(tipster.id)}
                className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                Acessar Painel do Tipster
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail viewer overlay side/bottom */}
      {selectedTipster && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row justify-between items-start">
              <div className="flex gap-4">
                <img src={selectedTipster.avatar} className="w-16 h-16 rounded-full object-cover border border-zinc-800" />
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-1.5">{selectedTipster.name}</h2>
                  <p className="text-zinc-500 text-xs">{selectedTipster.specialty}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1">ID: {selectedTipster.id} | Status: <strong className="text-emerald-400">{selectedTipster.status}</strong></p>
                </div>
              </div>
              <button onClick={() => setSelectedTipster(null)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">Fechar</button>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-850">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Ganhos Gerais (Unidades/Lucro)</span>
                  <p className="text-xl font-bold text-emerald-400 mt-1">+{selectedTipster.stats.profit} unidades</p>
                </div>
                <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-850">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Yield (%)</span>
                  <p className="text-xl font-bold text-white mt-1">+{selectedTipster.stats.yield}%</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-zinc-900/30 p-2 rounded border border-zinc-850"><span className="text-emerald-500 font-bold text-base block">{selectedTipster.stats.greens}</span><span className="text-[9px] text-zinc-500 uppercase">Greens</span></div>
                <div className="bg-zinc-900/30 p-2 rounded border border-zinc-850"><span className="text-red-500 font-bold text-base block">{selectedTipster.stats.reds}</span><span className="text-[9px] text-zinc-500 uppercase">Reds</span></div>
                <div className="bg-zinc-900/30 p-2 rounded border border-zinc-850"><span className="text-zinc-400 font-bold text-base block">{selectedTipster.stats.voids}</span><span className="text-[9px] text-zinc-500 uppercase">Voids</span></div>
                <div className="bg-zinc-900/30 p-2 rounded border border-zinc-850"><span className="text-zinc-300 font-bold text-base block">{selectedTipster.stats.currentStreak}</span><span className="text-[9px] text-zinc-500 uppercase">Streak atual</span></div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Esportes Cobertos</span>
                <div className="flex gap-1.5 mt-1.5">
                  {selectedTipster.sports.map(s => <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 text-[10px]">{s}</span>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Cadastrar Analista</CardTitle>
              <CardDescription>Cadastre um novo tipster com permissões de publicação.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddTipster}>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="E.g. Rodrigo Faro"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Especialidade / Liga Principal</label>
                  <input
                    type="text"
                    required
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value)}
                    placeholder="E.g. Fórmula 1 & Stock Car"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Biografia</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Bio rápida exibida no card do usuário..."
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:border-emerald-500 h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Badge Especial</label>
                  <select
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none"
                  >
                    <option value="Pro">Pro (Basquete/Tênis)</option>
                    <option value="Elite">Elite (Futebol)</option>
                    <option value="Especialista">Especialista (Outros)</option>
                  </select>
                </div>
              </CardContent>
              <div className="p-6 border-t border-zinc-850 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold rounded hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded cursor-pointer"
                >
                  Confirmar Analista
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
