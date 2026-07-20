'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Lock, User, ShieldAlert, KeyRound } from 'lucide-react'
import { db } from '@/lib/db'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [step, setStep] = useState<'login' | '2fa'>('login')
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ip, setIp] = useState('—')

  useEffect(() => {
    sessionStorage.removeItem('admin_login_attempts')
    setLocked(false)
    setError('')
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((d) => setIp(d.ip || '—'))
      .catch(() => setIp('—'))
  }, [])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (locked || loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'login', email, password }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        db.addLog('Auth', `Login administrador parte 1 concluído (IP: ${ip})`, ip)
        setStep('2fa')
        setPassword('')
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        sessionStorage.setItem('admin_login_attempts', newAttempts.toString())
        if (newAttempts >= 5) {
          setLocked(true)
          setError('Acesso bloqueado após 5 tentativas.')
        } else {
          setError(`Credenciais incorretas. Tentativa ${newAttempts} de 5.`)
        }
        db.addLog('Error', `Falha na autenticação do admin (IP: ${ip})`, ip)
      }
    } catch {
      setError('Falha de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: '2fa', twoFactorCode }),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        db.addLog('Auth', `Autenticação 2FA realizada com sucesso (IP: ${ip})`, ip)
        localStorage.setItem('oddvault_admin_session', 'true')
        // Don't mix admin with client session / PWA user area
        localStorage.removeItem('oddvault_user_session')
        await db.refresh()
        const master = db.getUsers().find((u) => u.role === 'Master')
        if (master) db.setActiveUser(master.id)
        router.push('/mktipsadmin/dashboard')
      } else {
        setError(data.error || 'Código 2FA inválido.')
      }
    } catch {
      setError('Falha de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/80 backdrop-blur-md relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Painel Master
          </CardTitle>
          <CardDescription>
            Controle Administrativo Geral da MK Tips
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-400 text-sm items-center">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  E-mail do Administrador
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    name="admin-email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu e-mail"
                    disabled={locked || loading}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    name="admin-password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={locked || loading}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
                <span>Controle de IP: <strong className="text-zinc-400">{ip}</strong></span>
                <span>Tentativas: {attempts}/5</span>
              </div>

              <button
                type="submit"
                disabled={locked || loading}
                className="w-full min-h-[48px] py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'Validando…' : 'Continuar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs text-center">
                Autenticação de dois fatores ativa. Insira o código do seu autenticador.
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Código 2FA
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 tracking-[0.3em] font-mono text-center text-lg placeholder:tracking-normal placeholder:font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('login')
                    setTwoFactorCode('')
                    setError('')
                  }}
                  className="flex-1 min-h-[48px] py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-800 transition-colors text-sm cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 min-h-[48px] py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold rounded-lg transition-colors text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {loading ? 'Entrando…' : 'Entrar'}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
