'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LifeBuoy, ExternalLink, Clock, MessageSquare } from 'lucide-react'
import { db, DBTicket } from '@/lib/db'

export default function UserSupportPage() {
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDesc, setTicketDesc] = useState('')
  const [myTickets, setMyTickets] = useState<DBTicket[]>([])
  const [sending, setSending] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const refreshTickets = () => {
    const user = db.getActiveUser()
    const all = db.getTickets()
    const email = (user?.email || '').toLowerCase()
    const name = user?.name || ''
    const mine = all.filter((t) => {
      const cat = (t.category || '').toLowerCase()
      const first = t.messages[0]?.sender || ''
      return (
        (email && (cat === email || first.toLowerCase().includes(email))) ||
        (name && first.includes(name))
      )
    })
    setMyTickets(mine)
  }

  useEffect(() => {
    const load = async () => {
      await db.refresh()
      refreshTickets()
    }
    load()
    const onUpdate = () => refreshTickets()
    window.addEventListener('oddvault_db_update', onUpdate)
    return () => window.removeEventListener('oddvault_db_update', onUpdate)
  }, [])

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketDesc.trim()) return
    setSending(true)
    setSuccessMsg('')
    try {
      await db.refresh()
      const user = db.getActiveUser()
      db.addTicket({
        subject: ticketSubject.trim(),
        description: ticketDesc.trim(),
        category: user?.email || 'Suporte',
        userName: user?.name || 'Cliente',
        userEmail: user?.email || '',
      })
      db.addLog(
        'Support',
        `Ticket aberto: ${ticketSubject.trim()}`,
        user?.lastLoginIp || '0.0.0.0',
        user?.device || 'Web',
        user?.name || 'Cliente',
      )
      setTicketSubject('')
      setTicketDesc('')
      setSuccessMsg('Ticket aberto! Nossa equipe vai responder em breve no painel admin.')
      refreshTickets()
    } finally {
      setSending(false)
    }
  }

  const faqs = [
    {
      q: 'Como funciona a gestão de banca recomendada?',
      a: 'Cada tip indica um percentual de stake recomendado (e.g. 2%). Isso significa que você deve apostar 2% do valor total da sua banca configurada naquela entrada.',
    },
    {
      q: 'O que significa odd de valor (+EV)?',
      a: 'Valor Esperado positivo (+EV) ocorre quando a probabilidade estimada pelo nosso analista é superior à probabilidade implícita na odd da casa de aposta.',
    },
    {
      q: 'Em quanto tempo os resultados das tips são finalizados?',
      a: 'Geralmente em até 30 minutos após o término do evento esportivo.',
    },
  ]

  const statusColor = (s: string) =>
    s === 'Aberto'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : s === 'Respondido'
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        : 'text-zinc-400 bg-zinc-800 border-zinc-700'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Suporte & FAQ</h1>
        <p className="text-sm text-zinc-400">
          Abra chamados técnicos, consulte a base de conhecimento ou fale direto pelo WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Abrir Novo Ticket de Suporte</CardTitle>
            <CardDescription>O chamado aparece na hora no painel do admin.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateTicket}>
            <CardContent className="space-y-4 text-xs">
              {successMsg ? (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px]">
                  {successMsg}
                </div>
              ) : null}
              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Assunto do Chamado</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Ex.: Dúvida sobre depósito na Betano"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Descrição do Problema</label>
                <textarea
                  required
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Escreva detalhadamente..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white h-24 resize-none"
                />
              </div>
            </CardContent>
            <div className="p-6 border-t border-zinc-850 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-black font-semibold rounded text-xs transition-colors cursor-pointer"
              >
                {sending ? 'Enviando…' : 'Abrir Ticket'}
              </button>
            </div>
          </form>
        </Card>

        <Card className="border-zinc-850 bg-zinc-900/30 flex flex-col justify-between">
          <div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Canais de Contato Rápido</CardTitle>
              <CardDescription>Respostas instantâneas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-900/40 rounded border border-zinc-850 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">WhatsApp VIP</span>
                  <span className="text-[10px] text-zinc-500">Exclusivo para assinantes</span>
                </div>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </CardContent>
          </div>
          <div className="p-6 border-t border-zinc-850">
            <div className="flex items-center gap-2.5 text-zinc-500 text-xs">
              <LifeBuoy className="w-4 h-4 shrink-0" />
              <span>Horário: Segunda a Sábado, 09h às 21h.</span>
            </div>
          </div>
        </Card>
      </div>

      {myTickets.length > 0 ? (
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Meus tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myTickets.map((t) => (
              <div key={t.id} className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/50 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{t.subject}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${statusColor(t.status)}`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">{t.messages[0]?.text}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <Clock className="w-3 h-3" />
                  {t.createdAt ? new Date(t.createdAt).toLocaleString('pt-BR') : '—'}
                </div>
                {t.messages.length > 1 ? (
                  <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                    {t.messages.slice(1).map((m, i) => (
                      <div key={i} className="text-[11px]">
                        <span className="text-emerald-400 font-semibold">{m.sender}: </span>
                        <span className="text-zinc-300">{m.text}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Perguntas Frequentes (FAQ)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-zinc-850 bg-zinc-900/10">
              <CardContent className="p-4 space-y-2 text-xs">
                <h4 className="font-bold text-white leading-snug">{faq.q}</h4>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
