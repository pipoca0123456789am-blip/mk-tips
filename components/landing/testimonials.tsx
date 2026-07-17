'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Mateus Silva',
    city: 'São Paulo - SP',
    review: 'A audição de ROI é o maior diferencial. Já passei por muitos grupos que apagavam reds, mas a MK Tips registra absolutamente tudo de forma transparente. Minha banca cresceu consistentemente no último mês.',
    rating: 5,
    date: '12/07/2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80'
  },
  {
    name: 'Thiago Mendes',
    city: 'Belo Horizonte - MG',
    review: 'As notificações instantâneas e a ferramenta de melhor odd integrada economizam um tempo precioso. Consigo entrar na Betano ou Stake com um clique e a melhor cotação disponível.',
    rating: 5,
    date: '10/07/2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80'
  },
  {
    name: 'Bruno Ramos',
    city: 'Rio de Janeiro - RJ',
    review: 'A calculadora de stakes na gestão de banca mudou minha relação com apostas. Consigo proteger meu capital mesmo em sequências difíceis. Indispensável para iniciantes e veteranos.',
    rating: 5,
    date: '08/07/2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80'
  }
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[activeIndex]

  return (
    <section id="depoimentos" className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="pointer-events-none absolute right-1/3 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[110px]" />
      
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Prova Social
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Quem usa recomenda a plataforma
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Veja depoimentos reais e auditados de membros ativos do nosso ecossistema de investimentos.
          </p>
        </div>

        {/* Testimonials Box */}
        <div className="relative border border-zinc-900 bg-zinc-950/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl space-y-6 shadow-xl shadow-[#00E08A]/2">
          {/* Stars */}
          <div className="flex gap-1 text-yellow-500">
            {Array.from({ length: current.rating }).map((_, i) => (
              <Star key={i} className="w-4.5 h-4.5 fill-current border-none" />
            ))}
          </div>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed italic">
            "{current.review}"
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-3">
              <img src={current.avatar} alt={current.name} className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white leading-none">{current.name}</h4>
                <span className="text-[10px] text-zinc-550 mt-1 block font-semibold">{current.city}</span>
              </div>
            </div>
            <span className="text-[10px] text-zinc-650 font-bold">{current.date}</span>
          </div>

          {/* Slider controls */}
          <div className="absolute -bottom-6 right-8 flex gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-450 hover:text-white cursor-pointer transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-[#00E08A] hover:text-[#00E08A]/90 cursor-pointer transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
