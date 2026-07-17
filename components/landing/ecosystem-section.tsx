'use client'

import React from 'react'
import { Zap, LayoutDashboard, Smartphone, Users, Trophy, Sparkles, Wallet, MessageCircle, Award, History, Bell } from 'lucide-react'

const nodes = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Smartphone, label: 'Aplicativo' },
  { icon: Users, label: 'Comunidade' },
  { icon: Trophy, label: 'Vale Tudo' },
  { icon: Sparkles, label: 'IA' },
  { icon: Wallet, label: 'Gestão' },
  { icon: MessageCircle, label: 'CRM' },
  { icon: Award, label: 'Ranking' },
  { icon: History, label: 'Histórico' },
  { icon: Bell, label: 'Notificações' }
]

export function EcosystemSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      {/* Background glowing effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/5 rounded-full blur-[130px] z-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 space-y-16">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Tudo Conectado
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Ecossistema MK Tips
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Ao assinar, você adquire um ecossistema completo e integrado de ferramentas para otimizar suas decisões.
          </p>
        </div>

        {/* Visual Flowchart Design */}
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-12">
          
          {/* Main Central Node */}
          <div className="relative group z-10">
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#00E08A] opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-zinc-950 border border-zinc-800 px-8 py-5 rounded-2xl flex flex-col items-center text-center space-y-2 shadow-2xl">
              <span className="w-12 h-12 rounded-xl bg-[#00E08A]/10 border border-[#00E08A]/20 flex items-center justify-center text-[#00E08A]">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </span>
              <h3 className="font-black text-white text-base tracking-wider">MK TIPS HUB</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Nuvem Central</p>
            </div>
          </div>

          {/* Connectors & Grid of Connected Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full">
            {nodes.map((node, idx) => {
              const Icon = node.icon
              return (
                <div key={idx} className="relative flex flex-col items-center group">
                  {/* Flowline */}
                  <div className="absolute -top-12 bottom-full w-0.5 bg-gradient-to-b from-[#00E08A]/20 to-transparent hidden sm:block pointer-events-none" />

                  <div className="w-full bg-zinc-950/60 border border-zinc-900 group-hover:border-[#00E08A]/30 p-4 rounded-xl flex flex-col items-center text-center space-y-2 transition-all duration-300">
                    <span className="w-8 h-8 rounded-lg bg-zinc-900 text-zinc-400 group-hover:text-[#00E08A] flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-white text-xs tracking-wide">{node.label}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}
