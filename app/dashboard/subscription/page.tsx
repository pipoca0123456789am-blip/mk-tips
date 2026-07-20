'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBUser } from '@/lib/db'
import { withReferralParam } from '@/lib/referral'
import { CreditCard, ShieldCheck, Receipt, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'

export default function UserSubscriptionPage() {
  const [user, setUser] = useState<DBUser | null>(null)
  const [coupon, setCoupon] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)
  const [pixCode, setPixCode] = useState(false)
  const [loading, setLoading] = useState(false)

  const upgradePlans = [
    { 
      id: 'starter_mensal', 
      name: 'Starter Mensal', 
      price: 49.90, 
      period: '/mês',
      features: [
        'Tips do Dia Limitadas', 
        'Acesso a 2 Desafios de Alavancagem (Starter + PRO)', 
        'Histórico dos últimos 30 dias'
      ] 
    },
    { 
      id: 'premium_mensal', 
      name: 'Premium Mensal', 
      price: 97.90, 
      period: '/mês',
      features: [
        'Tips ilimitadas + Histórico total', 
        'Acesso a 2 Desafios de Alavancagem (Starter + PRO)', 
        'Notificações dinâmicas em tempo real'
      ] 
    },
    { 
      id: 'premium_trimestral', 
      name: 'Premium Trimestral', 
      price: 247.00, 
      period: '/3 meses',
      features: [
        'Todas as tips + Histórico ilimitado', 
        'Acesso a 2 Desafios de Alavancagem (Starter + PRO)', 
        'Desconto equivalente trimestral'
      ] 
    },
    { 
      id: 'premium_semestral', 
      name: 'Premium Semestral', 
      price: 397.00, 
      period: '/6 meses',
      features: [
        'Todas as tips + Histórico ilimitado', 
        'Acesso a 2 Desafios de Alavancagem (Starter + PRO)', 
        'Melhor economia semestral'
      ] 
    },
    { 
      id: 'vip', 
      name: 'VIP Anual', 
      price: 497.90, 
      period: '/ano',
      features: [
        'Tudo do Premium', 
        'Acesso a TODOS os 3 Desafios (Starter, PRO, Elite) inclusos', 
        'Central de Chatbot IA exclusivo',
        'Suporte Dedicado VIP'
      ] 
    },
    { 
      id: 'lifetime', 
      name: 'VIP Lifetime 👑', 
      price: 997.00, 
      period: 'Único',
      features: [
        'Acesso Vitalício ilimitado', 
        'Todos os Tipsters e Desafios de Alavancagem inclusos', 
        'Suporte prioritário e novidades em primeira mão'
      ] 
    }
  ]

  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const load = () => {
      if (!db.isReady()) return
      const activeUser = db.getActiveUser()
      setUser(activeUser)
      setLoadingUser(false)
    }

    load()
    window.addEventListener('oddvault_db_update', load)
    return () => window.removeEventListener('oddvault_db_update', load)
  }, [])

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (coupon.toUpperCase() === 'GREEN10') {
      setCouponMsg('Cupom GREEN10 aplicado! 10% de desconto na próxima fatura.')
    } else {
      setCouponMsg('Cupom inválido ou expirado.')
    }
  }

  const handleUpgradeSelect = (plan: any) => {
    let target = 'Premium'
    if (plan.id.includes('starter')) target = 'Starter'
    if (plan.id.includes('vip') || plan.id.includes('lifetime')) target = 'VIP Anual'
    window.location.href = withReferralParam(`/checkout?plan=${target}`)
  }

  const confirmUpgrade = () => {
    setLoading(true)
    setTimeout(() => {
      if (user) {
        const users = db.getUsers()
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return {
              ...u,
              plan: selectedPlan.name,
              totalPaid: u.totalPaid + selectedPlan.price
            }
          }
          return u
        })
        db.setUsers(updatedUsers)
        setUser({ ...user, plan: selectedPlan.name, totalPaid: user.totalPaid + selectedPlan.price })
        db.addLog('Payment', `Upgrade de plano realizado com sucesso para ${selectedPlan.name}.`)
      }
      setLoading(false)
      setSelectedPlan(null)
      setShowUpgrade(false)
    }, 2000)
  }

  if (loadingUser) {
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
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Assinatura & Faturamento</h1>
        <p className="text-sm text-zinc-400">Gerencie seu plano ativo, faturas passadas e cupons de desconto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active plan card */}
        <Card className="lg:col-span-2 border-zinc-850 bg-gradient-to-br from-zinc-900/40 to-black">
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-extrabold uppercase">Plano Ativo</span>
              <h2 className="text-2xl font-black text-white mt-2">
                {user.plan === 'Free' ? 'Teste Grátis (7 Dias)' : user.plan}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Status da Assinatura: <strong className="text-emerald-400">{user.status}</strong></p>
            </div>
            <CreditCard className="w-5 h-5 text-zinc-500" />
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3 bg-zinc-900/50 border border-zinc-850 rounded flex justify-between items-center">
              <div>
                <span className="text-zinc-500 block">
                  {user.plan === 'Free' ? 'Período de teste expira em' : 'Renovação agendada para'}
                </span>
                <span className="font-bold text-white mt-1">
                  {user.plan === 'Free' ? `${user.daysRemaining} dias` : '10 de Janeiro de 2027'}
                </span>
              </div>
              <span className="text-zinc-400">Total pago: R$ {user.totalPaid.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-zinc-900 border border-zinc-850 text-zinc-300 font-semibold rounded hover:bg-zinc-800 text-xs cursor-pointer">Cancelar Renovação</button>
              <button 
                onClick={() => setShowUpgrade(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
              >
                Fazer Upgrade
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Coupons */}
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Cupons de Desconto</CardTitle>
            <CardDescription>Aplique cupons à sua assinatura.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <input
                type="text"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="E.g. GREEN10"
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
              />
              <button type="submit" className="w-full py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-bold rounded cursor-pointer">Aplicar Cupom</button>
            </form>
            {couponMsg && <p className="text-[10px] text-emerald-400 font-semibold">{couponMsg}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Invoice list */}
      <Card className="border-zinc-850 bg-zinc-900/20">
        <CardHeader>
          <CardTitle className="text-base font-bold">Faturas Recentes</CardTitle>
          <CardDescription>Histórico detalhado de pagamentos processados via PIX ou Cartão.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 font-semibold">
                  <th className="p-4">Fatura</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Método</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                <tr className="hover:bg-zinc-900/20">
                  <td className="p-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-zinc-500" />
                    <span>#INV-9831-26</span>
                  </td>
                  <td className="p-4 text-zinc-500">10/01/2026</td>
                  <td className="p-4 font-bold text-white">R$ 497,90</td>
                  <td className="p-4 text-zinc-400">PIX</td>
                  <td className="p-4 text-right">
                    <button className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer">Comprovante</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade options overlay modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg bg-zinc-950 border-zinc-850 text-xs">
            <CardHeader className="flex justify-between flex-row items-center border-b border-zinc-900 pb-4">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Upgrade do Plano
                </CardTitle>
                <CardDescription>Habilite acesso de longo prazo com descontos progressivos.</CardDescription>
              </div>
              <button onClick={() => setShowUpgrade(false)} className="text-zinc-500 hover:text-white">✕</button>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {!selectedPlan ? (
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                  {upgradePlans.map(plan => (
                    <div key={plan.id} className="p-5 bg-zinc-900/50 border border-zinc-850 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition-all">
                      <div className="space-y-2">
                        <span className="font-black text-white text-base block">{plan.name}</span>
                        <ul className="space-y-1 text-[10px] text-zinc-400 list-disc list-inside">
                          {plan.features.map((feat, index) => (
                            <li key={index} className="leading-tight">{feat}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-855">
                        <span className="text-emerald-400 font-black text-base shrink-0">R$ {plan.price.toFixed(2)}<span className="text-[10px] text-zinc-500 font-normal">{plan.period}</span></span>
                        <button
                          onClick={() => handleUpgradeSelect(plan)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                        >
                          Selecionar
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-900 rounded border border-zinc-850 flex justify-between items-center">
                    <div>
                      <span className="text-zinc-400 font-bold block">{selectedPlan.name}</span>
                      <span className="text-[9px] text-zinc-550">Upgrade de Assinatura</span>
                    </div>
                    <span className="text-emerald-400 font-extrabold text-sm">R$ {selectedPlan.price.toFixed(2)}</span>
                  </div>
 
                  {!pixCode ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPlan(null)}
                        className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                      </button>
                      <button
                        onClick={() => setPixCode(true)}
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Gerar QR Code PIX
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="w-24 h-24 bg-white p-2 rounded flex items-center justify-center text-black font-extrabold select-none">
                        [ QR CODE ]
                      </div>
                      <p className="text-[10px] text-zinc-500 text-center">Efetue o pagamento do PIX para concluir o upgrade do seu plano.</p>
                      
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => setPixCode(false)}
                          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Voltar
                        </button>
                        <button
                          onClick={confirmUpgrade}
                          disabled={loading}
                          className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                          {loading ? 'Validando transação...' : 'Confirmar Pagamento'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
