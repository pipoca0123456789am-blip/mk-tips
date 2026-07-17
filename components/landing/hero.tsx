'use client'

import React from 'react'
import { ArrowRight, Check, Play, Smartphone, Monitor, Tablet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const highlights = [
  'Dashboard Inteligente',
  'Melhor odd automaticamente',
  'Gestão de banca',
  'Histórico transparente',
  'Aplicativo para celular',
  'Comunidade exclusiva'
]

export function Hero({ onStartFree }: { onStartFree: () => void }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 bg-black">
      {/* Glow Backdrops */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,224,138,0.06),transparent_50%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[850px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[130px] z-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Side */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-[#00E08A] backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E08A]" />
              </span>
              Plataforma SaaS Profissional de Investimentos Esportivos
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Pare de perder tempo procurando oportunidades em vários lugares.
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl">
              A MK Tips reúne análises, histórico, estatísticas, comparação automática de odds, gestão de banca e ferramentas exclusivas em uma única plataforma.
            </p>

            {/* Checkmark Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[#00E08A] border border-emerald-500/20">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button
                onClick={onStartFree}
                size="lg"
                className="group h-13 w-full sm:w-auto bg-[#00E08A] hover:bg-[#00E08A]/90 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-[#00E08A]/10 transition-all"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <a href="#video" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 w-full border-zinc-850 bg-zinc-900/40 text-zinc-350 hover:text-white hover:bg-zinc-900 rounded-xl text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-all"
                >
                  <Play className="mr-2 h-3.5 w-3.5 fill-current text-[#00E08A] border-none" />
                  Conhecer a Plataforma
                </Button>
              </a>
            </div>
          </div>

          {/* Right Mockup Side (Desktop + Tablet + Mobile mockup visual) */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[#00E08A]/5 blur-3xl opacity-60" />
            
            {/* Main Desktop Mockup */}
            <div className="relative border border-zinc-850 bg-zinc-950/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl w-full max-w-md transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-1.5 border-b border-zinc-900 px-4 py-3 bg-zinc-950/90">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-[9px] font-mono text-zinc-550 flex items-center gap-1">
                  <Monitor className="w-3 h-3" /> app.mktips.com/dashboard
                </span>
              </div>
              <div className="relative aspect-[16/10] bg-zinc-950">
                <Image
                  src="/dashboard-mockup.png"
                  alt="Dashboard da MK Tips"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Overlapping Tablet Mockup */}
              <div className="absolute -left-12 -bottom-8 border border-zinc-850 bg-zinc-950 rounded-xl overflow-hidden shadow-2xl w-32 hidden sm:block transform -rotate-6">
                <div className="flex items-center gap-1 border-b border-zinc-900 px-2 py-1.5 bg-zinc-950">
                  <Tablet className="w-2.5 h-2.5 text-zinc-500" />
                  <span className="text-[6px] font-mono text-zinc-650">Tablet</span>
                </div>
                <div className="relative aspect-[3/4] bg-zinc-950">
                  <Image src="/tips-mockup.png" alt="Tips Mockup" fill className="object-cover" />
                </div>
              </div>

              {/* Overlapping Mobile Mockup */}
              <div className="absolute -right-8 -bottom-10 border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden shadow-2xl w-24 transform rotate-6">
                <div className="flex items-center justify-center py-1 bg-zinc-950 border-b border-zinc-900">
                  <Smartphone className="w-2.5 h-2.5 text-zinc-500" />
                </div>
                <div className="relative aspect-[9/16] bg-zinc-950 h-36">
                  <Image src="/tips-mockup.png" alt="Mobile Mockup" fill className="object-cover" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
