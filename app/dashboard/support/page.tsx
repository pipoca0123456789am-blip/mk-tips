'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LifeBuoy, Send, MessageSquare, ExternalLink } from 'lucide-react'

export default function UserSupportPage() {
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDesc, setTicketDesc] = useState('')

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketDesc) return
    alert('Ticket aberto com sucesso! Nossa equipe de suporte responderá em até 2 horas.')
    setTicketSubject('')
    setTicketDesc('')
  }

  const faqs = [
    { q: 'Como funciona a gestão de banca recomendada?', a: 'Cada tip indica um percentual de stake recomendado (e.g. 2%). Isso significa que você deve apostar 2% do valor total da sua banca configurada naquela entrada.' },
    { q: 'O que significa odd de valor (+EV)?', a: 'Valor Esperado positivo (+EV) ocorre quando a probabilidade estimada pelo nosso analista é superior à probabilidade implícita na odd da casa de aposta.' },
    { q: 'Em quanto tempo os resultados das tips são finalizados?', a: 'Geralmente em até 30 minutos após o término do evento esportivo.' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Suporte & FAQ</h1>
        <p className="text-sm text-zinc-400">Abra chamados técnicos, consulte a base de conhecimento ou fale direto pelo WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket builder */}
        <Card className="lg:col-span-2 border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Abrir Novo Ticket de Suporte</CardTitle>
            <CardDescription>Preencha os dados e anexe prints se necessário.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateTicket}>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Assunto do Chamado</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  placeholder="E.g. Dúvida sobre depósito na Betano"
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Descrição do Problema</label>
                <textarea
                  required
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  placeholder="Escreva detalhadamente..."
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white h-24 resize-none"
                />
              </div>
            </CardContent>
            <div className="p-6 border-t border-zinc-850 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-xs transition-colors cursor-pointer"
              >
                Abrir Ticket
              </button>
            </div>
          </form>
        </Card>

        {/* Quick Contact */}
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
              <span>Horário de atendimento: Segunda a Sábado das 09h às 21h.</span>
            </div>
          </div>
        </Card>
      </div>

      {/* FAQs */}
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
