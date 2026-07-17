'use client'

import React from 'react'

const bookmakers = [
  'Bet365',
  'Betano',
  'Stake',
  'KTO',
  'Superbet',
  'Betfair',
  'Novibet',
  'Betnacional'
]

export function Bookmakers() {
  return (
    <section className="border-y border-zinc-900 bg-zinc-950/40 py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-550">
          Integração e Comparação de Odds em Tempo Real
        </p>
        
        {/* Infinite Marquee Container */}
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max items-center gap-16 animate-marquee">
            {[...bookmakers, ...bookmakers, ...bookmakers].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="whitespace-nowrap text-base sm:text-lg font-black tracking-wider text-zinc-500 hover:text-white transition-colors duration-250 cursor-default uppercase"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
