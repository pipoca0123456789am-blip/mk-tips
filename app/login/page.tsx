'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { LogIn, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'
import { db, DBUser } from '@/lib/db'

export default function UserLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableUsers, setAvailableUsers] = useState<DBUser[]>([])

  useEffect(() => {
    const init = async () => {
      await db.refresh()
      setAvailableUsers(db.getUsers())
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Find user by email
      const matchedUser = availableUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
      if (matchedUser) {
        localStorage.setItem('oddvault_user_session', 'true')
        db.setActiveUser(matchedUser.id)
        db.addLog('Auth', `Usuário ${matchedUser.name} logado com sucesso`, '127.0.0.1', 'Web App', matchedUser.name)
        router.push('/dashboard')
      } else {
        setError('Nenhum usuário disponível para simulação. Tente novamente.')
      }
    } catch (err) {
      setError('Erro ao realizar o login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const selectTestUser = (user: DBUser) => {
    setEmail(user.email)
    setPassword('••••••••')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative premium gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E08A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-zinc-900 bg-zinc-950/80 backdrop-blur-md relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-[#00E08A]/10 border border-[#00E08A]/20 rounded-xl flex items-center justify-center">
            <LogIn className="w-6 h-6 text-[#00E08A]" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Acessar Plataforma
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Entre na sua conta para acompanhar as melhores tips do dia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-400 text-xs items-center">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-505">
                  <Mail className="w-4 h-4 text-zinc-500" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu-email@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#00E08A] transition-colors placeholder:text-zinc-600 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-505">
                  <Lock className="w-4 h-4 text-zinc-500" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-[#00E08A] transition-colors placeholder:text-zinc-600 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00E08A] hover:bg-[#00E08A]/90 text-black font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00E08A]/10 mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar na Conta'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
