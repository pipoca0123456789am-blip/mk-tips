'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { db, DBTip, DBUser } from '@/lib/db'
import { Bookmark, Share2, Copy, ExternalLink, Flame, Info, Check, Eye } from 'lucide-react'

export default function UserTipsPage() {
  const [tips, setTips] = useState<DBTip[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [sportFilter, setSportFilter] = useState('Todos')
  const [copiedTipId, setCopiedTipId] = useState<string | null>(null)
  
  // Odds comparison modal state
  const [comparingTip, setComparingTip] = useState<DBTip | null>(null)

  const [user, setUser] = useState<DBUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await db.refresh()
      const currentUser = db.getActiveUser()
      setUser(currentUser)

      const allActiveTips = db.getTips().filter((t) => t.status === 'Pendente')
      const filteredTips = currentUser?.tipsterId
        ? allActiveTips.filter((t) => t.tipsterId === currentUser.tipsterId)
        : allActiveTips
      setTips(filteredTips)
      setFavorites(db.getFavorites())
      setLoading(false)
    }

    load()
    const onUpdate = () => {
      load()
    }
    window.addEventListener('oddvault_db_update', onUpdate)
    return () => window.removeEventListener('oddvault_db_update', onUpdate)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#00E08A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleFavorite = (tipId: string) => {
    let nextFavs = [...favorites]
    if (nextFavs.includes(tipId)) {
      nextFavs = nextFavs.filter(id => id !== tipId)
    } else {
      nextFavs.push(tipId)
    }
    setFavorites(nextFavs)
    db.setFavorites(nextFavs)
  }

  const handleCopyTip = (tip: DBTip) => {
    const text = `🎯 TIP DO DIA: ${tip.match}\n🏆 Campeonato: ${tip.league}\n📊 Mercado: ${tip.market} (${tip.type})\n🔥 Cotação: Odd ${tip.odd}\n💰 Stake Sugerida: ${tip.stake}%`
    navigator.clipboard.writeText(text)
    setCopiedTipId(tip.id)
    setTimeout(() => setCopiedTipId(null), 2000)
  }

  const isFree = user?.plan === 'Free'
  const isStarter = user?.plan === 'Starter' || user?.plan === 'Starter Mensal'
  const limit = isFree ? 3 : (isStarter ? 5 : 999)

  const filteredTips = sportFilter === 'Todos' 
    ? tips 
    : tips.filter(t => t.sport === sportFilter)

  const displayedTips = filteredTips.slice(0, limit)
  const lockedCount = filteredTips.length - displayedTips.length

  return (
    <div className="space-y-6">
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Tips do Dia</h1>
          <p className="text-sm text-zinc-400">Analise as melhores oportunidades ativas e faça suas entradas.</p>
        </div>
        <div className="flex gap-2">
          {['Todos', 'Futebol', 'Basquete'].map(sport => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                sportFilter === sport
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedTips.map(tip => {
          const isFav = favorites.includes(tip.id)
          return (
            <Card key={tip.id} className="border-zinc-850 bg-gradient-to-b from-zinc-900/30 to-black hover:border-zinc-700/60 transition-all flex flex-col justify-between">
              {/* Card Header */}
              <CardHeader className="flex flex-row justify-between items-start pb-2 border-b border-zinc-850/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold uppercase tracking-wider">{tip.sport}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">{tip.league}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">{tip.match}</h3>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleFavorite(tip.id)}
                    className={`p-2 rounded bg-zinc-900/60 border border-zinc-850 transition-colors cursor-pointer ${
                      isFav ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => handleCopyTip(tip)}
                    className="p-2 rounded bg-zinc-900/60 border border-zinc-850 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                    title="Copiar aposta"
                  >
                    {copiedTipId === tip.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="py-4 space-y-4 text-xs">
                {/* Bet selection */}
                <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-850 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Mercado</span>
                    <h4 className="font-bold text-white mt-0.5">{tip.market}</h4>
                    <p className="text-[10px] text-zinc-400">Entrada: {tip.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Cotação Principal</span>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">Odd {tip.odd}</p>
                  </div>
                </div>

                {/* Justification details */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-emerald-500" />
                    Justificativa do Tipster
                  </span>
                  <p className="text-zinc-400 text-xs italic leading-relaxed">"{tip.justification}"</p>
                </div>

                {/* Confidence, EV and Probability */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-900/10 p-3 rounded-lg border border-zinc-850/60 text-center">
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-semibold">Confiança</span>
                    <span className="font-bold text-white">{tip.confidence}/10</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-semibold">Valor Esp. (+EV)</span>
                    <span className="font-bold text-emerald-400">+{tip.ev}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-semibold">Stake Sugerida</span>
                    <span className="font-bold text-zinc-300">{tip.stake}%</span>
                  </div>
                </div>
              </CardContent>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-zinc-850/50 flex gap-2">
                <button
                  onClick={() => setComparingTip(tip)}
                  className="flex-1 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold rounded text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Comparar Odds
                </button>
                <a
                  href={tip.affiliateUrl}
                  target="_blank"
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  Apostar Agora
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Locked Tips Banner */}
      {lockedCount > 0 && (
        <Card className="border-zinc-850 bg-gradient-to-b from-zinc-900/40 to-black relative overflow-hidden p-8 rounded-2xl flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-pulse">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">🔥 Mais {lockedCount} {lockedCount === 1 ? 'tip está' : 'tips estão'} bloqueadas!</h3>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mb-5">
            Seu plano atual ({user?.plan === 'Free' ? '7 Dias Grátis' : 'Starter'}) possui um limite diário de {limit} tips. Faça o upgrade agora para ter acesso ilimitado a todas as oportunidades do dia!
          </p>
          <a
            href="/dashboard/subscription"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg text-xs transition-colors shadow-lg shadow-emerald-500/15 cursor-pointer"
          >
            Fazer Upgrade do Plano
          </a>
        </Card>
      )}

      {/* Odds Comparison Drawer/Modal */}
      {comparingTip && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
            <CardHeader className="flex flex-row justify-between items-center pb-4 border-b border-zinc-850">
              <div>
                <h3 className="text-base font-bold text-white">Comparador de Odds</h3>
                <p className="text-[10px] text-zinc-500">Destacando a melhor odd disponível para esta entrada.</p>
              </div>
              <button onClick={() => setComparingTip(null)} className="text-zinc-500 hover:text-white text-xs cursor-pointer">Fechar</button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-850 px-6">
                {comparingTip.oddsComparison.map((comp, idx) => {
                  const isBest = comp.odd === Math.max(...comparingTip.oddsComparison.map(c => c.odd))
                  return (
                    <div key={idx} className="py-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-zinc-900 flex items-center justify-center font-bold text-xs text-white uppercase">{comp.bookmaker.charAt(0)}</span>
                        <span className="text-xs font-bold text-white">{comp.bookmaker}</span>
                        {isBest && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.5 rounded font-extrabold uppercase">Melhor Cotação</span>}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-black ${isBest ? 'text-emerald-400' : 'text-zinc-500'}`}>Odd {comp.odd}</span>
                        <a
                          href={comparingTip.affiliateUrl}
                          target="_blank"
                          className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-200 font-bold rounded hover:bg-zinc-800"
                        >
                          Ir
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
