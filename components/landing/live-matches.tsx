'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MatchDetails } from './match-details'
import { Radio, Calendar, Trophy } from 'lucide-react'

interface Match {
  id: string
  mandante: string
  visitante: string
  mandanteFlag: string
  visitanteFlag: string
  time: string
  league: string
  status: 'EM BREVE' | 'AO VIVO' | 'INTERVALO' | 'ENCERRADO'
  minute?: number
  score?: string
  sport: string
}

export function LiveMatches() {
  const [filter, setFilter] = useState<'Todos' | 'AO VIVO' | 'Hoje' | 'Futebol'>('Todos')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  
  // Real time simulation states
  const [matches, setMatches] = useState<Match[]>([
    { id: 'm1', mandante: 'Brasil', visitante: 'Argentina', mandanteFlag: '🇧🇷', visitanteFlag: '🇦🇷', time: 'Hoje • 21:45', league: 'Eliminatórias Copa do Mundo', status: 'EM BREVE', sport: 'Futebol' },
    { id: 'm2', mandante: 'Corinthians', visitante: 'Palmeiras', mandanteFlag: '🇧🇷', visitanteFlag: '🇧🇷', time: 'Hoje • 18:30', league: 'Brasileirão Série A', status: 'AO VIVO', minute: 67, score: '1 x 0', sport: 'Futebol' },
    { id: 'm3', mandante: 'Real Madrid', visitante: 'Barcelona', mandanteFlag: '🇪🇸', visitanteFlag: '🇪🇸', time: 'Hoje • 17:00', league: 'La Liga', status: 'EM BREVE', sport: 'Futebol' },
    { id: 'm4', mandante: 'Liverpool', visitante: 'Manchester City', mandanteFlag: '🇬🇧', visitanteFlag: '🇬🇧', time: 'Amanhã • 16:00', league: 'Premier League', status: 'EM BREVE', sport: 'Futebol' }
  ])

  useEffect(() => {
    // Dynamic game timers
    const interval = setInterval(() => {
      setMatches(prev => prev.map(m => {
        if (m.status === 'AO VIVO' && m.minute) {
          const nextMin = m.minute + 1
          let nextScore = m.score
          // Simulate random goal at min 72
          if (nextMin === 72) {
            nextScore = '1 x 1'
          }
          return {
            ...m,
            minute: nextMin > 90 ? 90 : nextMin,
            score: nextScore,
            status: nextMin >= 90 ? 'ENCERRADO' : 'AO VIVO'
          }
        }
        return m
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredMatches = matches.filter(m => {
    if (filter === 'Todos') return true
    if (filter === 'AO VIVO') return m.status === 'AO VIVO'
    if (filter === 'Hoje') return m.time.includes('Hoje')
    if (filter === 'Futebol') return m.sport === 'Futebol'
    return true
  })

  return (
    <section className="py-12 bg-zinc-950/40 border-y border-zinc-900 relative">
      {selectedMatch && (
        <MatchDetails match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              Eventos ao Vivo & Próximos Jogos
            </h2>
            <p className="text-xs text-zinc-400">Clique em qualquer jogo para ver odds estimadas e análises exclusivas.</p>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-1.5 flex-wrap">
            {['Todos', 'AO VIVO', 'Hoje', 'Futebol'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 bg-zinc-900 border text-[10px] font-bold rounded-full transition-all cursor-pointer ${
                  filter === f ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-zinc-850 text-zinc-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Sliding Grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {filteredMatches.map(match => (
            <div 
              key={match.id} 
              onClick={() => setSelectedMatch(match)}
              className="min-w-[280px] md:min-w-[320px] flex-shrink-0 cursor-pointer"
            >
              <Card className="border-zinc-850 hover:border-zinc-700 bg-zinc-900/10 transition-all">
                <CardContent className="p-4 space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-semibold border-b border-zinc-850/60 pb-2">
                    <span>{match.league}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-black border uppercase tracking-wide text-[8px] ${
                      match.status === 'AO VIVO' 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : 'bg-zinc-800 border-zinc-750 text-zinc-400'
                    }`}>
                      {match.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    {/* Home */}
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl select-none">{match.mandanteFlag}</span>
                      <span className="font-bold text-white">{match.mandante}</span>
                    </div>

                    {/* Score */}
                    {match.status === 'AO VIVO' ? (
                      <span className="font-mono font-black text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">{match.score}</span>
                    ) : (
                      <span className="text-[10px] text-zinc-550 font-bold">VS</span>
                    )}

                    {/* Away */}
                    <div className="flex items-center gap-2.5 flex-row-reverse">
                      <span className="text-xl select-none">{match.visitanteFlag}</span>
                      <span className="font-bold text-white">{match.visitante}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1">
                    <span>{match.time}</span>
                    {match.status === 'AO VIVO' && (
                      <span className="font-mono text-zinc-400 font-bold">{match.minute}' min</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
