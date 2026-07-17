'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db } from '@/lib/db'
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ShieldCheck, 
  Plus, 
  Minus, 
  FileText, 
  TrendingUp, 
  Wallet,
  Settings,
  AlertTriangle
} from 'lucide-react'

export default function UserWalletPage() {
  const [activeUser, setActiveUser] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [walletConfig, setWalletConfig] = useState<any>(null)

  // Form states
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [depositAmount, setDepositAmount] = useState(50)
  const [withdrawAmount, setWithdrawAmount] = useState(50)
  const [pixType, setPixType] = useState('CPF')
  const [pixKey, setPixKey] = useState('')
  const [bankName, setBankName] = useState('Nubank')
  const [notification, setNotification] = useState<string | null>(null)

  // Velana checkout states
  const [velanaPixCode, setVelanaPixCode] = useState<string>('')
  const [velanaTxId, setVelanaTxId] = useState<string>('')
  const [loadingVelana, setLoadingVelana] = useState<boolean>(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [showPixScreen, setShowPixScreen] = useState(false)
  const [pixExpiresAt, setPixExpiresAt] = useState<number>(0)
  const [pixCountdown, setPixCountdown] = useState<string>('')
  const [checkingStatus, setCheckingStatus] = useState(false)

  useEffect(() => {
    const loadData = () => {
      if (!db.isReady()) return
      const u = db.getActiveUser()
      setActiveUser(u)
      if (u) {
        setWallet(db.getWallet(u.id))
        setTransactions(db.getWalletTransactions(u.id))
        setFullName(u.name || '')
        setEmail(u.email || '')
        setPhone(u.phone || '')
        setCpf(u.cpf || '')
      }
      setWalletConfig(db.getWalletConfig())
    }
    loadData()
    window.addEventListener('oddvault_db_update', loadData)
    return () => window.removeEventListener('oddvault_db_update', loadData)
  }, [])

  // Auto-polling: check payment status every 5 seconds when Pix is showing
  useEffect(() => {
    if (!showPixScreen || !velanaTxId || !velanaPixCode) return

    const pollInterval = setInterval(async () => {
      try {
        // First check our webhook endpoint (instant confirmation)
        const webhookRes = await fetch(`/api/payment/webhook?id=${velanaTxId}`)
        const webhookData = await webhookRes.json()
        if (webhookData.confirmed) {
          clearInterval(pollInterval)
          handleDepositConfirmed(velanaTxId)
          return
        }

        // Fallback: check Velana API directly
        const velanaRes = await fetch(`/api/payment/velana?id=${velanaTxId}`)
        const velanaData = await velanaRes.json()
        if (velanaData.success && velanaData.paid) {
          clearInterval(pollInterval)
          handleDepositConfirmed(velanaTxId)
          return
        }
      } catch (err) {
        console.warn('[Checkout Poll] Error checking payment status:', err)
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [showPixScreen, velanaTxId, velanaPixCode])

  // Countdown timer for Pix expiration
  useEffect(() => {
    if (!pixExpiresAt) return
    const tick = setInterval(() => {
      const remaining = Math.max(0, pixExpiresAt - Date.now())
      if (remaining <= 0) {
        setPixCountdown('Expirado')
        clearInterval(tick)
        return
      }
      const mins = Math.floor(remaining / 60000)
      const secs = Math.floor((remaining % 60000) / 1000)
      setPixCountdown(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(tick)
  }, [pixExpiresAt])

  const generateVelanaDepositPix = async () => {
    if (depositAmount < (walletConfig?.minDeposit || 15) || depositAmount > (walletConfig?.maxDeposit || 10000)) {
      alert(`Valor de depósito fora dos limites: Min R$ ${walletConfig?.minDeposit || 15} - Max R$ ${walletConfig?.maxDeposit || 10000}`)
      return
    }
    setLoadingVelana(true)
    setShowPixScreen(true)
    try {
      const res = await fetch('/api/payment/velana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: fullName,
          amount: depositAmount,
          cpf,
          description: `Depósito em carteira`
        })
      })
      const data = await res.json()
      if (data.success) {
        setVelanaPixCode(data.qrCode)
        setVelanaTxId(data.transactionId || '')
        setPixExpiresAt(Date.now() + 3600000) // 60 minutes
      } else {
        alert(`Erro ao gerar Pix no gateway: ${data.error || 'Erro desconhecido'}`)
        setShowPixScreen(false)
      }
    } catch (err) {
      console.error(err)
      alert('Erro na comunicação com o servidor de pagamentos.')
      setShowPixScreen(false)
    } finally {
      setLoadingVelana(false)
    }
  }

  const handleDepositConfirmed = (txId: string) => {
    if (!activeUser) return
    const w = db.getWallet(activeUser.id)
    const updatedWallet = {
      ...w,
      available: w.available + depositAmount,
      totalDeposit: w.totalDeposit + depositAmount
    }
    db.setWallet(activeUser.id, updatedWallet)
    setWallet(updatedWallet)
    
    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'Depósito',
      amount: depositAmount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString().slice(0, 5),
      status: 'Aprovado',
      txId
    }
    const updatedTxs = [newTx, ...transactions]
    db.setWalletTransactions(activeUser.id, updatedTxs)
    setTransactions(updatedTxs)
    setShowDeposit(false)
    setShowPixScreen(false)
    setVelanaPixCode('')
    setVelanaTxId('')
    setPixExpiresAt(0)
    
    db.addLog('Payment', `Depósito de R$ ${depositAmount.toFixed(2)} confirmado pelo gateway Velana. TX: ${txId}`, '127.0.0.1', 'Web App', activeUser.name)
    setNotification(`✅ Depósito de R$ ${depositAmount.toFixed(2)} confirmado com sucesso!`)
    setTimeout(() => setNotification(null), 5000)
  }

  const checkVelanaPaymentStatus = async () => {
    if (!velanaTxId) return
    setCheckingStatus(true)
    try {
      // Check webhook first
      const webhookRes = await fetch(`/api/payment/webhook?id=${velanaTxId}`)
      const webhookData = await webhookRes.json()
      if (webhookData.confirmed) {
        handleDepositConfirmed(velanaTxId)
        return
      }

      // Fallback: check Velana API
      const res = await fetch(`/api/payment/velana?id=${velanaTxId}`)
      const data = await res.json()
      if (data.success && data.paid) {
        handleDepositConfirmed(velanaTxId)
      } else {
        alert('Seu Pix ainda consta como PENDENTE. Realize o pagamento no seu aplicativo bancário e aguarde — a confirmação é automática.')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao consultar o gateway. Tente novamente em instantes.')
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateVelanaDepositPix()
  }

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeUser || !walletConfig || !pixKey) return

    if (withdrawAmount < walletConfig.minWithdraw) {
      alert(`Valor mínimo de saque é R$ ${walletConfig.minWithdraw}`)
      return
    }

    if (withdrawAmount > wallet.available) {
      alert('Saldo disponível insuficiente para realizar o saque.')
      return
    }

    const formattedPixKey = `[${pixType}] ${pixKey}`

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'Saque',
      amount: -withdrawAmount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString().slice(0, 5),
      status: 'Pendente',
      txId: `TX-WITH-${Date.now().toString().slice(-8)}`
    }

    // Deduct available, move to blocked/pending
    const updatedWallet = {
      ...wallet,
      available: wallet.available - withdrawAmount,
      totalWithdraw: wallet.totalWithdraw + withdrawAmount
    }

    // Add withdrawal request to global list for admin approval
    const withdrawals = db.getWithdrawalRequests()
    const newRequest = {
      id: `req-${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      amount: withdrawAmount,
      pixKey: formattedPixKey,
      bank: bankName,
      status: 'Pendente',
      createdAt: new Date().toISOString()
    }

    db.setWithdrawalRequests([...withdrawals, newRequest])
    db.setWallet(activeUser.id, updatedWallet)
    
    const updatedTxs = [newTx, ...transactions]
    db.setWalletTransactions(activeUser.id, updatedTxs)

    setWallet(updatedWallet)
    setTransactions(updatedTxs)
    setShowWithdraw(false)
    setPixKey('')

    db.addLog('Payment', `Solicitação de saque de R$ ${withdrawAmount.toFixed(2)} criada. Chave PIX: ${formattedPixKey}`, '127.0.0.1', 'Web App', activeUser.name)
    setNotification('Solicitação de saque enviada para análise.')
    setTimeout(() => setNotification(null), 4000)
  }

  if (!wallet || !walletConfig) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const roi = wallet.totalBet > 0 ? (((wallet.prize - wallet.totalBet) / wallet.totalBet) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-zinc-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          💰 Minha Carteira
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Carteira Vale Tudo</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Gerencie depósitos, saques e visualize suas premiações e inscrições.</p>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main card panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-zinc-850 bg-gradient-to-br from-zinc-950 to-zinc-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          <CardContent className="p-6 space-y-6">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Saldo Disponível</span>
              <h2 className="text-4xl font-black text-white mt-1">R$ {wallet.available.toFixed(2)}</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowDeposit(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar Saldo
              </button>
              <button
                onClick={() => setShowWithdraw(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold rounded-lg text-xs transition-colors cursor-pointer border border-zinc-800"
              >
                <Minus className="w-4 h-4" />
                Solicitar Saque
              </button>
            </div>
          </CardContent>
        </Card>

        {/* mini stats */}
        <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Métricas & Estatísticas</h3>
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-900">
              <span className="text-zinc-500 block">Total Depositado</span>
              <strong className="text-white text-xs block mt-0.5">R$ {wallet.totalDeposit.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-900">
              <span className="text-zinc-500 block">Total Sacado</span>
              <strong className="text-white text-xs block mt-0.5">R$ {wallet.totalWithdraw.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-900">
              <span className="text-zinc-500 block">Total Apostado</span>
              <strong className="text-white text-xs block mt-0.5">R$ {wallet.totalBet.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-900">
              <span className="text-zinc-500 block">ROI Carteira</span>
              <strong className="text-emerald-400 text-xs block mt-0.5">{roi}%</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Ledger statement list */}
      <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
          <History className="w-4 h-4 text-emerald-500" />
          Extrato Completo
        </h3>

        {transactions.length === 0 ? (
          <p className="text-xs text-zinc-650 p-6 text-center">Nenhuma movimentação financeira recente.</p>
        ) : (
          <div className="divide-y divide-zinc-900">
            {transactions.map((tx) => {
              const isPositive = tx.amount > 0
              return (
                <div key={tx.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-white block">{tx.type}</strong>
                    <span className="text-[10px] text-zinc-550 block mt-0.5">{tx.date} às {tx.time} • ID: {tx.txId}</span>
                  </div>

                  <div className="text-right">
                    <strong className={`font-black text-sm block ${isPositive ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      {isPositive ? '+' : ''} R$ {tx.amount.toFixed(2)}
                    </strong>
                    <span className={`text-[9px] font-bold block mt-0.5 ${
                      tx.status === 'Aprovado' || tx.status === 'Pago' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Deposit Modal Dialog */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800 text-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">Adicionar Saldo</CardTitle>
              <CardDescription>Depósito instantâneo na sua carteira via gateway PIX.</CardDescription>
            </CardHeader>
            {!showPixScreen ? (
              <form onSubmit={(e) => { e.preventDefault(); generateVelanaDepositPix(); }}>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Henrique Blume"
                      className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-1">E-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="blume@example.com"
                      className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-1">Celular</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-1">CPF</label>
                      <input
                        type="text"
                        required
                        value={cpf}
                        onChange={e => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full p-2 bg-zinc-900 border border-zinc-850 rounded text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-1">Valor do Depósito (R$)</label>
                    <input
                      type="number"
                      required
                      value={depositAmount}
                      onChange={e => setDepositAmount(Number(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-855 rounded text-white"
                    />
                    <span className="text-[9px] text-zinc-500 mt-1 block">Mínimo: R$ {walletConfig.minDeposit} • Máximo: R$ {walletConfig.maxDeposit}</span>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={() => setShowDeposit(false)}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded cursor-pointer"
                    >
                      Gerar Pix
                    </button>
                  </div>
                </CardContent>
              </form>
            ) : (
              <CardContent className="space-y-4 text-center">
                <div className="p-3 bg-zinc-900/50 rounded border border-zinc-850 flex justify-between items-center text-left">
                  <div>
                    <span className="font-bold text-white block">Depósito em Carteira</span>
                    <span className="text-[9px] text-zinc-500">Gateway Velana Pix</span>
                  </div>
                  <span className="text-emerald-400 font-bold">R$ {depositAmount.toFixed(2)}</span>
                </div>

                {/* Countdown timer */}
                {pixCountdown && (
                  <div className={`flex items-center justify-center gap-2 text-xs font-mono ${pixCountdown === 'Expirado' ? 'text-red-400' : 'text-amber-400'}`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {pixCountdown === 'Expirado' ? 'Pix expirado — gere um novo' : `Expira em ${pixCountdown}`}
                  </div>
                )}

                <div className="flex flex-col items-center pt-2">
                  {loadingVelana ? (
                    <div className="w-28 h-28 flex flex-col items-center justify-center text-zinc-500 text-[10px] gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
                      Gerando PIX oficial...
                    </div>
                  ) : velanaPixCode ? (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(velanaPixCode)}`} 
                        alt="QR Code Pix"
                        className="w-32 h-32 bg-white p-2 rounded-lg"
                      />
                      
                      <div className="w-full space-y-1.5">
                        <label className="block text-[9px] text-zinc-550 font-bold uppercase">Pix Copia e Cola</label>
                        <div className="flex gap-2 bg-zinc-900 border border-zinc-850 p-2 rounded items-center">
                          <input
                            type="text"
                            readOnly
                            value={velanaPixCode}
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            className="bg-transparent text-[10px] text-zinc-300 flex-1 outline-none select-all truncate font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(velanaPixCode)
                              alert('Código PIX Copia e Cola copiado com sucesso!')
                            }}
                            className="px-2.5 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[9px] rounded uppercase cursor-pointer transition-colors"
                          >
                            Copiar
                          </button>
                        </div>
                      </div>

                      {/* Auto-polling status indicator */}
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-900/70 border border-zinc-850 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Verificando pagamento automaticamente...
                      </div>
                    </div>
                  ) : (
                    <div className="w-28 h-28 bg-white p-2 rounded flex items-center justify-center text-black font-extrabold select-none">
                      [ QR CODE PIX ]
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-500 text-center mt-3">Escaneie o QR Code ou copie o código Pix acima. O pagamento será confirmado automaticamente.</p>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => { setShowPixScreen(false); setVelanaPixCode(''); setVelanaTxId(''); setPixExpiresAt(0); }}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={checkVelanaPaymentStatus}
                    disabled={checkingStatus || pixCountdown === 'Expirado'}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {checkingStatus ? (
                      <>
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-black" />
                        Verificando...
                      </>
                    ) : pixCountdown === 'Expirado' ? (
                      'Pix Expirado'
                    ) : (
                      'Já Paguei — Verificar'
                    )}
                  </button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Withdraw Modal Dialog */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800 text-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">Solicitar Saque</CardTitle>
              <CardDescription>Seus saques serão pagos diretamente na sua chave PIX.</CardDescription>
            </CardHeader>
            <form onSubmit={handleWithdrawSubmit}>
              <CardContent className="space-y-4">
                <div className="p-3 bg-zinc-900/60 border border-zinc-900 rounded text-xs space-y-1">
                  <span className="text-zinc-500 block">Saldo Disponível para Saque</span>
                  <strong className="text-white text-base block">R$ {wallet.available.toFixed(2)}</strong>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-2">Valor a Sacar (R$)</label>
                  <input
                    type="number"
                    required
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                  />
                  <span className="text-[9px] text-zinc-500 mt-1 block">Mínimo para saque: R$ {walletConfig.minWithdraw}</span>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-2">Tipo Pix</label>
                      <select
                        value={pixType}
                        onChange={e => setPixType(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="E-mail">E-mail</option>
                        <option value="Chave Aleatória">Aleatória</option>
                        <option value="Telefone">Telefone</option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-zinc-550 font-bold uppercase mb-2">Chave PIX</label>
                      <input
                        type="text"
                        required
                        placeholder={
                          pixType === 'CPF' ? '000.000.000-00' :
                          pixType === 'CNPJ' ? '00.000.000/0000-00' :
                          pixType === 'Telefone' ? '+55 11 99999-9999' :
                          pixType === 'E-mail' ? 'email@exemplo.com' :
                          'Chave aleatória de 32 dígitos'
                        }
                        value={pixKey}
                        onChange={e => setPixKey(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setShowWithdraw(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded"
                  >
                    Confirmar Saque
                  </button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
