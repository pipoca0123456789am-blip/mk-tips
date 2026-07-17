'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart } from '@/components/ui/charts'
import { 
  db, 
  DBUser, 
  DBTip, 
  DBTipster 
} from '@/lib/db'
import { 
  TrendingUp, 
  Users, 
  Coins, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  UserMinus, 
  UserCheck, 
  Flame, 
  Share2, 
  Compass, 
  Megaphone,
  Palette,
  Sliders,
  DollarSign
} from 'lucide-react'

type DashboardTab = 'dashboard' | 'clientes' | 'tips' | 'financeiro' | 'marketing' | 'configuracoes'

export default function TipsterDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard')
  const [user, setUser] = useState<DBUser | null>(null)
  const [tipsterProfile, setTipsterProfile] = useState<DBTipster | null>(null)

  // Local Data states
  const [clients, setClients] = useState<DBUser[]>([])
  const [tips, setTips] = useState<DBTip[]>([])
  const [searchClient, setSearchClient] = useState('')
  const [searchTip, setSearchTip] = useState('')

  // Create Tip Form states
  const [showAddTip, setShowAddTip] = useState(false)
  const [newSport, setNewSport] = useState('Futebol')
  const [newLeague, setNewLeague] = useState('UEFA Champions League')
  const [newMatch, setNewMatch] = useState('')
  const [newMarket, setNewMarket] = useState('Vencedor da Partida (1X2)')
  const [newType, setNewType] = useState('1')
  const [newOdd, setNewOdd] = useState(1.90)
  const [newStake, setNewStake] = useState(2.0)
  const [newConfidence, setNewConfidence] = useState(7)
  const [newJustification, setNewJustification] = useState('')
  const [newBookmaker, setNewBookmaker] = useState('Betano')
  const [newAffiliate, setNewAffiliate] = useState('https://www.betano.com')

  // Marketing Form states
  const [showAddCoupon, setShowAddCoupon] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState('10%')

  // Profile configuration states
  const [profName, setProfName] = useState('')
  const [profBio, setProfBio] = useState('')
  const [profTelegram, setProfTelegram] = useState('')
  const [profInstagram, setProfInstagram] = useState('')
  const [colorMain, setColorMain] = useState('#10B981')

  useEffect(() => {
    const handleLoad = () => {
      const activeUser = db.getActiveUser()
      setUser(activeUser)

      if (activeUser && activeUser.tipsterId) {
        // Load tipster profile details
        const profiles = db.getTipsters()
        const currentProfile = profiles.find(p => p.id === activeUser.tipsterId) || profiles[0]
        setTipsterProfile(currentProfile)
        setProfName(currentProfile.name)
        setProfBio(currentProfile.bio)
        setProfTelegram(currentProfile.socials.telegram || '')
        setProfInstagram(currentProfile.socials.twitter || '')
        setColorMain(currentProfile.color)

        // Load only clients belonging to this Tipster
        const allUsers = db.getUsers()
        const filteredClients = allUsers.filter(u => u.role === 'User' && u.tipsterId === activeUser.tipsterId)
        setClients(filteredClients)

        // Load only tips created by this Tipster
        const allTips = db.getTips()
        const filteredTips = allTips.filter(t => t.tipsterId === activeUser.tipsterId)
        setTips(filteredTips)
      }
    }

    handleLoad()
    window.addEventListener('oddvault_db_update', handleLoad)
    return () => {
      window.removeEventListener('oddvault_db_update', handleLoad)
    }
  }, [])

  if (!user || !tipsterProfile) return null

  // Calculate tip stats for dashboard
  const greensCount = tips.filter(t => t.status === 'Green').length
  const redsCount = tips.filter(t => t.status === 'Red').length
  const voidsCount = tips.filter(t => t.status === 'Void').length
  const totalTips = tips.length
  const precisionRate = totalTips > 0 ? Math.round((greensCount / (greensCount + redsCount || 1)) * 100) : 0
  const activeClientsCount = clients.filter(c => c.status === 'Ativo').length
  const totalRevenue = clients.reduce((acc, c) => acc + c.totalPaid, 0)

  // Add tip logic
  const handleCreateTip = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMatch) return

    const newTip: DBTip = {
      id: `tip-${Date.now()}`,
      sport: newSport,
      league: newLeague,
      match: newMatch,
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      market: newMarket,
      type: newType,
      odd: Number(newOdd),
      stake: Number(newStake),
      confidence: Number(newConfidence),
      recommendedBookmaker: newBookmaker,
      affiliateUrl: newAffiliate,
      tipsterId: user.tipsterId || 't1',
      tipsterName: tipsterProfile.name,
      justification: newJustification,
      riskIndicators: ['Volatilidade de odds'],
      estimatedProbability: 55,
      ev: 5,
      views: 0,
      favoritesCount: 0,
      status: 'Pendente',
      oddsComparison: [
        { bookmaker: newBookmaker, odd: Number(newOdd) },
        { bookmaker: 'Bet365', odd: Number(newOdd) - 0.05 }
      ]
    }

    const updatedTips = [newTip, ...db.getTips()]
    db.setTips(updatedTips)
    db.addLog('System', `Tipster ${tipsterProfile.name} publicou nova tip: ${newMatch}`)
    alert('Nova tip publicada com sucesso!')
    setShowAddTip(false)
    setNewMatch('')
    setNewJustification('')
  }

  // Toggle client status
  const handleToggleClientStatus = (clientId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Ativo' ? 'Bloqueado' : 'Ativo'
    const updatedUsers = db.getUsers().map(u => {
      if (u.id === clientId) {
        return { ...u, status: nextStatus as any }
      }
      return u
    })
    db.setUsers(updatedUsers)
    db.addLog('System', `Status do cliente atualizado para ${nextStatus}`)
  }

  // Toggle tip result (Green/Red/Void)
  const handleResolveTip = (tipId: string, result: 'Green' | 'Red' | 'Void') => {
    const updatedTips = db.getTips().map(t => {
      if (t.id === tipId) {
        return { ...t, status: result }
      }
      return t
    })
    db.setTips(updatedTips)
    db.addLog('System', `Resultado da tip ${tipId} definido como ${result}`)
  }

  // Update profile configurations
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedTipsters = db.getTipsters().map(t => {
      if (t.id === tipsterProfile.id) {
        return {
          ...t,
          name: profName,
          bio: profBio,
          color: colorMain,
          socials: {
            ...t.socials,
            telegram: profTelegram,
            twitter: profInstagram
          }
        }
      }
      return t
    })
    db.setTipsters(updatedTipsters)
    alert('Configurações do perfil salvas com sucesso!')
  }

  const filteredClientsList = clients.filter(c => 
    c.name.toLowerCase().includes(searchClient.toLowerCase()) ||
    c.email.toLowerCase().includes(searchClient.toLowerCase())
  )

  const filteredTipsList = tips.filter(t => 
    t.match.toLowerCase().includes(searchTip.toLowerCase()) ||
    t.league.toLowerCase().includes(searchTip.toLowerCase())
  )

  const simulatedRevenueData = [
    { label: 'Semana 1', value: Math.round(totalRevenue * 0.4) },
    { label: 'Semana 2', value: Math.round(totalRevenue * 0.6) },
    { label: 'Semana 3', value: Math.round(totalRevenue * 0.8) },
    { label: 'Semana 4', value: totalRevenue }
  ]

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-900/30 p-6 rounded-xl border border-zinc-850">
        <div className="flex gap-4 items-center">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg"
            style={{ backgroundColor: colorMain }}
          >
            {profName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              {profName} 
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Tipster Pro</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1 max-w-md truncate">{profBio || 'Especialista em análises de valor.'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a 
            href={`/tipster/${tipsterProfile.id}`}
            target="_blank"
            className="px-4 py-2 border border-zinc-850 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Ver Landing Page Pública
          </a>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-zinc-900">
        {(['dashboard', 'clientes', 'tips', 'financeiro', 'marketing', 'configuracoes'] as DashboardTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-t-lg font-bold text-xs capitalize transition-all cursor-pointer shrink-0 border-b-2 -mb-[2px] ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Tab Renderers */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics grids */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-zinc-850 bg-zinc-900/20">
              <CardContent className="p-4 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Clientes Ativos</span>
                <h2 className="text-2xl font-black text-white">{activeClientsCount}</h2>
                <span className="text-[9px] text-zinc-500 block">Total de {clients.length} cadastrados</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-850 bg-zinc-900/20">
              <CardContent className="p-4 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Receita Total</span>
                <h2 className="text-2xl font-black text-emerald-400">R$ {totalRevenue.toFixed(2)}</h2>
                <span className="text-[9px] text-zinc-500 block">Faturamento direto</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-850 bg-zinc-900/20">
              <CardContent className="p-4 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Tips Publicadas</span>
                <h2 className="text-2xl font-black text-white">{totalTips}</h2>
                <span className="text-[9px] text-zinc-500 block">{tips.filter(t => t.status === 'Pendente').length} pendentes</span>
              </CardContent>
            </Card>
            <Card className="border-zinc-850 bg-zinc-900/20">
              <CardContent className="p-4 space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Assertividade</span>
                <h2 className="text-2xl font-black text-emerald-400">{precisionRate}%</h2>
                <span className="text-[9px] text-zinc-500 block">{greensCount} Greens | {redsCount} Reds</span>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue evolution chart */}
            <Card className="lg:col-span-2 border-zinc-850 bg-zinc-950">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">Faturamento Acumulado (R$)</CardTitle>
                  <CardDescription>Crescimento financeiro das assinaturas sob sua gestão</CardDescription>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <AreaChart data={simulatedRevenueData} height={200} color={colorMain} />
                </div>
              </CardContent>
            </Card>

            {/* General performance overview stats */}
            <Card className="border-zinc-850 bg-zinc-900/30 flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-base font-bold">Desempenho Estatístico</CardTitle>
                <CardDescription>Resumo de ROI, Yield e sequências de greens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="divide-y divide-zinc-900">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 font-semibold">Retorno sobre Investimento (ROI)</span>
                    <span className="font-bold text-emerald-400">+{tipsterProfile.stats.roi}%</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 font-semibold">Yield Histórico</span>
                    <span className="font-bold text-emerald-400">+{tipsterProfile.stats.yield}%</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 font-semibold">Média de Cotações</span>
                    <span className="font-bold text-white">Odd {tipsterProfile.stats.avgOdd}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-zinc-500 font-semibold">Sequência Atual</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current text-amber-500 animate-pulse" />
                      +{tipsterProfile.stats.currentStreak} Greens
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'clientes' && (
        <Card className="border-zinc-850 bg-zinc-900/20">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold">Gerenciamento de Clientes Vinculados</CardTitle>
              <CardDescription>Pesquise, gerencie observações e gerencie acessos de seus assinantes.</CardDescription>
            </div>
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar cliente..."
                value={searchClient}
                onChange={e => setSearchClient(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-emerald-500"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 font-semibold">
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Plano</th>
                    <th className="p-4">Total Pago</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  {filteredClientsList.length > 0 ? (
                    filteredClientsList.map(client => (
                      <tr key={client.id} className="hover:bg-zinc-900/20">
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-white">{client.name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{client.email}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">{client.plan}</td>
                        <td className="p-4 text-emerald-400 font-bold">R$ {client.totalPaid.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            client.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleClientStatus(client.id, client.status)}
                            className={`px-3 py-1.5 rounded font-bold text-[10px] cursor-pointer inline-flex items-center gap-1 transition-colors ${
                              client.status === 'Ativo'
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {client.status === 'Ativo' ? (
                              <>
                                <UserMinus className="w-3.5 h-3.5" />
                                Bloquear
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Liberar
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500 font-semibold">Nenhum cliente vinculado encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-850">
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar tips..."
                value={searchTip}
                onChange={e => setSearchTip(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => setShowAddTip(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-lg shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" />
              Criar Nova Tip
            </button>
          </div>

          {/* Tips List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTipsList.length > 0 ? (
              filteredTipsList.map(tip => (
                <Card key={tip.id} className="border-zinc-850 bg-gradient-to-b from-zinc-900/30 to-black flex flex-col justify-between">
                  <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-zinc-850/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold uppercase tracking-wider">{tip.sport}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">{tip.league}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5 leading-snug">{tip.match}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      tip.status === 'Green' ? 'bg-emerald-500/15 text-emerald-400' : tip.status === 'Red' ? 'bg-red-500/15 text-red-400' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {tip.status}
                    </span>
                  </CardHeader>
                  <CardContent className="py-4 space-y-4 text-xs">
                    <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-850 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">Mercado</span>
                        <h4 className="font-bold text-white mt-0.5">{tip.market}</h4>
                        <p className="text-[10px] text-zinc-400">Entrada: {tip.type}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase">Odd Principal</span>
                        <p className="text-xl font-black text-emerald-400 mt-0.5">Odd {tip.odd}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase block">Justificativa da entrada</span>
                      <p className="text-zinc-400 italic text-[11px]">"{tip.justification}"</p>
                    </div>
                  </CardContent>
                  
                  {/* Resolve Tip buttons */}
                  {tip.status === 'Pendente' && (
                    <div className="p-4 border-t border-zinc-850/50 flex gap-2 bg-zinc-950/40">
                      <button
                        onClick={() => handleResolveTip(tip.id, 'Green')}
                        className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold rounded text-[10px] cursor-pointer flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Definir Green
                      </button>
                      <button
                        onClick={() => handleResolveTip(tip.id, 'Red')}
                        className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded text-[10px] cursor-pointer flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Definir Red
                      </button>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center bg-zinc-900/10 rounded-xl border border-zinc-850 text-zinc-500 font-bold">Nenhuma tip ativa criada por você.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'financeiro' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-zinc-850 bg-gradient-to-br from-zinc-900/40 to-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Faturamento do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-black text-white">R$ {(totalRevenue * 0.7).toFixed(2)}</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Estimativa de repasse MK TIPS (70%)</p>
              </CardContent>
            </Card>
            <Card className="border-zinc-850 bg-gradient-to-br from-zinc-900/40 to-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Conversão de Checkout</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-black text-emerald-400">82.4%</h2>
                <p className="text-[10px] text-zinc-500 mt-1">PIX gerados vs pagos</p>
              </CardContent>
            </Card>
            <Card className="border-zinc-850 bg-gradient-to-br from-zinc-900/40 to-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Renovações de Assinatura</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-3xl font-black text-emerald-400">91.2%</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Churn rate baixíssimo este mês</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'marketing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-zinc-850 bg-zinc-900/30">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-base font-bold">Cupons de Desconto do Canal</CardTitle>
                <CardDescription>Crie descontos personalizados para seus leads do Telegram.</CardDescription>
              </div>
              <Megaphone className="w-5 h-5 text-zinc-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-850 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider">GALO10</h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">10% de desconto na primeira fatura</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">Ativo</span>
              </div>

              {!showAddCoupon ? (
                <button
                  onClick={() => setShowAddCoupon(true)}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Criar Cupom de Desconto
                </button>
              ) : (
                <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-850 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1">Código do Cupom</label>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="E.g. VIP20"
                        className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold mb-1">Desconto</label>
                      <input
                        type="text"
                        value={couponDiscount}
                        onChange={e => setCouponDiscount(e.target.value)}
                        placeholder="E.g. 20%"
                        className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert('Cupom de desconto criado!');
                      setShowAddCoupon(false);
                    }}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs cursor-pointer"
                  >
                    Salvar Cupom
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'configuracoes' && (
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Personalizar Perfil Público</CardTitle>
            <CardDescription>Altere as informações exibidas na sua Landing Page exclusiva.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-1.5 uppercase tracking-wider">Nome de Exibição</label>
                  <input
                    type="text"
                    value={profName}
                    onChange={e => setProfName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-1.5 uppercase tracking-wider">Cor de Destaque da LP</label>
                  <input
                    type="color"
                    value={colorMain}
                    onChange={e => setColorMain(e.target.value)}
                    className="w-full h-10 p-1 bg-zinc-900 border border-zinc-850 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 font-bold mb-1.5 uppercase tracking-wider">Biografia / Descrição do Tipster</label>
                <textarea
                  value={profBio}
                  onChange={e => setProfBio(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white text-xs leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-1.5 uppercase tracking-wider">Link do Canal do Telegram</label>
                  <input
                    type="text"
                    value={profTelegram}
                    onChange={e => setProfTelegram(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-1.5 uppercase tracking-wider">Usuário do Instagram</label>
                  <input
                    type="text"
                    value={profInstagram}
                    onChange={e => setProfInstagram(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs cursor-pointer transition-colors"
              >
                Salvar Configurações
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Tip Modal Overlay */}
      {showAddTip && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-lg bg-zinc-950 border-zinc-850 text-xs">
            <CardHeader className="flex flex-row justify-between items-center border-b border-zinc-900 pb-4">
              <div>
                <CardTitle className="text-base font-bold">Publicar Nova Tip</CardTitle>
                <CardDescription>Crie uma oportunidade de aposta para seus clientes ativos.</CardDescription>
              </div>
              <button onClick={() => setShowAddTip(false)} className="text-zinc-500 hover:text-white cursor-pointer text-sm">✕</button>
            </CardHeader>
            <form onSubmit={handleCreateTip}>
              <CardContent className="space-y-4 pt-6 max-h-[420px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Esporte</label>
                    <select
                      value={newSport}
                      onChange={e => setNewSport(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    >
                      <option>Futebol</option>
                      <option>Basquete</option>
                      <option>Tênis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Liga / Campeonato</label>
                    <input
                      type="text"
                      required
                      value={newLeague}
                      onChange={e => setNewLeague(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-1">Partida (Mandante vs Visitante)</label>
                  <input
                    type="text"
                    required
                    value={newMatch}
                    onChange={e => setNewMatch(e.target.value)}
                    placeholder="E.g. Real Madrid vs Barcelona"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Mercado de Entrada</label>
                    <input
                      type="text"
                      required
                      value={newMarket}
                      onChange={e => setNewMarket(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Entrada / Tipo</label>
                    <input
                      type="text"
                      required
                      value={newType}
                      onChange={e => setNewType(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Odd</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newOdd}
                      onChange={e => setNewOdd(parseFloat(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Stake (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newStake}
                      onChange={e => setNewStake(parseFloat(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Confiança (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={newConfidence}
                      onChange={e => setNewConfidence(parseInt(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-bold mb-1">Justificativa da Análise</label>
                  <textarea
                    required
                    value={newJustification}
                    onChange={e => setNewJustification(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Casa Recomendada</label>
                    <input
                      type="text"
                      required
                      value={newBookmaker}
                      onChange={e => setNewBookmaker(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold mb-1">Link de Afiliado</label>
                    <input
                      type="text"
                      required
                      value={newAffiliate}
                      onChange={e => setNewAffiliate(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs cursor-pointer transition-colors mt-2"
                >
                  Publicar Entrada de Valor
                </button>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
