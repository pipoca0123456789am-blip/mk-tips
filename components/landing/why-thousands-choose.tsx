'use client'

import React from 'react'
import {
  TrendingUp,
  Cloud,
  ShieldCheck,
  Zap,
  Target,
  FileCheck,
  Share2,
  Users
} from 'lucide-react'

const advantages = [
  { icon: Target, title: 'Decisões com base estatística', desc: 'Troque o achismo por análises frias estruturadas sobre valor esperado positivo.' },
  { icon: Cloud, title: 'Infraestrutura SaaS Robusta', desc: 'Esqueça os grupos poluídos. Opere em um painel completo focado em desempenho.' },
  { icon: ShieldCheck, title: 'Controle de Risco Rigoroso', desc: 'Proteja o seu caixa através do cálculo exato de stake recomendada para cada tip.' },
  { icon: Zap, title: 'Agilidade Operacional', desc: 'Push notifications no exato milissegundo de publicação das oportunidades.' },
  { icon: FileCheck, title: 'Transparência Inegociável', desc: 'Todos os greens e reds são listados no histórico público, sem edições ou cortes.' },
  { icon: TrendingUp, title: 'Comparador Inteligente', desc: 'Aproveite a melhor odd disponível no mercado com um clique direcionado.' },
  { icon: Share2, title: 'Automação WhatsApp CRM', desc: 'Disparo de relatórios e encerramentos direto na conta de seus assinantes.' },
  { icon: Users, title: 'Ecossistema Colaborativo', desc: 'Navegue em rankings de tipsters parceiros e participe de torneios exclusivos.' }
]

export function WhyThousandsChoose() {
  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Diferenciais de Valor
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Por que milhares utilizam a MK Tips?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Aumentamos o profissionalismo do investidor através de ferramentas de auditoria e automação exclusivas.
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 hover:border-[#00E08A]/20 hover:bg-zinc-950/80 transition-all duration-300"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] transition-colors group-hover:bg-[#00E08A] group-hover:text-black">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 font-bold text-white text-xs sm:text-sm">{item.title}</h3>
                <p className="mt-2 text-zinc-400 text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
