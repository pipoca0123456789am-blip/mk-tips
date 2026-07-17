'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db } from '@/lib/db'
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  UserCheck, 
  ShieldCheck, 
  Plus, 
  Check, 
  X, 
  FileText,
  Search,
  Settings,
  AlertTriangle
} from 'lucide-react'

export default function AdminWalletPage() {
  const [users, setUsers] = useState<any[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])
  const [walletConfig, setWalletConfig] = useState<any>(null)
  
  // Settings forms
  const [minDeposit, setMinDeposit] = useState(15)
  const [maxDeposit, setMaxDeposit] = useState(10000)
  const [minWithdraw, setMinWithdraw] = useState(30)
  const [withdrawFee, setWithdrawFee] = useState(0)
  const [processingTime, setProcessingTime] = useState('24h')
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    const loadData = () => {
      if (!db.isReady()) return
      const rawUsers = db.getUsers()
      setUsers(rawUsers)
      setWithdrawalRequests(db.getWithdrawalRequests())
      
      const config = db.getWalletConfig()
      setWalletConfig(config)
      if (config) {
        setMinDeposit(config.minDeposit)
        setMaxDeposit(config.maxDeposit)
        setMinWithdraw(config.minWithdraw)
        setWithdrawFee(config.withdrawFee)
        setProcessingTime(config.processingTime)
      }
    }
    loadData()
    window.addEventListener('oddvault_db_update', loadData)
    return () => window.removeEventListener('oddvault_db_update', loadData)
  }, [])

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault()
    const newConfig = { minDeposit, maxDeposit, minWithdraw, withdrawFee, processingTime }
    db.setWalletConfig(newConfig)
    setWalletConfig(newConfig)

    db.addLog('Audit', 'Configuração de limites e taxas da carteira digital atualizada.', '189.120.45.10', 'MacBook Pro', 'Admin Master')
    setNotification('Configurações atualizadas com sucesso!')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleResolveWithdrawal = (requestId: string, status: 'Aprovado' | 'Recusado') => {
    const requests = db.getWithdrawalRequests()
    const req = requests.find(r => r.id === requestId)
    if (!req) return

    // Update status in requests list
    const updatedRequests = requests.map(r => {
      if (r.id === requestId) {
        return { ...r, status }
      }
      return r
    })
    db.setWithdrawalRequests(updatedRequests)
    setWithdrawalRequests(updatedRequests)

    // Log & notify
    db.addLog('Payment', `Saque do usuário ${req.userName} de R$ ${req.amount.toFixed(2)} foi ${status}.`, '189.120.45.10', 'System', 'Admin Master')
    
    // If approved, update transactions in user wallet to Paid. If rejected, refund available balance.
    const userWallet = db.getWallet(req.userId)
    const userTxs = db.getWalletTransactions(req.userId)

    if (status === 'Aprovado') {
      // Find withdrawal transaction and flag it as Paid/Approved
      const updatedTxs = userTxs.map(t => {
        if (t.type === 'Saque' && t.status === 'Pendente' && Math.abs(t.amount) === req.amount) {
          return { ...t, status: 'Aprovado' }
        }
        return t
      })
      db.setWalletTransactions(req.userId, updatedTxs)
    } else {
      // Refund available
      const refundedWallet = {
        ...userWallet,
        available: userWallet.available + req.amount,
        totalWithdraw: userWallet.totalWithdraw - req.amount
      }
      db.setWallet(req.userId, refundedWallet)

      const updatedTxs = userTxs.map(t => {
        if (t.type === 'Saque' && t.status === 'Pendente' && Math.abs(t.amount) === req.amount) {
          return { ...t, status: 'Recusado' }
        }
        return t
      })
      db.setWalletTransactions(req.userId, updatedTxs)
    }

    setNotification(`Saque resolvida com sucesso: ${status}!`)
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-zinc-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Carteiras & Saques
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Admin Finance</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Acompanhe saldos dos clientes, aprove solicitações de saque PIX e configure taxas operacionais.</p>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal approvals */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-amber-500" />
              Solicitações de Saques Pendentes
            </h3>

            {withdrawalRequests.filter(r => r.status === 'Pendente').length === 0 ? (
              <p className="text-xs text-zinc-650 p-6 text-center">Nenhuma solicitação de saque pendente.</p>
            ) : (
              <div className="divide-y divide-zinc-900">
                {withdrawalRequests.filter(r => r.status === 'Pendente').map((req) => (
                  <div key={req.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div>
                      <strong className="text-white block">{req.userName}</strong>
                      <span className="text-[10px] text-zinc-550 block mt-0.5">Banco: {req.bank} • Chave PIX: {req.pixKey}</span>
                      <span className="text-[9px] text-zinc-600 block mt-0.5">Solicitado em: {new Date(req.createdAt).toLocaleString('pt-BR')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <strong className="text-white font-extrabold text-sm block">R$ {req.amount.toFixed(2)}</strong>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleResolveWithdrawal(req.id, 'Aprovado')}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded text-[10px] cursor-pointer"
                        >
                          Pagar
                        </button>
                        <button
                          onClick={() => handleResolveWithdrawal(req.id, 'Recusado')}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-red-400 font-extrabold rounded text-[10px] cursor-pointer border border-zinc-800"
                        >
                          Recusar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Users wallets table */}
          <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-500" />
              Saldos Globais dos Clientes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500">
                    <th className="py-2">Cliente</th>
                    <th className="py-2 text-right">Saldo Disponível</th>
                    <th className="py-2 text-right">Depositado</th>
                    <th className="py-2 text-right">Sacado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const w = db.getWallet(u.id)
                    return (
                      <tr key={u.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/10">
                        <td className="py-2.5 font-bold text-white">{u.name}</td>
                        <td className="py-2.5 text-right font-extrabold text-emerald-400">R$ {w.available.toFixed(2)}</td>
                        <td className="py-2.5 text-right text-zinc-400">R$ {w.totalDeposit.toFixed(2)}</td>
                        <td className="py-2.5 text-right text-zinc-400">R$ {w.totalWithdraw.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Global wallet configurations */}
        <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4 h-max">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-500" />
            Configurações Financeiras
          </h3>
          <form onSubmit={handleUpdateConfig} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1.5">Depósito Mínimo (R$)</label>
              <input
                type="number"
                value={minDeposit}
                onChange={e => setMinDeposit(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5">Depósito Máximo (R$)</label>
              <input
                type="number"
                value={maxDeposit}
                onChange={e => setMaxDeposit(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5">Saque Mínimo (R$)</label>
              <input
                type="number"
                value={minWithdraw}
                onChange={e => setMinWithdraw(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5">Taxa de Saque (%)</label>
              <input
                type="number"
                value={withdrawFee}
                onChange={e => setWithdrawFee(Number(e.target.value))}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5">Tempo Processamento Saque</label>
              <input
                type="text"
                value={processingTime}
                onChange={e => setProcessingTime(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded text-xs transition-colors cursor-pointer"
            >
              Salvar Configurações
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}
