'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db } from '@/lib/db'
import { Gift, Check, X, ShieldAlert, Award } from 'lucide-react'

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<any[]>([])
  const [targetCount, setTargetCount] = useState(5)
  const [rewardMonths, setRewardMonths] = useState(2)

  useEffect(() => {
    setReferrals(db.getReferrals())
  }, [])

  const handleApprove = (refId: string) => {
    const updated = referrals.map(ref => {
      if (ref.id === refId) {
        db.addAuditLog('Admin Master', 'APPROVE_REFERRAL', ref.id, ref.status, 'Ativo')
        db.addLog('Audit', `Indicação de ${ref.name} aprovada manualmente.`)
        return { ...ref, status: 'Ativo' }
      }
      return ref
    })
    setReferrals(updated)
    db.setReferrals(updated)
  }

  const handleReject = (refId: string) => {
    const updated = referrals.map(ref => {
      if (ref.id === refId) {
        db.addAuditLog('Admin Master', 'REJECT_REFERRAL', ref.id, ref.status, 'Rejeitado')
        return { ...ref, status: 'Rejeitado' }
      }
      return ref
    })
    setReferrals(updated)
    db.setReferrals(updated)
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    db.addAuditLog('Admin Master', 'UPDATE_REFERRAL_SETTINGS', 'System', `Target: 5`, `Target: ${targetCount}, Months: ${rewardMonths}`)
    alert('Configurações da campanha atualizadas com sucesso!')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Gift className="w-7 h-7 text-emerald-500 animate-bounce" />
            Campanhas Indique e Ganhe
          </h1>
          <p className="text-sm text-zinc-400">Gerencie campanhas de indicações orgânicas e liberação de recompensas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification / overrides panel */}
        <Card className="lg:col-span-2 border-zinc-850 bg-zinc-900/20 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base font-bold">Gerenciador de Indicações</CardTitle>
            <CardDescription>Aprove manualmente pagamentos confirmados ou cancele autoindicações suspeitas.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-400">
                  <th className="p-3">Indicado</th>
                  <th className="p-3">Plano</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 text-zinc-300">
                {referrals.map(ref => (
                  <tr key={ref.id} className="hover:bg-zinc-900/20">
                    <td className="p-3 font-bold text-white">{ref.name}</td>
                    <td className="p-3">{ref.plan}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        ref.status === 'Ativo' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-zinc-850 border-zinc-800 text-zinc-550'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {ref.status !== 'Ativo' && (
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => handleApprove(ref.id)}
                            className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                            title="Aprovar indicação"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReject(ref.id)}
                            className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer"
                            title="Rejeitar suspeita de fraude"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Configurations panel */}
        <Card className="border-zinc-850 bg-zinc-900/30">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Parâmetros da Campanha</CardTitle>
            <CardDescription>Ajuste os alvos de indicações de assinaturas.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSaveSettings}>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Amigos Necessários</label>
                <input
                  type="number"
                  value={targetCount}
                  onChange={e => setTargetCount(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Meses Grátis de Recompensa</label>
                <input
                  type="number"
                  value={rewardMonths}
                  onChange={e => setRewardMonths(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                />
              </div>

              <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded text-zinc-400 text-[10px] leading-relaxed flex gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-zinc-300">Regra de Fraudes:</strong> Autoindicações de IPs coincidentes serão flagged automaticamente.
                </p>
              </div>
            </CardContent>
            <div className="p-6 border-t border-zinc-850">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Salvar Regras
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
