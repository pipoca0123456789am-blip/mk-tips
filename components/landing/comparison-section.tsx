'use client'

import React from 'react'
import { XCircle, CheckCircle } from 'lucide-react'

const comparisonRows = [
  {
    before: 'Pesquisar informações em vários sites',
    after: 'Tudo centralizado em um único painel'
  },
  {
    before: 'Comparar odds manualmente nas casas de apostas',
    after: 'Comparação automática indicando a melhor cotação'
  },
  {
    before: 'Controle manual de lucros em planilhas chatas',
    after: 'Dashboard inteligente com ROI automático'
  },
  {
    before: 'Sem histórico de resultados ou análises apagadas',
    after: 'Histórico completo auditável sem manipulações'
  },
  {
    before: 'Sem organização na rotina operacional',
    after: 'Gestão integrada de banca e apostas'
  }
]

export function ComparisonSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Comparativo de Eficiência
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            A evolução da sua rotina
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Compare como é operar sozinho contra o ganho de produtividade ao utilizar nossa tecnologia.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Without MK Tips Card */}
          <div className="border border-red-500/15 bg-red-500/5 p-6 sm:p-8 rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Sem MK Tips
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm text-zinc-400">
              {comparisonRows.map((row, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-2 shrink-0" />
                  <span>{row.before}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With MK Tips Card */}
          <div className="border border-[#00E08A]/20 bg-emerald-500/5 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl shadow-[#00E08A]/2">
            <h3 className="text-base font-bold text-[#00E08A] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Com MK Tips
            </h3>
            <ul className="space-y-4 text-xs sm:text-sm text-zinc-200">
              {comparisonRows.map((row, idx) => (
                <li key={idx} className="flex gap-2.5 items-start font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E08A] mt-2 shrink-0 animate-pulse" />
                  <span>{row.after}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </section>
  )
}
