'use client'

import React from 'react'
import { UserPlus, CreditCard, Rocket, CheckCircle, Bell, TrendingUp, Award, Wallet } from 'lucide-react'

const stepsList = [
  { icon: UserPlus, title: 'Criar conta', desc: 'Preencha seus dados básicos de cadastro.' },
  { icon: CreditCard, title: 'Escolher plano', desc: 'Selecione a modalidade de assinatura.' },
  { icon: Rocket, title: 'Pagamento', desc: 'Aprovado via PIX ou cartão em segundos.' },
  { icon: CheckCircle, title: 'Acesso liberado', desc: 'Seu usuário é ativado instantaneamente.' },
  { icon: Bell, title: 'Receber Tips', desc: 'Acompanhe as análises no painel ou por push.' },
  { icon: TrendingUp, title: 'Comparar Odds', desc: 'Comparamos e indicamos a melhor cotação.' },
  { icon: Award, title: 'Acompanhar resultados', desc: 'Todos os greens e reds são auditados.' },
  { icon: Wallet, title: 'Controlar banca', desc: 'Gerencie seu caixa e ROI automaticamente.' }
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Fluxo Completo
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Como funciona a MK Tips
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Acompanhe o caminho operacional completo de nossos membros, do cadastro à gestão do caixa.
          </p>
        </div>

        {/* 8 Step Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stepsList.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-[#00E08A]/20 hover:bg-zinc-950/80 transition-all duration-300"
              >
                {/* Connector line for large screen */}
                {idx < 7 && (
                  <div className="hidden lg:block absolute top-9 left-[75%] w-[50%] h-[1px] bg-gradient-to-r from-emerald-500/10 via-[#00E08A]/25 to-emerald-500/10 z-0 pointer-events-none" />
                )}

                <div className="relative z-10 w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-[#00E08A] transition-colors group-hover:bg-[#00E08A] group-hover:text-black">
                  <Icon className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-zinc-950 border border-zinc-850 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black font-mono text-zinc-550">
                    0{idx + 1}
                  </span>
                </div>
                
                <h3 className="mt-4 font-bold text-white text-xs sm:text-sm">{step.title}</h3>
                <p className="mt-1.5 text-zinc-500 text-[10px] sm:text-[11px] leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
