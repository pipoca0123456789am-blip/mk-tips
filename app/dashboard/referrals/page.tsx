'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db } from '@/lib/db'
import { Gift, Copy, Check, Users, Share2, Award } from 'lucide-react'

export default function UserReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const refLink = 'https://oddvault.com/?ref=u1'

  useEffect(() => {
    setReferrals(db.getReferrals())
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confirmedCount = referrals.filter(r => r.status === 'Ativo').length
  const target = 5
  const progressPercent = (confirmedCount / target) * 100

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Gift className="w-7 h-7 text-emerald-500" />
          Indique e Ganhe
        </h1>
        <p className="text-sm text-zinc-400">Indique novos assinantes para a plataforma e ganhe meses gratuitos na sua mensalidade.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Link generator */}
        <Card className="lg:col-span-2 border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-base font-bold">Seu Link Exclusivo</CardTitle>
            <CardDescription>Copie e envie para seus contatos nas redes sociais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={refLink}
                className="flex-1 p-2.5 bg-zinc-900 border border-zinc-850 rounded text-zinc-300 font-mono"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            {/* QR Code */}
            <div className="flex items-center gap-4 p-4 bg-zinc-950/60 rounded border border-zinc-900">
              <div className="w-20 h-20 bg-white p-1 rounded flex items-center justify-center font-bold text-[8px] text-black">
                [ QR CODE ]
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">QR Code de Divulgação</h4>
                <p className="text-[10px] text-zinc-550 leading-relaxed">Deixe que seus amigos escaneiem o código diretamente do seu smartphone.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Tracker */}
        <Card className="border-zinc-850 bg-zinc-900/30 flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Progresso da Campanha</CardTitle>
              <CardDescription>Indique 5 amigos ativos para destravar a recompensa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{confirmedCount} de {target} amigos confirmados</span>
                <span className="text-zinc-500 font-mono">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="text-[10px] text-zinc-450 leading-relaxed mt-2 flex gap-1.5 items-start">
                <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                Faltam apenas {target - confirmedCount} amigos para você ganhar +2 meses de acesso gratuito.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* History table */}
      <Card className="border-zinc-850 bg-zinc-900/20">
        <CardHeader>
          <CardTitle className="text-base font-bold">Amigos Cadastrados</CardTitle>
          <CardDescription>Acompanhe o status e a liberação de cada amigo indicado.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400 font-semibold">
                  <th className="p-4">Amigo Indicado</th>
                  <th className="p-4">Data do Cadastro</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4 text-right">Status da Indicação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                {referrals.map(ref => (
                  <tr key={ref.id} className="hover:bg-zinc-900/20">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-white uppercase text-[10px]">
                        {ref.name.charAt(0)}
                      </div>
                      <span className="font-bold text-white">{ref.name}</span>
                    </td>
                    <td className="p-4 text-zinc-500">{ref.date}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ref.plan}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${
                        ref.status === 'Ativo' ? 'text-emerald-400' : 'text-zinc-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ref.status === 'Ativo' ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
