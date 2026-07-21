'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart, FunnelChart, Sparkline } from '@/components/ui/charts'
import { db, DBUser, DBTip, DBTipster } from '@/lib/db'
import {
  TrendingUp,
  Users,
  PlusCircle,
  AlertTriangle,
  ArrowUpRight,
  Trophy,
  DollarSign,
  TrendingDown,
  Percent
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<DBUser[]>([])
  const [tips, setTips] = useState<DBTip[]>([])
  const [tipsters, setTipsters] = useState<DBTipster[]>([])
  const [loading, setLoading] = useState(true)
  const [activeUsersCount, setActiveUsersCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      await db.refresh()
      const u = db.getUsers()
      const t = db.getTips()
      const ts = db.getTipsters()
      setUsers(u)
      setTips(t)
      setTipsters(ts)
      setActiveUsersCount(u.filter((usr) => usr.status === 'Ativo').length)
      setLoading(false)
    }

    load()
    const onUpdate = () => {
      const u = db.getUsers()
      setUsers(u)
      setTips(db.getTips())
      setTipsters(db.getTipsters())
      setActiveUsersCount(u.filter((usr) => usr.status === 'Ativo').length)
    }
    window.addEventListener('oddvault_db_update', onUpdate)
    const interval = setInterval(() => {
      db.refresh().then(onUpdate)
    }, 20000)
    return () => {
      window.removeEventListener('oddvault_db_update', onUpdate)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#00E08A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalTips = tips.length
  const greenTips = tips.filter(t => t.status === 'Green').length
  const redTips = tips.filter(t => t.status === 'Red').length
  const pendingTips = tips.filter(t => t.status === 'Pendente').length
  const accuracy = totalTips > 0 ? ((greenTips / (greenTips + redTips || 1)) * 100).toFixed(1) : '0'

  const totalRevenue = users.reduce((acc, u) => acc + u.totalPaid, 0)
  const activeSubscribers = users.filter(u => u.plan !== 'Free').length
  const mrr = totalRevenue
  const arr = mrr * 12
  const ltv = activeSubscribers > 0 ? Math.round(totalRevenue / activeSubscribers) : 0

  const allBooks = db.getBookmakers()
  const totalClicks = allBooks.reduce((acc, b) => acc + (b.clicks || 0), 0)
  const totalConversions = allBooks.reduce((acc, b) => acc + (b.conversions || 0), 0)
  const ctrRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) + '%' : '0%'

  const financialCards = [
    { label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2)}`, desc: 'Total acumulado', isProfit: totalRevenue > 0, trend: [0], icon: DollarSign },
    { label: 'Assinaturas Ativas', value: activeSubscribers.toString(), desc: `De ${users.length} cadastrados`, isProfit: true, trend: [0], icon: Users },
    { label: 'Cliques Convertidos', value: totalConversions.toString(), desc: `${totalClicks} cliques totais`, isProfit: true, trend: [0], icon: Users },
    { label: 'ARR (Anual)', value: `R$ ${arr.toFixed(0)}`, desc: 'Projeção anual', isProfit: true, trend: [0], icon: DollarSign },
    { label: 'LTV (Médio)', value: `R$ ${ltv}`, desc: 'Valor vitalício médio', isProfit: true, trend: [0], icon: DollarSign },
    { label: 'CTR de Cliques', value: ctrRate, desc: 'Conversão em afiliados', isProfit: true, trend: [0], icon: Percent }
  ]

  const tipsCards = [
    { label: 'Total de Tips', value: totalTips.toString(), desc: 'Registradas no DB' },
    { label: 'Greens', value: greenTips.toString(), desc: `${accuracy}% Acerto`, color: 'text-[#00E08A]' },
    { label: 'Reds', value: redTips.toString(), desc: 'Perdas registradas', color: 'text-[#EF4444]' },
    { label: 'Pendentes', value: pendingTips.toString(), desc: 'Aguardando fim', color: 'text-[#F59E0B]' }
  ]

  const revenueChartData = users.length > 0 && users.some(u => u.totalPaid > 0)
    ? users.filter(u => u.totalPaid > 0).slice(0, 7).map(u => ({ label: u.name.split(' ')[0], value: u.totalPaid }))
    : [{ label: 'Sem dados', value: 0 }]

  // Crescimento real por dia (últimos 30 dias, total acumulado)
  const growthChartData = (() => {
    const days = 30
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startWindow = new Date(today)
    startWindow.setDate(startWindow.getDate() - (days - 1))

    const signupsByDay = new Map<string, number>()
    let beforeWindow = 0

    for (const u of users) {
      if (!u.createdAt) continue
      const created = new Date(u.createdAt)
      if (Number.isNaN(created.getTime())) continue
      created.setHours(0, 0, 0, 0)
      if (created < startWindow) {
        beforeWindow += 1
        continue
      }
      const key = created.toISOString().slice(0, 10)
      signupsByDay.set(key, (signupsByDay.get(key) || 0) + 1)
    }

    const points: { label: string; value: number }[] = []
    let cumulative = beforeWindow
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      cumulative += signupsByDay.get(key) || 0
      points.push({
        label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: cumulative,
      })
    }
    return points
  })()

  const funnelData = [
    { stage: 'Visitantes', value: users.length * 3 },
    { stage: 'Cadastros', value: users.length },
    { stage: 'Checkout', value: Math.round(users.length * 0.8) },
    { stage: 'Tentativa Pgto', value: Math.round(users.length * 0.7) },
    { stage: 'Assinantes', value: activeSubscribers }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Master</h1>
          <p className="text-sm text-zinc-400">Status geral de faturamento, tips e usuários em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00E08A] bg-[#00E08A]/10 px-3 py-1.5 rounded-lg border border-[#00E08A]/20">
          <span className="w-2 h-2 bg-[#00E08A] rounded-full animate-ping" />
          <span>{activeUsersCount} usuários ativos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {financialCards.map((card, i) => (
          <Card key={i} className="border-zinc-850 bg-zinc-950 hover:border-zinc-800 transition-all duration-200">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">{card.label}</span>
                <card.icon className="w-4 h-4 text-zinc-650" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tight">{card.value}</h2>
                <span className={`text-[10px] block ${card.isProfit ? 'text-[#00E08A]' : 'text-zinc-550'}`}>{card.desc}</span>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <Sparkline data={card.trend} width={75} height={20} color={card.isProfit ? '#00E08A' : '#EF4444'} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AreaChart data={revenueChartData} height={240} color="#00E08A" title="Faturamento de Assinaturas" subtitle="Valores por assinante cadastrado" />
        </div>
        <div>
          <AreaChart data={growthChartData} height={240} color="#3B82F6" title="Crescimento de Assinantes" subtitle="Total acumulado por dia (últimos 30 dias)" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <FunnelChart data={funnelData} height={220} title="Funil Comercial (Acessos -> Venda)" subtitle="Taxa de conversão em cada etapa" />
        </div>

        <Card className="border-zinc-850 bg-zinc-950 hover:border-zinc-800 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Ranking de Tipsters</CardTitle>
            <CardDescription className="text-zinc-400">Tipsters ativos ordenados por ROI</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-850 px-6">
              {tipsters.length > 0 ? tipsters.map((tipster, i) => (
                <div key={tipster.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-mono">0{i + 1}</span>
                    <img src={tipster.avatar} alt={tipster.name} className="w-7 h-7 rounded-full object-cover border border-zinc-800" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{tipster.name}</h4>
                      <p className="text-[9px] text-zinc-500">{tipster.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#00E08A]">+{tipster.stats.roi}% ROI</span>
                    <p className="text-[9px] text-zinc-500">{tipster.stats.tipsCount} tips</p>
                  </div>
                </div>
              )) : (
                <div className="py-6 text-center text-xs text-zinc-500">Nenhum tipster cadastrado.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-850 bg-gradient-to-b from-zinc-950 to-zinc-900/10 hover:border-zinc-800 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Ações Rápidas</CardTitle>
            <CardDescription className="text-zinc-400">Atalhos rápidos para operações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button onClick={() => window.location.href = '/mktipsadmin/dashboard/tips'} className="w-full flex items-center justify-between p-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer">
              <span className="flex items-center gap-2"><PlusCircle className="w-4 h-4 text-[#00E08A]" />Criar Nova Tip Esportiva</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <button onClick={() => window.location.href = '/mktipsadmin/dashboard/users'} className="w-full flex items-center justify-between p-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer">
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" />Gerenciar Assinantes</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <button onClick={() => window.location.href = '/mktipsadmin/dashboard/settings'} className="w-full flex items-center justify-between p-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer">
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />Visualizar Logs de Segurança</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tipsCards.map((card, i) => (
          <Card key={i} className="border-zinc-850 bg-zinc-950 hover:border-zinc-800 transition-all duration-200">
            <CardContent className="p-4">
              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">{card.label}</span>
              <h3 className={`text-3xl font-black mt-1 ${card.color || 'text-white'}`}>{card.value}</h3>
              <span className="text-[10px] text-zinc-500">{card.desc}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
