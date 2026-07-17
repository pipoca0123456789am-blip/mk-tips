'use client'

import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone, Gift, Sparkles, ArrowRight, Mail, User, Percent } from 'lucide-react'

// ─── Popup 1: Baixar o App ──────────────────────────────────────────────────

export function AppDownloadPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Não mostra se já foi fechado nesta sessão
    if (sessionStorage.getItem('mk_app_popup_dismissed')) return
    const timer = setTimeout(() => setShow(true), 4000) // 4s delay
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem('mk_app_popup_dismissed', 'true')
    // Dispara evento para o popup de desconto saber que este foi fechado
    window.dispatchEvent(new CustomEvent('mk_app_popup_closed'))
  }

  if (!show || dismissed) return null

  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Card */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-emerald-500/5 animate-in slide-in-from-bottom-4 duration-500">
        {/* Close */}
        <button onClick={handleClose} className="absolute top-3 right-3 p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
          <X className="w-4 h-4" />
        </button>

        {/* Glow effect */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mx-auto mb-4">
          <Smartphone className="w-7 h-7 text-emerald-400" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white text-center mb-1">
          Baixe o App MK Tips
        </h3>
        <p className="text-sm text-zinc-400 text-center mb-5 leading-relaxed">
          Receba alertas em tempo real, acompanhe suas tips e gerencie sua banca direto pelo celular.
        </p>

        {/* Buttons */}
        <div className="space-y-2.5">
          <a
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/25"
          >
            <Download className="w-4 h-4" />
            Baixar para Android
          </a>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all text-sm border border-zinc-700"
          >
            <Download className="w-4 h-4" />
            Baixar para iOS
          </a>
        </div>

        <button onClick={handleClose} className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 mt-3 py-1.5 transition-colors cursor-pointer">
          Continuar no navegador
        </button>
      </div>
    </div>
  )
}

// ─── Popup 2: Criar Conta + 5% Desconto ─────────────────────────────────────

export function DiscountSignupPopup({ onSignup }: { onSignup?: (plan: 'Free') => void }) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [countdown, setCountdown] = useState(15 * 60) // 15 min countdown

  useEffect(() => {
    // Não mostra se já foi fechado nesta sessão
    if (sessionStorage.getItem('mk_discount_popup_dismissed')) return

    // Aguarda o popup do app ser fechado + delay de leitura (45s após fechar o popup do app)
    const handleAppClosed = () => {
      const timer = setTimeout(() => {
        // Verifica scroll — mostra apenas se o usuário já rolou pelo menos 30% da página
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
        if (scrollPercent > 0.2) {
          setShow(true)
        } else {
          // Se ainda não rolou, espera pelo scroll
          const scrollHandler = () => {
            const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
            if (pct > 0.3) {
              setShow(true)
              window.removeEventListener('scroll', scrollHandler)
            }
          }
          window.addEventListener('scroll', scrollHandler)
        }
      }, 45000) // 45 segundos de pausa após fechar o popup do app
      return () => clearTimeout(timer)
    }

    window.addEventListener('mk_app_popup_closed', handleAppClosed)

    // Fallback: se o popup do app nunca aparecer, mostra após 60s + scroll
    const fallback = setTimeout(() => {
      if (sessionStorage.getItem('mk_discount_popup_dismissed')) return
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrollPercent > 0.3) {
        setShow(true)
      } else {
        const scrollHandler = () => {
          const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
          if (pct > 0.3) {
            setShow(true)
            window.removeEventListener('scroll', scrollHandler)
          }
        }
        window.addEventListener('scroll', scrollHandler)
      }
    }, 60000)

    return () => {
      window.removeEventListener('mk_app_popup_closed', handleAppClosed)
      clearTimeout(fallback)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!show || submitted) return
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [show, submitted])

  const handleClose = () => {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem('mk_discount_popup_dismissed', 'true')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitted(true)
    // Salva lead no localStorage para o CRM capturar
    const leads = JSON.parse(localStorage.getItem('mk_leads') || '[]')
    leads.push({ name, email, discount: '5%', source: 'popup_desconto', createdAt: new Date().toISOString() })
    localStorage.setItem('mk_leads', JSON.stringify(leads))
    // Auto-fecha após 3s
    setTimeout(() => {
      handleClose()
      onSignup?.('Free')
    }, 3000)
  }

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60

  if (!show || dismissed) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />
      
      {/* Card */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Top gradient banner */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 p-5 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />
          <button onClick={handleClose} className="absolute top-2 right-2 p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
          
          {/* Discount badge */}
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white mb-3 border border-white/10">
            <Gift className="w-3.5 h-3.5" />
            OFERTA EXCLUSIVA
          </div>

          <h3 className="text-2xl font-black text-white leading-tight">
            Ganhe <span className="text-yellow-300">5% OFF</span>
          </h3>
          <p className="text-sm text-white/80 mt-1">
            Crie sua conta agora e desbloqueie o desconto
          </p>
        </div>

        <div className="p-6">
          {!submitted ? (
            <>
              {/* Urgency timer */}
              {countdown > 0 && (
                <div className="flex items-center justify-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-red-400">
                      Expira em {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600 text-sm"
                  />
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/25 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4" />
                  Criar Conta e Ganhar 5% OFF
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> Desconto aplicado automático</span>
                <span>•</span>
                <span>Sem cartão de crédito</span>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Desconto ativado! 🎉</h4>
              <p className="text-sm text-zinc-400">
                Bem-vindo(a), <strong className="text-emerald-400">{name.split(' ')[0]}</strong>! Seu cupom de 5% foi aplicado.
              </p>
              <p className="text-xs text-zinc-500 mt-2">Redirecionando...</p>
            </div>
          )}

          <button onClick={handleClose} className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 mt-3 py-1.5 transition-colors cursor-pointer">
            Não, obrigado
          </button>
        </div>
      </div>
    </div>
  )
}
