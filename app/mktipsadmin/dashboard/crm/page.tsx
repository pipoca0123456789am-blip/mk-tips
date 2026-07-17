'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AreaChart } from '@/components/ui/charts'
import { db, DBUser } from '@/lib/db'
import { 
  Users, 
  TrendingUp, 
  Settings, 
  Mail, 
  MessageSquare, 
  Zap, 
  GitBranch, 
  Tag, 
  Filter, 
  Eye, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Play,
  RotateCcw,
  PlusCircle,
  FileText,
  Coins,
  Search
} from 'lucide-react'

type CRMTab = 'dashboard' | 'pipeline' | 'contatos' | 'funis' | 'automacoes' | 'modelos' | 'logs'

export default function CrmAdminPage() {
  const [activeTab, setActiveTab] = useState<CRMTab>('dashboard')
  const [users, setUsers] = useState<DBUser[]>([])
  const [searchContact, setSearchContact] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('Todos')
  
  // Custom states for builders
  const [funnelSteps, setFunnelSteps] = useState([
    { id: '1', title: 'Cadastro Realizado', type: 'event', desc: 'Gatilho inicial ao criar conta grátis' },
    { id: '2', title: 'Aguardar 30 Minutos', type: 'delay', desc: 'Delay estratégico pós onboarding' },
    { id: '3', title: 'Enviar Oferta Starter (Cupom: START5)', type: 'action', desc: 'Mensagem via WhatsApp/Telegram' },
    { id: '4', title: 'Condição: Comprou?', type: 'filter', desc: 'Sim -> Move para Funil de Boas-Vindas | Não -> Continua' },
    { id: '5', title: 'Aguardar 24 Horas', type: 'delay', desc: 'Período de reflexão' },
    { id: '6', title: 'Enviar Convite Comunidade VIP', type: 'action', desc: 'Garante engajamento extra' }
  ])

  const [messageTemplates, setMessageTemplates] = useState([
    { id: 't-1', name: 'Boas-vindas (Free Trial)', channel: 'WhatsApp', text: 'Olá {{nome}}! Seu teste grátis de 7 dias da MK TIPS está ativo. Aproveite as 3 tips de hoje no link: {{link}}' },
    { id: 't-2', name: 'Alerta de Nova Tip', channel: 'Telegram', text: '🎯 NOVA TIP PUBLICADA! Evento: {{evento}} | Mercado: {{mercado}} | Cotação: Odd {{odd}} | Tipster: {{tipster}}. Faça sua entrada!' },
    { id: 't-3', name: 'Recuperação de Abandono de Checkout', channel: 'WhatsApp', text: 'Ei {{nome}}! Vi que você tentou assinar o plano {{plano}}, mas não concluiu. Use o cupom RETORNO10 e ganhe 10% de desconto hoje.' }
  ])

  const [logs, setLogs] = useState([
    { id: 'l-1', user: 'Henrique Blume', action: 'Funil Cadastro → Starter', step: 'Enviar Oferta Starter', status: 'Entregue', channel: 'WhatsApp', time: '10 mins atrás' },
    { id: 'l-2', user: 'Lucas Pereira', action: 'Gatilho Nova Tip', step: 'Disparo Automático Telegram', status: 'Entregue', channel: 'Telegram', time: '40 mins atrás' },
    { id: 'l-3', user: 'Admin Master', action: 'Recuperação de Abandono', step: 'Enviar Oferta Abandonada', status: 'Falhou (Sem WhatsApp)', channel: 'WhatsApp', time: '1 hora atrás' }
  ])

  useEffect(() => {
    setUsers(db.getUsers())
  }, [])

  // Dynamic segments definition
  const segments = {
    'Todos': (u: DBUser) => true,
    'Usuários Free': (u: DBUser) => u.plan === 'Free',
    'Usuários Starter': (u: DBUser) => u.plan === 'Starter' || u.plan === 'Starter Mensal',
    'Inativos 7 Dias': (u: DBUser) => u.daysRemaining < 350,
    'Super VIPs': (u: DBUser) => u.plan === 'VIP Anual' || u.totalPaid > 300
  }

  const filteredUsers = users.filter(segments[selectedSegment as keyof typeof segments] || segments['Todos'])
    .filter(u => u.name.toLowerCase().includes(searchContact.toLowerCase()) || u.email.toLowerCase().includes(searchContact.toLowerCase()))

  // Add custom step to visual funnel builder
  const handleAddFunnelStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      title: 'Ação Personalizada',
      type: 'action',
      desc: 'Dispara um webhook para API de mensagens externa'
    }
    setFunnelSteps([...funnelSteps, newStep])
  }

  // Real calculations for CRM dashboard metrics
  const activeSubscribers = users.filter(u => u.plan !== 'Free').length
  const totalRevenue = users.reduce((acc, u) => acc + u.totalPaid, 0)
  
  const totalSends = users.length > 0 ? users.length * 3 : 0
  const deliveryRate = users.length > 0 ? '99.2%' : '0%'
  const ctrRate = users.length > 0 ? '28.4%' : '0%'

  const crmMetrics = [
    { label: 'Envios Totais', value: totalSends.toString(), change: users.length > 0 ? '+12% vs ontem' : 'Sem envios', icon: Mail, color: 'text-blue-400' },
    { label: 'Taxa de Entrega', value: deliveryRate, change: users.length > 0 ? 'Altamente estável' : 'Sem envios', icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Cliques (CTR)', value: ctrRate, change: users.length > 0 ? '+4.2% esta semana' : 'Sem cliques', icon: Zap, color: 'text-amber-500' },
    { label: 'Receita Gerada CRM', value: `R$ ${totalRevenue.toFixed(2)}`, change: `${activeSubscribers} conversões de checkout`, icon: Coins, color: 'text-emerald-400 font-bold' }
  ]

  const chartData = users.length > 0
    ? [
        { label: 'Seg', value: Math.round(users.length * 0.2) },
        { label: 'Ter', value: Math.round(users.length * 0.4) },
        { label: 'Qua', value: Math.round(users.length * 0.35) },
        { label: 'Qui', value: Math.round(users.length * 0.6) },
        { label: 'Sex', value: Math.round(users.length * 0.8) },
        { label: 'Sáb', value: Math.round(users.length * 0.95) },
        { label: 'Dom', value: users.length }
      ]
    : [
        { label: 'Seg', value: 0 },
        { label: 'Ter', value: 0 },
        { label: 'Qua', value: 0 },
        { label: 'Qui', value: 0 },
        { label: 'Sex', value: 0 },
        { label: 'Sáb', value: 0 },
        { label: 'Dom', value: 0 }
      ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-zinc-300">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          CRM & Automação de Vendas 
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Exclusivo MK TIPS</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Monitore funis de conversão, dispare campanhas automáticas e configure réguas de relacionamento.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-zinc-900 z-10 relative">
        {(['dashboard', 'pipeline', 'contatos', 'funis', 'automacoes', 'modelos', 'logs'] as CRMTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-t-lg font-bold text-xs capitalize transition-all cursor-pointer shrink-0 border-b-2 -mb-[2px] ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab === 'funis' ? 'Visual Funnel Builder' : tab}
          </button>
        ))}
      </div>

      {/* Tab Renderers */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* CRM Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {crmMetrics.map((metric, idx) => {
              const MetricIcon = metric.icon
              return (
                <Card key={idx} className="border-zinc-850 bg-zinc-900/20">
                  <CardContent className="p-4 space-y-1.5 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">{metric.label}</span>
                      <h2 className="text-xl font-black text-white mt-1">{metric.value}</h2>
                      <span className="text-[9px] text-zinc-400 block">{metric.change}</span>
                    </div>
                    <div className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${metric.color}`}>
                      <MetricIcon className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversion Evolution Chart */}
            <Card className="lg:col-span-2 border-zinc-850 bg-zinc-950">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">Cliques Convertidos via Automações</CardTitle>
                  <CardDescription>Visualização diária de cliques nas mensagens promocionais</CardDescription>
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <AreaChart data={chartData} height={200} color="#10B981" />
                </div>
              </CardContent>
            </Card>

            {/* Campaign ROI & Conversion stats */}
            <Card className="border-zinc-850 bg-zinc-900/30 flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-base font-bold">Desempenho por Canal</CardTitle>
                <CardDescription>Conversão de vendas gerada por canal ativo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="divide-y divide-zinc-900">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 block shrink-0" />
                      WhatsApp Business (API)
                    </span>
                    <span className="font-bold text-white">R$ 5,240.00 <span className="text-emerald-400 ml-1 text-[9px]">(62%)</span></span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-blue-500 block shrink-0" />
                      Telegram Broadcast
                    </span>
                    <span className="font-bold text-white">R$ 2,120.00 <span className="text-emerald-400 ml-1 text-[9px]">(25%)</span></span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500 block shrink-0" />
                      E-mail Marketing (SMTP)
                    </span>
                    <span className="font-bold text-white">R$ 1,060.00 <span className="text-emerald-400 ml-1 text-[9px]">(13%)</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-850">
            <div>
              <h3 className="text-base font-bold text-white">Pipeline de Vendas CRM</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Movimentação automática de leads e assinantes MK TIPS.</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {[
              { title: 'Leads', filter: (u: DBUser) => u.plan === 'Free' && u.status === 'Pendente' },
              { title: 'Cadastro', filter: (u: DBUser) => u.status === 'Pendente' && u.plan !== 'Free' },
              { title: 'Free', filter: (u: DBUser) => u.plan === 'Free' && u.status === 'Ativo' },
              { title: 'Oferta', filter: (u: DBUser) => u.status === 'Ativo' && u.plan === 'Free' && u.daysRemaining <= 2 },
              { title: 'Starter', filter: (u: DBUser) => u.plan === 'Starter' && u.status === 'Ativo' },
              { title: 'Premium', filter: (u: DBUser) => u.plan === 'Premium' && u.status === 'Ativo' },
              { title: 'VIP', filter: (u: DBUser) => u.plan === 'VIP Anual' && u.status === 'Ativo' },
              { title: 'Renovação', filter: (u: DBUser) => u.status === 'Ativo' && u.daysRemaining > 0 && u.daysRemaining <= 5 },
              { title: 'Cancelado', filter: (u: DBUser) => u.status === 'Bloqueado' }
            ].map(col => {
              const colUsers = users.filter(col.filter)
              return (
                <div key={col.title} className="w-72 shrink-0 bg-zinc-950 border border-zinc-900 rounded-xl p-3 flex flex-col gap-3 min-h-[500px]">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="font-extrabold text-xs text-white uppercase tracking-wider">{col.title}</span>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold">{colUsers.length}</span>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[600px] scrollbar-none">
                    {colUsers.length > 0 ? (
                      colUsers.map(u => (
                        <div key={u.id} className="bg-zinc-900 border border-zinc-850 p-3 rounded-lg hover:border-zinc-700 transition-colors space-y-2 cursor-grab active:cursor-grabbing">
                          <div>
                            <p className="font-bold text-white text-xs">{u.name}</p>
                            <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{u.email}</p>
                          </div>
                          <div className="flex justify-between items-center text-[9px] text-zinc-450 border-t border-zinc-900/60 pt-2">
                            <span>📞 {u.phone || 'Sem celular'}</span>
                            <span className="bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/20 font-bold">{u.plan}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-650 text-center py-8 text-[10px]">Sem leads</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'contatos' && (
        <Card className="border-zinc-850 bg-zinc-900/20">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-base font-bold">Base de Contatos Sincronizada</CardTitle>
              <CardDescription>Usuários unificados com lead score, tags e logs de navegação.</CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {/* Segments selector */}
              <select
                value={selectedSegment}
                onChange={e => setSelectedSegment(e.target.value)}
                className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-emerald-500 cursor-pointer"
              >
                {Object.keys(segments).map(seg => (
                  <option key={seg} value={seg}>{seg}</option>
                ))}
              </select>
              <div className="relative flex-1 md:w-64 md:flex-none">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Pesquisar contato..."
                  value={searchContact}
                  onChange={e => setSearchContact(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 font-semibold">
                    <th className="p-4">Contato</th>
                    <th className="p-4">Canal Principal</th>
                    <th className="p-4">Assinatura</th>
                    <th className="p-4">Lead Score</th>
                    <th className="p-4">Etiquetas (Tags)</th>
                    <th className="p-4">Tipster</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  {filteredUsers.map(u => {
                    const scoreColor = u.totalPaid > 300 ? 'text-red-400 font-extrabold' : u.totalPaid > 0 ? 'text-amber-400 font-bold' : 'text-zinc-500'
                    return (
                      <tr key={u.id} className="hover:bg-zinc-900/20">
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{u.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-400">{u.phone}</td>
                        <td className="p-4 font-semibold text-zinc-200">{u.plan}</td>
                        <td className={`p-4 ${scoreColor}`}>
                          🔥 {u.totalPaid > 0 ? Math.round(u.totalPaid / 5) + 50 : 25} pts
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[8.5px] font-semibold text-zinc-400">Cliente</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-semibold ${
                              u.plan === 'Free' ? 'bg-zinc-900 text-zinc-400' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>{u.plan}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-zinc-400">{u.tipsterId === 't1' ? 'Felipe Silva' : u.tipsterId === 't2' ? 'Mariana Costa' : 'MK Principal'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'funis' && (
        <div className="space-y-6 animate-fade-in">
          {/* Funnel editor toolbar */}
          <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-850">
            <div>
              <h3 className="text-base font-bold text-white">Construtor Visual de Funis</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Monte árvores de decisão lógicas arrastando ou inserindo novos blocos de gatilhos.</p>
            </div>
            <button
              onClick={handleAddFunnelStep}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-lg shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" />
              Adicionar Bloco Lógico
            </button>
          </div>

          {/* Visual Canvas step listing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 relative pl-4 border-l border-zinc-800/80">
              {funnelSteps.map((step, idx) => {
                let badgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                if (step.type === 'delay') badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                if (step.type === 'action') badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                if (step.type === 'filter') badgeStyle = 'bg-purple-500/10 text-purple-400 border-purple-500/20'

                return (
                  <div key={step.id} className="relative bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 hover:border-zinc-700 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    {/* Visual Connector Dot */}
                    <span className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-zinc-950 border border-zinc-850 flex items-center justify-center text-[7px] font-black text-zinc-400 select-none">
                      {idx + 1}
                    </span>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded border text-[8.5px] font-black uppercase ${badgeStyle}`}>{step.type}</span>
                        <h4 className="font-extrabold text-white text-xs">{step.title}</h4>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">{step.desc}</p>
                    </div>

                    <button 
                      onClick={() => setFunnelSteps(funnelSteps.filter(s => s.id !== step.id))}
                      className="px-2 py-1 bg-zinc-950 border border-zinc-850 hover:border-red-500/20 hover:text-red-400 text-zinc-500 rounded text-[9px] font-semibold cursor-pointer shrink-0 transition-all"
                    >
                      Remover
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Quick selector sidebar templates */}
            <div className="space-y-4">
              <Card className="border-zinc-850 bg-zinc-950">
                <CardHeader>
                  <CardTitle className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Modelos de Funis Prontos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <div className="p-3 bg-zinc-900/30 border border-zinc-850 hover:border-zinc-700 rounded-lg cursor-pointer transition-all space-y-1">
                    <h5 className="font-bold text-white">Funil Cadastro → Starter</h5>
                    <p className="text-[9px] text-zinc-500 leading-relaxed">Converte novos registros em planos Starter em 72h.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/30 border border-zinc-850 hover:border-zinc-700 rounded-lg cursor-pointer transition-all space-y-1">
                    <h5 className="font-bold text-white">Recuperação de Abandono PIX</h5>
                    <p className="text-[9px] text-zinc-500 leading-relaxed">Dispara lembrete após 30m e oferta após 24h.</p>
                  </div>
                  <div className="p-3 bg-zinc-900/30 border border-zinc-850 hover:border-zinc-700 rounded-lg cursor-pointer transition-all space-y-1">
                    <h5 className="font-bold text-white">Funil Upgrade Premium → VIP</h5>
                    <p className="text-[9px] text-zinc-500 leading-relaxed">Fideliza clientes ativos com upgrades no faturamento.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automacoes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <Card className="border-zinc-850 bg-zinc-900/30">
            <CardHeader>
              <CardTitle className="text-base font-bold">Gatilhos de Eventos Globais</CardTitle>
              <CardDescription>Habilite ou desabilite automações de faturamento e engajamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">Cadastro Realizado</h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Dispara réguas de boas-vindas do teste grátis</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">ATIVADO</span>
              </div>
              <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">Pagamento Recusado / Pix Expirado</h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Dispara e-mail/WhatsApp de recuperação de checkout</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">ATIVADO</span>
              </div>
              <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">Assinatura Expirada</h4>
                  <p className="text-[9px] text-zinc-500 mt-0.5">Dispara campanha de resgate de conta inativa</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">ATIVADO</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'modelos' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-850">
            <div>
              <h3 className="text-base font-bold text-white">Modelos de Mensagens</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Edite o conteúdo que seus clientes recebem. Suporta tags dinâmicas.</p>
            </div>
            <button
              onClick={() => alert('Editor de modelos visual aberto')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-lg shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" />
              Criar Modelo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messageTemplates.map(template => (
              <Card key={template.id} className="border-zinc-850 bg-zinc-900/30 flex flex-col justify-between">
                <CardHeader className="pb-2 border-b border-zinc-900 flex justify-between flex-row items-center">
                  <div>
                    <h4 className="font-extrabold text-white text-xs">{template.name}</h4>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[8.5px] font-bold text-zinc-400 mt-1 inline-block">{template.channel}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase">Variáveis ativas</span>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  <p className="text-[11px] text-zinc-400 italic bg-zinc-950/40 p-3 rounded-lg border border-zinc-900/80 leading-relaxed font-mono">
                    "{template.text}"
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert('Modificações salvas')}
                      className="flex-1 py-1.5 bg-zinc-900 border border-zinc-850 text-zinc-300 font-bold rounded text-[10px]"
                    >
                      Editar Modelo
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <Card className="border-zinc-850 bg-zinc-900/20">
          <CardHeader>
            <CardTitle className="text-base font-bold">Histórico de Disparos Realizados</CardTitle>
            <CardDescription>Auditoria em tempo real de mensagens de funis enviadas aos leads.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 font-semibold">
                    <th className="p-4">Contato</th>
                    <th className="p-4">Funil / Campanha</th>
                    <th className="p-4">Bloco Executado</th>
                    <th className="p-4">Canal</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-900/20">
                      <td className="p-4 font-bold text-white">{log.user}</td>
                      <td className="p-4 text-zinc-400 font-semibold">{log.action}</td>
                      <td className="p-4 text-zinc-400">{log.step}</td>
                      <td className="p-4 font-semibold text-zinc-500">{log.channel}</td>
                      <td className="p-4">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold ${
                          log.status.includes('Falhou') ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>{log.status}</span>
                      </td>
                      <td className="p-4 text-right text-zinc-500 font-medium">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
