'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, AreaChart } from '@/components/ui/charts'
import { db, DBUser, DBTip } from '@/lib/db'
import { Sparkles, TrendingUp, Users, Percent, HelpCircle } from 'lucide-react'

export default function AdminAIPanelPage() {
  const [users, setUsers] = useState<DBUser[]>([])
  const [tips, setTips] = useState<DBTip[]>([])

  useEffect(() => {
    setUsers(db.getUsers())
    setTips(db.getTips())
  }, [])

  const inactiveUsers = users.filter(u => u.daysRemaining < 30 && u.status === 'Ativo')

  const topPerformanceData = [
    { label: 'Corinthians (1X2)', value: 14.8 },
    { label: 'Real Madrid (BTTS)', value: 11.2 },
    { label: 'Lakers (Handicap)', value: 5.5 }
  ]

  const hourStats = [
    { label: '09h-12h', value: 340 },
    { label: '12h-15h', value: 580 },
    { label: '15h-18h', value: 890 },
    { label: '18h-21h', value: 1200 },
    { label: '21h-00h', value: 450 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-emerald-500 animate-pulse" />
            Painel de IA
          </h1>
          <p className="text-sm text-zinc-400">Automações de engajamento, conversão e relatórios de IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retention Campaign Triggers */}
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Fidelização & Retenção</CardTitle>
            <CardDescription>Usuários identificados com baixa atividade recente (risco de Churn).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {inactiveUsers.map(user => (
              <div key={user.id} className="p-3 bg-zinc-900/50 rounded border border-zinc-850 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white">{user.name}</h4>
                  <p className="text-[9px] text-zinc-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    db.addLog('System', `Notificação preventiva de Churn enviada para ${user.name}`, '127.0.0.1', 'AI Automations', 'System')
                    alert(`E-mail com bônus de 7 dias grátis enviado para ${user.name}!`)
                  }}
                  className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded hover:bg-emerald-500/20"
                >
                  Engajar
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* High performance markets */}
        <Card className="border-zinc-850 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Mercados Mais Lucrativos (ROI %)</CardTitle>
            <CardDescription>Análise estatística preditiva de lucratividade de tips.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <BarChart data={topPerformanceData} height={150} color="#10B981" />
            </div>
          </CardContent>
        </Card>

        {/* Hour CTR conversions */}
        <Card className="border-zinc-850 bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-sm font-bold">CTR por Faixa Horária (Cliques de Afiliado)</CardTitle>
            <CardDescription>Conversão de links de redirecionamento por horário.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <AreaChart data={hourStats} height={150} color="#3B82F6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
