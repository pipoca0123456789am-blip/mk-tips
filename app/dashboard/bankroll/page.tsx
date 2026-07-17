'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBUser } from '@/lib/db'
import { AreaChart } from '@/components/ui/charts'
import { Landmark, ArrowUpRight, Calculator, Coins, ShieldAlert, Lock } from 'lucide-react'

export default function UserBankrollPage() {
  const [user, setUser] = useState<DBUser | null>(null)
  const [bankroll, setBankroll] = useState(1200)
  const [stakePercent, setStakePercent] = useState(2.0) // 2% suggested default

  // Calculator states
  const [calcOdd, setCalcOdd] = useState(1.90)
  const [calcProbability, setCalcProbability] = useState(55) // 55%
  const [calcResult, setCalcResult] = useState<string>('0.0%')

  useEffect(() => {
    const currentUser = db.getActiveUser()
    setUser(currentUser)
    if (currentUser) {
      setBankroll(currentUser.bankroll)
    }
  }, [])

  const handleSaveBankroll = () => {
    if (!user) return
    const updatedUsers = db.getUsers().map(u => {
      if (u.id === user.id) {
        return { ...u, bankroll }
      }
      return u
    })
    db.setUsers(updatedUsers)
    db.addLog('System', `Banca ajustada para R$ ${bankroll}`, '127.0.0.1', 'Web App', user.name)
    alert('Banca atualizada com sucesso!')
  }

  const calculateEV = () => {
    const decimalProb = calcProbability / 100
    const ev = (calcOdd * decimalProb) - 1
    const evPercentage = (ev * 100).toFixed(1)
    setCalcResult(`${evPercentage}% ${ev > 0 ? '(+EV Esperado)' : '(-EV Sem valor)'}`)
  }

  // Kelly Criterion / Stake suggestion
  const suggestedStakeAmount = isNaN(bankroll) ? '0.00' : ((bankroll * stakePercent) / 100).toFixed(2)

  const projectionData = [
    { label: 'Mês 1', value: isNaN(bankroll) ? 0 : bankroll },
    { label: 'Mês 2', value: Math.floor((isNaN(bankroll) ? 0 : bankroll) * 1.08) },
    { label: 'Mês 3', value: Math.floor((isNaN(bankroll) ? 0 : bankroll) * 1.16) },
    { label: 'Mês 4', value: Math.floor((isNaN(bankroll) ? 0 : bankroll) * 1.25) },
    { label: 'Mês 5', value: Math.floor((isNaN(bankroll) ? 0 : bankroll) * 1.34) }
  ]

  if (user?.plan === 'Free' || user?.plan === 'Starter') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Landmark className="w-7 h-7 text-emerald-500" />
            Gestão de Banca Avançada
          </h1>
          <p className="text-sm text-zinc-400">Gerencie sua banca e utilize calculadoras de stake profissional.</p>
        </div>

        <Card className="border-zinc-850 bg-zinc-950/80 p-8 text-center space-y-6 max-w-2xl mx-auto border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Gestão de Banca Bloqueada!</h2>
          <p className="text-zinc-400 leading-relaxed text-xs max-w-md mx-auto">
            A calculadora Kelly Criterion e as ferramentas avançadas de controle de stake e gestão de banca são exclusivas para assinantes Premium ou VIP Anual.
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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Gestão de Banca</h1>
        <p className="text-sm text-zinc-400">Configure seu capital inicial, gerencie riscos e calcule tamanhos ótimos de stakes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bankroll Config */}
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Configuração do Caixa</CardTitle>
            <CardDescription>Defina sua banca inicial para calibrar os cálculos de unidades.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Banca Atual (R$)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={isNaN(bankroll) ? '' : bankroll}
                  onChange={e => setBankroll(parseFloat(e.target.value))}
                  className="flex-1 p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white text-sm focus:outline-none"
                />
                <button
                  onClick={handleSaveBankroll}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-xs transition-colors cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-zinc-900/50 rounded border border-zinc-850 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">Stake Sugerida ({stakePercent}%)</h4>
                  <p className="text-[10px] text-zinc-500">Unidade conservadora ideal</p>
                </div>
                <span className="text-base font-black text-emerald-400">R$ {suggestedStakeAmount}</span>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded border border-zinc-850 flex items-start gap-2.5 text-zinc-400">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed">
                  <strong className="text-zinc-300">Alerta de Gestão:</strong> Nunca utilize mais de 5% da sua banca total em uma única aposta esportiva para mitigar drawdowns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projections graph */}
        <Card className="lg:col-span-2 border-zinc-850 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-base font-bold">Projeção de Crescimento (Compósito 8% a.m.)</CardTitle>
            <CardDescription>Simulação baseada no ROI histórico acumulado da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <AreaChart data={projectionData} height={180} color="#10B981" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculators section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EV Calculator */}
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Calculadora de Valor Esperado (+EV)</CardTitle>
              <CardDescription>Valide se a odd oferecida possui margem de lucro estatístico.</CardDescription>
            </div>
            <Calculator className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Odd da Casa</label>
                <input
                  type="number"
                  step="0.01"
                  value={isNaN(calcOdd) ? '' : calcOdd}
                  onChange={e => setCalcOdd(parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Sua Probabilidade (%)</label>
                <input
                  type="number"
                  value={isNaN(calcProbability) ? '' : calcProbability}
                  onChange={e => setCalcProbability(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center justify-between pt-2">
              <button
                onClick={calculateEV}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850 font-semibold rounded cursor-pointer"
              >
                Calcular EV
              </button>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Margem Calculada</span>
                <span className="text-sm font-bold text-emerald-400">{calcResult}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
