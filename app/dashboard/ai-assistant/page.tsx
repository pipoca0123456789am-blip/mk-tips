'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBTip, DBTipster } from '@/lib/db'
import { Bot, Send, Sparkles, User, AlertCircle, Lock } from 'lucide-react'

export default function UserAIAssistant() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; date: string }[]>([
    { sender: 'bot', text: 'Olá! Sou o assistente OddVault AI. Pergunte-me sobre as melhores tips de hoje, tipster com maior lucro ou comparativo de odds.', date: new Date().toLocaleTimeString() }
  ])
  const [input, setInput] = useState('')
  const [tips, setTips] = useState<DBTip[]>([])
  const [tipsters, setTipsters] = useState<DBTipster[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(db.getActiveUser())
    setTips(db.getTips())
    setTipsters(db.getTipsters())
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { sender: 'user' as const, text: input, date: new Date().toLocaleTimeString() }
    setMessages(prev => [...prev, userMsg])
    const query = input.toLowerCase()
    setInput('')

    // Simulate AI response based on real local storage DB queries
    setTimeout(() => {
      let botResponse = ''

      if (query.includes('melhor odd') || query.includes('melhores odds')) {
        const sorted = [...tips].sort((a, b) => b.odd - a.odd)
        if (sorted.length > 0) {
          botResponse = `A tip com a maior cotação ativa é para o evento **${sorted[0].match}** no mercado **${sorted[0].market}** com uma odd de **${sorted[0].odd}**.`
        } else {
          botResponse = 'Não encontrei tips disponíveis no momento.'
        }
      } else if (query.includes('melhores tips') || query.includes('tips de hoje') || query.includes('dicas')) {
        const active = tips.filter(t => t.status === 'Pendente')
        if (active.length > 0) {
          botResponse = `Hoje temos ${active.length} tips ativas:\n\n` + active.map((t, idx) => `${idx + 1}. **${t.match}** - ${t.market} (Odd ${t.odd})`).join('\n')
        } else {
          botResponse = 'Não há novas tips publicadas para hoje ainda.'
        }
      } else if (query.includes('confiança') || query.includes('mais confiável')) {
        const sorted = [...tips].sort((a, b) => b.confidence - a.confidence)
        if (sorted.length > 0) {
          botResponse = `A tip com maior nível de confiança hoje é **${sorted[0].match}** (Confiança: **${sorted[0].confidence}/10**) no mercado **${sorted[0].market}**.`
        } else {
          botResponse = 'Não encontrei tips de confiança registradas.'
        }
      } else if (query.includes('tipster') || query.includes('analista') || query.includes('lucro')) {
        const sorted = [...tipsters].sort((a, b) => b.stats.roi - a.stats.roi)
        if (sorted.length > 0) {
          botResponse = `O tipster de maior destaque hoje é o **${sorted[0].name}** com um ROI histórico de **+${sorted[0].stats.roi}%** e precisão de **${sorted[0].stats.accuracy}%**.`
        } else {
          botResponse = 'Não há tipsters cadastrados.'
        }
      } else {
        botResponse = 'Desculpe, não entendi sua pergunta. Tente perguntar:\n- "Quais são as melhores tips de hoje?"\n- "Qual tip possui melhor odd?"\n- "Qual tipster tem maior ROI?"'
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, date: new Date().toLocaleTimeString() }])
    }, 1000)
  }

  if (user?.plan === 'Free' || user?.plan === 'Starter') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-emerald-500" />
            Central de IA
          </h1>
          <p className="text-sm text-zinc-400">Tire dúvidas sobre odds, tips de alta confiança e estatísticas de analistas.</p>
        </div>

        <Card className="border-zinc-850 bg-zinc-950/80 p-8 text-center space-y-6 max-w-2xl mx-auto border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Assistente de IA Bloqueado!</h2>
          <p className="text-zinc-400 leading-relaxed text-xs max-w-md mx-auto">
            A central de inteligência artificial com análise de dados de tips e analistas é um recurso disponível exclusivamente para assinantes Premium ou VIP Anual.
          </p>
          <a
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Fazer Upgrade do Plano
          </a>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-emerald-500" />
            Central de IA
          </h1>
          <p className="text-sm text-zinc-400">Tire dúvidas sobre odds, tips de alta confiança e estatísticas de analistas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Console */}
        <Card className="lg:col-span-3 border-zinc-850 bg-zinc-950 flex flex-col justify-between h-[500px]">
          <CardHeader className="border-b border-zinc-850 pb-4 flex flex-row items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">Assistente Inteligente</CardTitle>
              <CardDescription>Respostas baseadas em dados históricos reais e tips ativas.</CardDescription>
            </div>
          </CardHeader>

          {/* Messages body */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.sender === 'user' ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-lg leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user' ? 'bg-zinc-900 text-zinc-200 border border-zinc-850' : 'bg-zinc-950 border border-zinc-900 text-zinc-300'
                }`}>
                  {msg.text}
                  <span className="block text-[8px] text-zinc-550 mt-1 text-right">{msg.date}</span>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Form sender */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-850 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="E.g. Quais as tips de hoje?"
              className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </Card>

        {/* Suggestion Sidebar */}
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Sugestões de Perguntas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {[
              'Quais são as melhores tips de hoje?',
              'Qual tip possui melhor odd?',
              'Qual tip possui maior confiança?',
              'Qual analista tem maior lucro?'
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="w-full text-left p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
