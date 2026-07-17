'use client'

import React from 'react'
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  History,
  BarChart3,
  Percent,
  LineChart,
  Award,
  Sparkles,
  Trophy,
  Users,
  Bell,
  Smartphone
} from 'lucide-react'

const featuresList = [
  { icon: LayoutDashboard, title: 'Dashboard', desc: 'Central de operações e visualização de dados.' },
  { icon: Wallet, title: 'Gestão da banca', desc: 'Stake sugerida baseada no seu caixa configurado.' },
  { icon: TrendingUp, title: 'Comparação automática', desc: 'Destacamos na hora a melhor odd entre as principais casas.' },
  { icon: History, title: 'Histórico', desc: 'Registro transparente de todos os palpites resolvidos.' },
  { icon: BarChart3, title: 'Gráficos', desc: 'Monitore o avanço patrimonial de suas apostas.' },
  { icon: Percent, title: 'ROI', desc: 'Retorno sobre investimento auditado.' },
  { icon: LineChart, title: 'Yield', desc: 'Lucro médio em relação ao valor total apostado.' },
  { icon: Award, title: 'Ranking', desc: 'Descubra quais tipsters entregam mais resultado.' },
  { icon: Sparkles, title: 'IA', desc: 'Análise estatística preditiva inteligente de jogos.' },
  { icon: Trophy, title: 'Vale Tudo', desc: 'Torneios de palpiteiros com pontuação dinâmica.' },
  { icon: Users, title: 'Comunidade', desc: 'Interação e troca de dicas de valor.' },
  { icon: Bell, title: 'Notificações', desc: 'Alertas instantâneos de novos palpites publicados.' },
  { icon: Smartphone, title: 'Aplicativo', desc: 'Versão PWA instalável direto na tela de início.' }
]

export function FeaturesSinglePlace() {
  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Tudo em um único lugar
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            A caixa de ferramentas definitiva
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Elimine planilhas complexas, grupos perdidos no WhatsApp e anotações manuais. Reúna tudo em um ecossistema.
          </p>
        </div>

        {/* Grid of 13 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuresList.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 hover:border-[#00E08A]/20 hover:bg-zinc-950/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] transition-colors group-hover:bg-[#00E08A] group-hover:text-black">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-xs sm:text-sm">{item.title}</h3>
                    <p className="mt-1.5 text-zinc-500 text-[10px] sm:text-[11px] leading-normal">{item.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
