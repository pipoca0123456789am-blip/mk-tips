'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBTicket } from '@/lib/db'
import { LifeBuoy, MessageSquare, Send, RefreshCw } from 'lucide-react'

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<DBTicket[]>([])
  const [selected, setSelected] = useState<DBTicket | null>(null)
  const [reply, setReply] = useState('')
  const [filter, setFilter] = useState<'todos' | 'Aberto' | 'Respondido' | 'Fechado'>('todos')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      await db.refresh()
      const list = db.getTickets()
      setTickets(list)
      if (selected) {
        const fresh = list.find((t) => t.id === selected.id) || null
        setSelected(fresh)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const onUpdate = () => {
      const list = db.getTickets()
      setTickets(list)
    }
    window.addEventListener('oddvault_db_update', onUpdate)
    return () => window.removeEventListener('oddvault_db_update', onUpdate)
  }, [])

  const filtered =
    filter === 'todos' ? tickets : tickets.filter((t) => t.status === filter)

  const openCount = tickets.filter((t) => t.status === 'Aberto').length

  const handleReply = () => {
    if (!selected || !reply.trim()) return
    const updated = db.replyTicket(selected.id, reply.trim(), 'Suporte MK Tips')
    setReply('')
    setTickets(db.getTickets())
    if (updated) setSelected(updated)
  }

  const handleStatus = (status: DBTicket['status']) => {
    if (!selected) return
    db.updateTicketStatus(selected.id, status)
    const list = db.getTickets()
    setTickets(list)
    setSelected(list.find((t) => t.id === selected.id) || null)
  }

  const statusColor = (s: string) =>
    s === 'Aberto'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : s === 'Respondido'
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        : 'text-zinc-400 bg-zinc-800 border-zinc-700'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <LifeBuoy className="w-7 h-7 text-emerald-400" />
            Tickets de Suporte
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {openCount > 0
              ? `${openCount} ticket${openCount > 1 ? 's' : ''} aberto${openCount > 1 ? 's' : ''} aguardando resposta`
              : 'Nenhum ticket aberto no momento'}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-850 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['todos', 'Aberto', 'Respondido', 'Fechado'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border transition-colors ${
              filter === f
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {f === 'todos' ? 'Todos' : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2 border-zinc-850 bg-zinc-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">Chamados</CardTitle>
            <CardDescription>{filtered.length} ticket(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[70vh] overflow-y-auto">
            {loading && tickets.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">Carregando…</p>
            ) : filtered.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">Nenhum ticket neste filtro.</p>
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(t)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    selected?.id === t.id
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-white line-clamp-1">{t.subject}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 truncate">
                    {t.messages[0]?.sender || t.category || 'Cliente'}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString('pt-BR') : '—'}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-zinc-850 bg-zinc-900/30 min-h-[420px]">
          {!selected ? (
            <CardContent className="h-full flex flex-col items-center justify-center gap-2 py-20 text-zinc-500">
              <MessageSquare className="w-8 h-8 opacity-40" />
              <p className="text-xs">Selecione um ticket para ver e responder</p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="border-b border-zinc-850 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-white">{selected.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      {selected.messages[0]?.sender || selected.category}
                    </CardDescription>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border self-start ${statusColor(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(['Aberto', 'Respondido', 'Fechado'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatus(s)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Marcar {s}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                  {selected.messages.map((m, i) => {
                    const isSupport = m.sender.toLowerCase().includes('suporte')
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs ${
                          isSupport
                            ? 'bg-emerald-500/5 border-emerald-500/20 ml-4'
                            : 'bg-zinc-950/60 border-zinc-800 mr-4'
                        }`}
                      >
                        <div className="flex justify-between gap-2 mb-1">
                          <span className="font-bold text-zinc-200 text-[11px]">{m.sender}</span>
                          <span className="text-[9px] text-zinc-550">
                            {m.timestamp ? new Date(m.timestamp).toLocaleString('pt-BR') : ''}
                          </span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      </div>
                    )
                  })}
                </div>

                {selected.status !== 'Fechado' ? (
                  <div className="flex gap-2 pt-2 border-t border-zinc-850">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Escreva a resposta ao cliente…"
                      className="flex-1 p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs h-20 resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleReply}
                      disabled={!reply.trim()}
                      className="self-end px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 border-t border-zinc-850 pt-3">
                    Ticket fechado. Reabra o status para responder.
                  </p>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
