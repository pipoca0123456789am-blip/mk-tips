'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBTip } from '@/lib/db'
import { Bookmark, ExternalLink } from 'lucide-react'

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<DBTip[]>([])

  useEffect(() => {
    const favIds = db.getFavorites()
    const allTips = db.getTips()
    setFavorites(allTips.filter(t => favIds.includes(t.id)))
  }, [])

  const removeFavorite = (tipId: string) => {
    const favIds = db.getFavorites().filter(id => id !== tipId)
    db.setFavorites(favIds)
    setFavorites(favorites.filter(t => t.id !== tipId))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Favoritas</h1>
        <p className="text-sm text-zinc-400">Suas oportunidades salvas para acompanhar e apostar depois.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {favorites.map(tip => (
            <Card key={tip.id} className="border-zinc-850 bg-zinc-900/30">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <div>
                  <span className="px-2 py-0.5 bg-zinc-850 rounded text-[9px] font-bold text-zinc-400 border border-zinc-800 uppercase tracking-wider">{tip.sport}</span>
                  <h3 className="text-base font-bold text-white mt-1.5">{tip.match}</h3>
                </div>
                <button
                  onClick={() => removeFavorite(tip.id)}
                  className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex justify-between items-center p-3 bg-zinc-900/40 rounded border border-zinc-850">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold block uppercase">Mercado</span>
                    <h4 className="font-bold text-white mt-0.5">{tip.market} ({tip.type})</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-zinc-500 font-bold block uppercase">Odd</span>
                    <h4 className="text-lg font-black text-emerald-400 mt-0.5">Odd {tip.odd}</h4>
                  </div>
                </div>

                <a
                  href={tip.affiliateUrl}
                  target="_blank"
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  Apostar Agora
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-zinc-850 bg-transparent flex flex-col items-center justify-center p-16 text-center">
          <Bookmark className="w-8 h-8 text-zinc-650 mb-3" />
          <p className="text-zinc-400 font-semibold text-xs">Nenhuma Tip Salva</p>
          <p className="text-[10px] text-zinc-550 mt-1 max-w-xs">Ao navegar pelas tips do dia, clique na bandeira de favoritos para salvá-las aqui.</p>
        </Card>
      )}
    </div>
  )
}
