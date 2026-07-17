'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBTipster, DBTip } from '@/lib/db'
import { TrendingUp, Flame, Check, Sparkles, ShieldCheck } from 'lucide-react'
import { Checkout } from '@/components/landing/checkout'

export default function PublicTipsterLandingPage() {
  const params = useParams()
  const tipsterId = params.id as string
  const [tipster, setTipster] = useState<DBTipster | null>(null)
  const [tips, setTips] = useState<DBTip[]>([])
  
  // Checkout integration
  const [checkoutPlan, setCheckoutPlan] = useState<'Starter' | 'Premium' | 'VIP Anual' | null>(null)

  useEffect(() => {
    const tipsters = db.getTipsters()
    const currentTipster = tipsters.find(t => t.id === tipsterId) || tipsters[0]
    setTipster(currentTipster)

    // Load active tips for this specific tipster
    const allTips = db.getTips()
    const localTips = allTips.filter(t => t.tipsterId === currentTipster.id)
    setTips(localTips)
  }, [tipsterId])

  if (!tipster) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
      </div>
    )
  }

  const greensCount = tips.filter(t => t.status === 'Green').length
  const redsCount = tips.filter(t => t.status === 'Red').length
  const precision = tips.length > 0 ? Math.round((greensCount / (greensCount + redsCount || 1)) * 100) : 0

  const localPlans = [
    { name: 'Starter', price: '49,90', period: '/mês', desc: 'Acesso parcial às tips e histórico limitado.' },
    { name: 'Premium', price: '97,90', period: '/mês', desc: 'Todas as tips e notificações em tempo real.' },
    { name: 'VIP Anual', price: '497,90', period: '/ano', desc: 'Acesso completo com desconto máximo no ano.' }
  ]

  return (
    <div className="min-h-screen bg-[#0c1210] text-zinc-300 font-sans pb-16">
      {/* Checkout Modal */}
      {checkoutPlan && (
        <Checkout initialPlan={checkoutPlan} onClose={() => setCheckoutPlan(null)} />
      )}

      {/* Header / Hero */}
      <div className="relative overflow-hidden bg-zinc-950 border-b border-zinc-900 py-16">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] opacity-40" />
        <div className="relative mx-auto max-w-4xl px-6 text-center space-y-6">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-black text-3xl shadow-2xl mx-auto border-2 border-zinc-800"
            style={{ backgroundColor: tipster.color }}
          >
            {tipster.name.charAt(0)}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white">{tipster.name}</h1>
            <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">{tipster.specialty}</p>
          </div>
          <p className="max-w-xl mx-auto text-zinc-400 text-xs leading-relaxed">{tipster.bio}</p>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: stats */}
        <div className="space-y-6">
          <Card className="border-zinc-850 bg-zinc-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-zinc-500 font-extrabold uppercase tracking-wider">Assertividade Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-3xl font-black text-emerald-400">{precision}%</h2>
              <p className="text-[10px] text-zinc-500 mt-1">{greensCount} Greens vs {redsCount} Reds</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-850 bg-zinc-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-zinc-500 font-extrabold uppercase tracking-wider">Retorno Histórico (ROI)</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-3xl font-black text-emerald-400">+{tipster.stats.roi}%</h2>
              <p className="text-[10px] text-zinc-500 mt-1">Lucro acumulado em unidades</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-850 bg-zinc-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-zinc-500 font-extrabold uppercase tracking-wider">Yield Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-3xl font-black text-white">+{tipster.stats.yield}%</h2>
              <p className="text-[10px] text-zinc-500 mt-1">Retorno por aposta individual</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: plans and lists */}
        <div className="md:col-span-2 space-y-6">
          {/* Active plans block */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">Planos de Assinatura</h3>
            <div className="grid grid-cols-1 gap-4">
              {localPlans.map(plan => (
                <div key={plan.name} className="p-5 bg-zinc-900/40 border border-zinc-850 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-zinc-700 transition-all">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">{plan.name}</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed max-w-sm">{plan.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-emerald-400 font-black text-base">
                      R$ {plan.price}
                      <span className="text-[10px] text-zinc-500 font-normal">{plan.period}</span>
                    </span>
                    <button
                      onClick={() => setCheckoutPlan(plan.name as any)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      Assinar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Tip Log */}
          <div className="space-y-4 pt-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">Últimas Tips Resolvidas</h3>
            <div className="space-y-3">
              {tips.slice(0, 4).map(t => (
                <div key={t.id} className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-white">{t.match}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">{t.league} • {t.market} ({t.type})</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">Odd {t.odd}</span>
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                      t.status === 'Green' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
