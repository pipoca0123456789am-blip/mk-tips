'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBTip } from '@/lib/db'

export default function UserHistoryPage() {
  const [history, setHistory] = useState<DBTip[]>([])
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Green' | 'Red' | 'Void'>('Todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await db.refresh()
      const resolved = db.getTips().filter((t) => t.status !== 'Pendente')
      setHistory(resolved)
      setLoading(false)
    }
    load()
    const onUpdate = () => load()
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

  const filteredHistory = statusFilter === 'Todos'
    ? history
    : history.filter(t => t.status === statusFilter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Histórico</h1>
          <p className="text-sm text-zinc-400">Consulte o histórico de todas as tips finalizadas pela plataforma.</p>
        </div>
        <div className="flex gap-2">
          {['Todos', 'Green', 'Red', 'Void'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-zinc-850 bg-zinc-900/20 overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 font-semibold">
                <th className="p-4">Evento / Liga</th>
                <th className="p-4">Mercado / Entrada</th>
                <th className="p-4 text-center">Odd</th>
                <th className="p-4 text-center">Stake</th>
                <th className="p-4 text-center">Resultado</th>
                <th className="p-4 text-right">Retorno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 text-zinc-300">
              {filteredHistory.map(tip => {
                const profitUnits = tip.status === 'Green' 
                  ? parseFloat(((tip.odd - 1) * tip.stake).toFixed(2)) 
                  : tip.status === 'Red' 
                  ? -tip.stake 
                  : 0

                return (
                  <tr key={tip.id} className="hover:bg-zinc-900/20">
                    <td className="p-4">
                      <p className="font-bold text-white leading-tight">{tip.match}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{tip.sport} • {tip.league}</p>
                    </td>
                    <td className="p-4 text-zinc-400">
                      <p>{tip.market}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Seleção: {tip.type}</p>
                    </td>
                    <td className="p-4 text-center font-semibold text-white">Odd {tip.odd}</td>
                    <td className="p-4 text-center text-zinc-400">{tip.stake}%</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                        tip.status === 'Green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        tip.status === 'Red' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        'bg-zinc-900 border-zinc-800 text-zinc-550'
                      }`}>
                        {tip.status}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-bold ${profitUnits > 0 ? 'text-emerald-400' : profitUnits < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
                      {profitUnits > 0 ? `+${profitUnits}u` : profitUnits < 0 ? `${profitUnits}u` : '0.00u'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
