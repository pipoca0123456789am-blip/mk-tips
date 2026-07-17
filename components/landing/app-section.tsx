'use client'

import React from 'react'
import { Smartphone, Bell, Globe, RefreshCw, CheckCircle, Apple, Play } from 'lucide-react'
import Image from 'next/image'

const appFeatures = [
  { icon: CheckCircle, title: 'Instale em segundos', desc: 'Sem downloads pesados. Adicione à tela inicial direto pelo navegador via tecnologia PWA.' },
  { icon: Bell, title: 'Receba notificações', desc: 'Alertas push em tempo real de novas tips publicadas no segundo exato do envio.' },
  { icon: Globe, title: 'Acesse de qualquer lugar', desc: 'Compatibilidade total com celulares, tablets e computadores de forma otimizada.' },
  { icon: RefreshCw, title: 'Sincronização automática', desc: 'Dados e configurações sincronizados na nuvem em tempo real.' }
]

export function AppSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] z-0" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 space-y-16">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Mobile & Multi-dispositivo
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Conheça o Aplicativo
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Tenha a melhor experiência operacional na palma da sua mão com nosso aplicativo responsivo de alta performance.
          </p>
        </div>

        {/* Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Columns (Mockups) */}
          <div className="lg:col-span-6 relative flex justify-center items-center gap-4">
            
            {/* iPhone Mockup */}
            <div className="relative border border-zinc-850 bg-zinc-950 rounded-[2rem] w-52 h-88 overflow-hidden shadow-2xl p-3 shrink-0 transform hover:scale-[1.03] transition-transform">
              <div className="w-16 h-3.5 bg-zinc-800 rounded-full mx-auto mb-2" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image src="/tips-mockup.png" fill alt="iPhone Mockup" className="object-cover" />
              </div>
            </div>

          </div>

          {/* Right Columns (Features list) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-4">
              {appFeatures.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex gap-4 items-start p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition-all">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A]">
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{item.title}</h4>
                      <p className="mt-1 text-zinc-400 text-[11px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
