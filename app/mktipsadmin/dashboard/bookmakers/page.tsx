'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Check, Building, Trash2 } from 'lucide-react'
import { db } from '@/lib/db'

export default function AdminBookmakersPage() {
  const activeUser = db.getActiveUser()
  const allBooks = db.getBookmakers()

  // Seed default ones if empty
  React.useEffect(() => {
    if (allBooks.length === 0) {
      const defaults = [
        { id: 'b1', name: 'Betano', logo: 'B', url: 'https://www.betano.com', clicks: 1240, conversions: 89, ctr: '7.1%', status: 'Ativo', tipsterId: '00000000-0000-0000-0000-000000000000' },
        { id: 'b2', name: 'Bet365', logo: '3', url: 'https://www.bet365.com', clicks: 980, conversions: 72, ctr: '7.3%', status: 'Ativo', tipsterId: '00000000-0000-0000-0000-000000000000' },
        { id: 'b3', name: 'Stake', logo: 'S', url: 'https://www.stake.com', clicks: 450, conversions: 31, ctr: '6.8%', status: 'Ativo', tipsterId: '00000000-0000-0000-0000-000000000000' }
      ]
      db.setBookmakers(defaults)
    }
  }, [allBooks])

  const myBookmakers = allBooks.filter(b => b.tipsterId === activeUser.id)

  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !url) return
    const newBook = {
      id: `b-${Date.now()}`,
      name,
      logo: name.charAt(0),
      url,
      clicks: 0,
      conversions: 0,
      ctr: '0%',
      status: 'Ativo',
      tipsterId: activeUser.id
    }
    db.setBookmakers([...allBooks, newBook])
    db.addAuditLog(activeUser.name, 'ADD_BOOKMAKER', name, '', url)
    setShowAdd(false)
    setName('')
    setUrl('')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Casas de Apostas</h1>
          <p className="text-sm text-zinc-400">Configure links de afiliados e compare taxas de conversão de cliques.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Cadastrar Casa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {myBookmakers.map((book, i) => (
          <Card key={i} className="border-zinc-850 bg-zinc-900/30">
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  {book.logo}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{book.name}</h3>
                  <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">{book.url}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {book.status}
              </span>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-zinc-850 pb-2"><span className="text-zinc-500">Cliques:</span><span className="text-white font-bold">{book.clicks}</span></div>
              <div className="flex justify-between border-b border-zinc-850 pb-2"><span className="text-zinc-500">Conversão (CTR):</span><span className="text-emerald-400 font-bold">{book.ctr}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Novos Cadastros:</span><span className="text-white font-bold">{book.conversions}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base font-bold">Cadastrar Casa de Apostas</CardTitle>
              <CardDescription>Configure URLs para UTMs dinâmicas.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAdd}>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Nome da Casa</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Betano"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Link Afiliado base</label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://www.betano.com"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none"
                  />
                </div>
              </CardContent>
              <div className="p-6 border-t border-zinc-850 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold rounded hover:bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded cursor-pointer"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
