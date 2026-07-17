'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Target, TrendingUp, ShieldAlert, BarChart3, HelpCircle } from 'lucide-react'

interface MatchDetailsProps {
  match: {
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
  onClose: () => void
}

export function MatchDetails({ match, onClose }: MatchDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl border-zinc-800 bg-zinc-950/90 text-xs relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer text-base">✕</button>

        <CardHeader className="text-center space-y-2 border-b border-zinc-900 pb-6">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">{match.league}</span>
          
          <div className="flex items-center justify-center gap-8 py-4">
            {/* Home team */}
            <div className="flex flex-col items-center gap-2 flex-1 text-right">
              <span className="text-3xl select-none">{match.mandanteFlag}</span>
              <span className="font-black text-sm text-white">{match.mandante}</span>
            </div>

            {/* Score / VS */}
            <div className="text-center shrink-0 min-w-[80px]">
              {match.status === 'AO VIVO' || match.status === 'INTERVALO' || match.status === 'ENCERRADO' ? (
                <div className="space-y-1">
                  <span className="text-2xl font-black tracking-widest text-emerald-400 font-mono">{match.score}</span>
                  <span className="block text-[9px] text-zinc-500 uppercase font-bold">{match.minute}' min</span>
                </div>
              ) : (
                <span className="text-zinc-500 font-bold text-lg">VS</span>
              )}
            </div>

            {/* Away team */}
            <div className="flex flex-col items-center gap-2 flex-1 text-left">
              <span className="text-3xl select-none">{match.visitanteFlag}</span>
              <span className="font-black text-sm text-white">{match.visitante}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Match statistics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Estatísticas ao Vivo
            </h3>
            <div className="space-y-2 p-4 bg-zinc-900/30 rounded-lg border border-zinc-900">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400"><span className="font-bold">Posse de Bola</span><span>58% vs 42%</span></div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden flex"><div className="bg-emerald-500 h-full" style={{ width: '58%' }} /><div className="bg-zinc-700 h-full" style={{ width: '42%' }} /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400"><span className="font-bold">Chutes a Gol</span><span>7 vs 3</span></div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden flex"><div className="bg-emerald-500 h-full" style={{ width: '70%' }} /><div className="bg-zinc-700 h-full" style={{ width: '30%' }} /></div>
              </div>
            </div>
          </div>

          {/* Related tips */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Tips Recomendadas para este Jogo
            </h3>
            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-850 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase">Ambos Marcam - Sim</span>
                  <p className="text-[10px] text-zinc-400 mt-2">Justificativa: Ambas as equipes possuem taxas de gols marcados superiores a 75% jogando nestas condições.</p>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] text-zinc-500 uppercase font-bold">Odd Recomendada</span>
                  <span className="text-lg font-black text-emerald-400">Odd 1.85</span>
                </div>
              </div>

              {/* Affiliate CTA */}
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-xs transition-colors cursor-pointer"
              >
                Desbloquear Aposta & Ver Melhor Odd (Login Necessário)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
