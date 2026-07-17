'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Cta({ onStartFree }: { onStartFree: () => void }) {
  return (
    <section className="relative py-24 sm:py-32 bg-black overflow-hidden border-t border-zinc-900/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Glowing Box */}
        <div className="relative overflow-hidden rounded-3xl border border-[#00E08A]/35 bg-zinc-950/80 px-6 py-16 text-center sm:px-16 shadow-xl shadow-[#00E08A]/5 backdrop-blur-md">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[560px] -translate-x-1/2 rounded-full bg-[#00E08A]/10 blur-[130px]" />

          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="text-balance text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Pronto para conhecer uma plataforma feita para quem quer acompanhar o mercado esportivo com mais organização?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Escolha seu plano e tenha acesso imediato.
            </p>
            <div className="flex justify-center pt-2">
              <Button
                onClick={onStartFree}
                size="lg"
                className="group h-13 w-full sm:w-auto bg-[#00E08A] hover:bg-[#00E08A]/90 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-[#00E08A]/10 transition-all"
              >
                QUERO ENTRAR AGORA
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
