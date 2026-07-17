'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBUser } from '@/lib/db'
import { Gift, Copy, Check, Award, Share2 } from 'lucide-react'

export default function UserReferralsPage() {
  const [user, setUser] = useState<DBUser | null>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    const load = () => {
      if (!db.isReady()) return
      const u = db.getActiveUser()
      setUser(u)
      setReferrals(u ? db.getReferrals(u.id) : [])
    }
    load()
    setOrigin(window.location.origin)
    window.addEventListener('oddvault_db_update', load)
    return () => window.removeEventListener('oddvault_db_update', load)
  }, [])

  const refCode = user ? db.getReferralCode(user.id) : '—'
  const refLink = useMemo(() => {
    if (!user) return ''
    return origin ? `${origin}/?ref=${refCode}` : db.getReferralLink(user.id)
  }, [user, origin, refCode])

  const qrUrl = refLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(refLink)}`
    : ''

  const handleCopy = async () => {
    if (!refLink) return
    try {
      await navigator.clipboard.writeText(refLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const handleShare = async () => {
    if (!refLink) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MK Tips',
          text: 'Assine a MK Tips com meu link e ganhe acesso às melhores tips!',
          url: refLink,
        })
      } catch {
        /* cancelled */
      }
    } else {
      handleCopy()
    }
  }

  const confirmedCount = referrals.filter((r) => r.status === 'Ativo').length
  const target = 5
  const progressPercent = Math.min(100, (confirmedCount / target) * 100)

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          <Gift className="h-7 w-7 text-emerald-500" />
          Indique e Ganhe
        </h1>
        <p className="text-sm text-zinc-400">
          Cada usuário tem um link exclusivo. Indique amigos e ganhe meses grátis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <Card className="border-zinc-850 bg-zinc-900/30 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Seu Link de Afiliado</CardTitle>
            <CardDescription>
              Código: <span className="font-mono font-semibold text-emerald-400">{refCode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                readOnly
                value={refLink}
                className="min-w-0 flex-1 rounded-lg border border-zinc-850 bg-zinc-900 p-3 font-mono text-zinc-300"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex min-h-[48px] flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-emerald-600 sm:flex-none"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex min-h-[48px] items-center justify-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Compartilhar
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-[18px] border border-zinc-900 bg-zinc-950/60 p-4">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="QR Code do link de afiliado"
                  className="h-20 w-20 rounded-lg bg-white p-1"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white text-[8px] font-bold text-black">
                  QR
                </div>
              )}
              <div className="space-y-1">
                <h4 className="font-bold text-white">QR Code de Divulgação</h4>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  Amigos escaneiam e abrem seu link com o código {refCode}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between border-zinc-850 bg-zinc-900/30">
          <div>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Progresso da Campanha</CardTitle>
              <CardDescription>Indique 5 amigos ativos para destravar a recompensa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">
                  {confirmedCount} de {target} amigos confirmados
                </span>
                <span className="font-mono text-zinc-500">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-zinc-450">
                <Award className="h-4 w-4 shrink-0 text-yellow-500" />
                {confirmedCount >= target
                  ? 'Meta atingida! Recompensa disponível.'
                  : `Faltam ${target - confirmedCount} amigos para +2 meses grátis.`}
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      <Card className="border-zinc-850 bg-zinc-900/20">
        <CardHeader>
          <CardTitle className="text-base font-bold">Amigos Cadastrados</CardTitle>
          <CardDescription>Indicações feitas com o seu link.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile cards */}
          <div className="space-y-3 p-4 md:hidden">
            {referrals.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-600">
                Ainda ninguém usou seu link. Compartilhe e acompanhe aqui.
              </p>
            ) : (
              referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="rounded-[18px] border border-zinc-850 bg-zinc-950/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold uppercase text-white">
                      {ref.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">{ref.name}</p>
                      <p className="text-[10px] text-zinc-500">{ref.date}</p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        ref.status === 'Ativo' ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {ref.status}
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] text-emerald-400">{ref.plan}</p>
                </div>
              ))
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto text-xs md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-900/40 font-semibold text-zinc-400">
                  <th className="p-4">Amigo Indicado</th>
                  <th className="p-4">Data do Cadastro</th>
                  <th className="p-4">Plano</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-zinc-600">
                      Ainda ninguém usou seu link.
                    </td>
                  </tr>
                ) : (
                  referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-zinc-900/20">
                      <td className="flex items-center gap-3 p-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold uppercase text-white">
                          {ref.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-bold text-white">{ref.name}</span>
                      </td>
                      <td className="p-4 text-zinc-500">{ref.date}</td>
                      <td className="p-4">
                        <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          {ref.plan}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${
                            ref.status === 'Ativo' ? 'text-emerald-400' : 'text-zinc-500'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              ref.status === 'Ativo' ? 'bg-emerald-400' : 'bg-zinc-500'
                            }`}
                          />
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
