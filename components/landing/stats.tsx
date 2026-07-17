'use client'

import React, { useEffect, useState } from 'react'
import { Users, Ticket, Trophy, RefreshCw, Award, MessageCircle, Smartphone } from 'lucide-react'
import { CountUp } from './count-up'

export function TrustBar() {
  const [statsConfig, setStatsConfig] = useState({
    activeUsers: 24800,
    tipsPublished: 142000,
    sportsCovered: 32,
    activeLeagues: 480,
    partnerTipsters: 15,
    communities: 8,
    appInstalls: 12500
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mktips_admin_stats_config')
      if (stored) {
        try {
          setStatsConfig(prev => ({ ...prev, ...JSON.parse(stored) }))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  return (
    <div className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-xl py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-900">
          <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Usuários Ativos</span>
            <span className="text-base font-black text-white font-mono">
              <CountUp end={statsConfig.activeUsers} decimals={0} suffix="+" />
            </span>
          </div>
          <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Tips Enviadas</span>
            <span className="text-base font-black text-white font-mono">
              <CountUp end={statsConfig.tipsPublished} decimals={0} suffix="+" />
            </span>
          </div>
          <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Esportes</span>
            <span className="text-base font-black text-white font-mono">
              <CountUp end={statsConfig.sportsCovered} decimals={0} suffix="" />
            </span>
          </div>
          <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Campeonatos</span>
            <span className="text-base font-black text-white font-mono">
              <CountUp end={statsConfig.activeLeagues} decimals={0} suffix="+" />
            </span>
          </div>
          <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Tipsters Parceiros</span>
            <span className="text-base font-black text-white font-mono">
              <CountUp end={statsConfig.partnerTipsters} decimals={0} suffix="" />
            </span>
          </div>
          <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Comunidades</span>
            <span className="text-base font-black text-white font-mono">
              <CountUp end={statsConfig.communities} decimals={0} suffix="" />
            </span>
          </div>
          <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mb-1">Instalações App</span>
            <span className="text-base font-black text-white font-mono">
              <CountUp end={statsConfig.appInstalls} decimals={0} suffix="+" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Stats() {
  const [statsConfig, setStatsConfig] = useState({
    activeUsers: 24800,
    tipsPublished: 142000,
    sportsCovered: 32,
    activeLeagues: 480,
    partnerTipsters: 15,
    communities: 8,
    appInstalls: 12500
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mktips_admin_stats_config')
      if (stored) {
        try {
          setStatsConfig(prev => ({ ...prev, ...JSON.parse(stored) }))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  return (
    <section id="resultados" className="relative py-24 sm:py-32 overflow-hidden bg-black border-t border-zinc-900/40">
      <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Prova Social & Métricas
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Números sólidos de credibilidade
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Métricas auditadas em tempo real de toda a nossa infraestrutura operacional.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/45 p-6 hover:border-[#00E08A]/25 transition-all">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] mb-4">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="font-mono text-3xl font-bold tracking-tight text-white">
              <CountUp end={statsConfig.activeUsers} decimals={0} suffix="+" />
            </h3>
            <p className="mt-1.5 text-xs font-semibold text-zinc-550 uppercase tracking-wide">Usuários Ativos</p>
            <p className="mt-1 text-[11px] text-zinc-400">Investidores conectados em nossa infraestrutura.</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/45 p-6 hover:border-[#00E08A]/25 transition-all">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] mb-4">
              <Ticket className="h-5 w-5" />
            </span>
            <h3 className="font-mono text-3xl font-bold tracking-tight text-white">
              <CountUp end={statsConfig.tipsPublished} decimals={0} suffix="+" />
            </h3>
            <p className="mt-1.5 text-xs font-semibold text-zinc-550 uppercase tracking-wide">Tips Enviadas</p>
            <p className="mt-1 text-[11px] text-zinc-400">Total acumulado de entradas analíticas e auditadas.</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/45 p-6 hover:border-[#00E08A]/25 transition-all">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] mb-4">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h3 className="font-mono text-3xl font-bold tracking-tight text-white">
              <CountUp end={statsConfig.communities} decimals={0} suffix="" />
            </h3>
            <p className="mt-1.5 text-xs font-semibold text-zinc-550 uppercase tracking-wide">Comunidades Ativas</p>
            <p className="mt-1 text-[11px] text-zinc-400">Canais integrados de interação e suporte.</p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/45 p-6 hover:border-[#00E08A]/25 transition-all">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] mb-4">
              <Smartphone className="h-5 w-5" />
            </span>
            <h3 className="font-mono text-3xl font-bold tracking-tight text-white">
              <CountUp end={statsConfig.appInstalls} decimals={0} suffix="+" />
            </h3>
            <p className="mt-1.5 text-xs font-semibold text-zinc-550 uppercase tracking-wide">Instalações App</p>
            <p className="mt-1 text-[11px] text-zinc-400">Instalações realizadas na tela inicial do celular.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
