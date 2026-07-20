'use client'

import React, { useState, useEffect } from 'react'
import { X, Smartphone, Bell, Share2, MoreVertical, Download, Monitor } from 'lucide-react'

type DeviceKind = 'android' | 'ios' | 'desktop'

const SNOOZE_DAYS = 5
const SNOOZE_MS = SNOOZE_DAYS * 24 * 60 * 60 * 1000
const SNOOZE_KEY = 'oddvault_pwa_snooze'

function detectDevice(): DeviceKind {
  if (typeof window === 'undefined') return 'desktop'
  const ua = window.navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  return 'desktop'
}

function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    !!(window.navigator as any).standalone
  )
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showSplash, setShowSplash] = useState(false)
  const [device, setDevice] = useState<DeviceKind>('desktop')
  const [installHint, setInstallHint] = useState('')
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    const installed = isAppInstalled()
    setIsStandalone(installed)
    setDevice(detectDevice())

    // Migrate old "never show again" into a finite snooze
    if (localStorage.getItem('oddvault_pwa_dismissed') === 'true') {
      localStorage.removeItem('oddvault_pwa_dismissed')
      if (!localStorage.getItem(SNOOZE_KEY)) {
        localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS))
      }
    }

    if (installed) {
      const splashShown = sessionStorage.getItem('oddvault_splash_shown')
      if (!splashShown) {
        setShowSplash(true)
        sessionStorage.setItem('oddvault_splash_shown', 'true')
        const timer = setTimeout(() => setShowSplash(false), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  useEffect(() => {
    // Never prompt if already installed (mobile OR desktop PWA)
    if (isStandalone || isAppInstalled()) {
      setShowBanner(false)
      return
    }

    const isLoggedIn = localStorage.getItem('oddvault_user_session') === 'true'
    if (!isLoggedIn) {
      setShowBanner(false)
      return
    }

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') setPushSubscribed(true)
    }

    const snoozeUntil = parseInt(localStorage.getItem(SNOOZE_KEY) || '0', 10)
    const isSnoozed = Number.isFinite(snoozeUntil) && Date.now() < snoozeUntil
    if (isSnoozed) {
      setShowBanner(false)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Show on mobile AND desktop after login (if not installed / not snoozed)
    setShowBanner(true)
    localStorage.removeItem('oddvault_pwa_show_after_login')

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isStandalone])

  const snoozePopup = () => {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS))
    localStorage.removeItem('oddvault_pwa_dismissed')
    localStorage.removeItem('oddvault_pwa_show_after_login')
    setShowBanner(false)
  }

  const handleInstall = async () => {
    setInstallHint('')
    setInstalling(true)

    try {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        setDeferredPrompt(null)
        if (outcome === 'accepted') {
          setShowBanner(false)
          localStorage.removeItem(SNOOZE_KEY)
          localStorage.removeItem('oddvault_pwa_show_after_login')
          setInstallHint(
            device === 'desktop'
              ? 'App instalado! Procure MK TIPS no menu Iniciar ou na área de trabalho.'
              : 'App instalado! Procure o ícone MK TIPS na tela inicial.',
          )
        } else {
          setInstallHint('Instalação cancelada. Você pode tentar de novo quando quiser.')
        }
        return
      }

      if (device === 'ios') {
        setInstallHint(
          'No iPhone: toque em Compartilhar (□↑) → “Adicionar à Tela de Início” → Adicionar.',
        )
        return
      }

      if (device === 'android') {
        setInstallHint(
          'No Android: menu (⋮) → “Instalar aplicativo” ou “Adicionar à tela inicial” → Instalar.',
        )
        return
      }

      setInstallHint(
        'No Chrome/Edge: clique no ícone de instalar na barra de endereço (ou menu → Instalar MK TIPS).',
      )
    } finally {
      setInstalling(false)
    }
  }

  const handleSubscribePush = () => {
    if (!('Notification' in window)) {
      alert('Seu navegador nao suporta notificacoes push.')
      return
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        setPushSubscribed(true)
        setTimeout(() => {
          new Notification('MK TIPS Premium', {
            body: '🎯 Nova Tip Disponível!',
            icon: '/logo-mktips.png',
          })
        }, 1500)
      }
    })
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0c1210] z-[9999] flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <img
            src="/logo-mktips.png"
            alt="MK Tips"
            className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-emerald-500/20 mx-auto border border-emerald-500/20"
          />
          <div>
            <h1 className="text-2xl font-black text-white tracking-wider">MK TIPS</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">
              Tips Esportivas Premium
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!showBanner) {
    if (isStandalone && !pushSubscribed) {
      return (
        <button
          onClick={handleSubscribePush}
          className="fixed bottom-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-black p-3 rounded-full shadow-2xl z-40 flex items-center gap-1.5 font-bold text-[10px] cursor-pointer"
          title="Ativar Notificações"
        >
          <Bell className="w-4 h-4 animate-bounce" />
          <span>Ativar Notificações</span>
        </button>
      )
    }
    return null
  }

  const steps =
    device === 'ios'
      ? [
          { icon: Smartphone, text: 'Abra o site no Safari (não no Chrome).' },
          { icon: Share2, text: 'Toque em Compartilhar (ícone □↑ na barra inferior).' },
          { icon: Download, text: 'Role e toque em “Adicionar à Tela de Início”.' },
          { icon: Smartphone, text: 'Toque em Adicionar — o app MK TIPS aparece na tela do celular.' },
        ]
      : device === 'android'
        ? [
            { icon: Smartphone, text: 'Use o Chrome no celular.' },
            { icon: MoreVertical, text: 'Toque no menu (⋮) no canto superior.' },
            { icon: Download, text: 'Toque em “Instalar aplicativo” ou “Adicionar à tela inicial”.' },
            { icon: Smartphone, text: 'Confirme em Instalar — o ícone aparece na tela inicial.' },
          ]
        : [
            { icon: Monitor, text: 'Abra no Google Chrome ou Microsoft Edge no computador.' },
            { icon: Download, text: 'Clique no ícone de instalar na barra de endereço (lado direito).' },
            { icon: Monitor, text: 'Confirme em Instalar — o atalho fica no Desktop / Menu Iniciar.' },
          ]

  const canNativeInstall = !!deferredPrompt
  const deviceLabel =
    device === 'ios' ? 'iPhone' : device === 'android' ? 'Android' : 'Computador'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-5 sm:p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl text-xs text-zinc-300 flex flex-col gap-4 animate-scale-in max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-start gap-3">
          <div className="flex gap-3">
            <img
              src="/logo-mktips.png"
              alt="MK Tips"
              className="w-11 h-11 rounded-xl object-cover border border-emerald-500/20 shrink-0"
            />
            <div>
              <h3 className="text-base font-bold text-white">Instale o app MK TIPS</h3>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {device === 'desktop'
                  ? 'Disponível no computador também. Siga o passo a passo e clique em Instalar.'
                  : 'Siga o passo a passo e toque em Instalar. O app fica na tela do seu celular.'}
              </p>
            </div>
          </div>
          <button onClick={snoozePopup} className="text-zinc-500 hover:text-white cursor-pointer p-1 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-2.5">
            Passo a passo — {deviceLabel}
          </span>
          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-zinc-900/50 border border-zinc-800 rounded-xl p-3"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[11px] font-black shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-200 leading-relaxed text-[12px]">{step.text}</p>
                  </div>
                  <Icon className="w-4 h-4 text-emerald-400/70 shrink-0 mt-0.5" />
                </div>
              )
            })}
          </div>
        </div>

        {installHint ? (
          <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] leading-relaxed rounded-xl p-3">
            {installHint}
          </div>
        ) : null}

        <p className="text-[10px] text-zinc-500 leading-relaxed">
          Se você escolher “Agora não”, o aviso volta em {SNOOZE_DAYS} dias — só se o app ainda não estiver instalado.
        </p>

        <div className="flex flex-col gap-2 pt-1 border-t border-zinc-900">
          <button
            type="button"
            onClick={handleInstall}
            disabled={installing}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-black font-extrabold rounded-xl cursor-pointer transition-colors shadow-lg shadow-emerald-500/20 text-sm"
          >
            {installing
              ? 'Abrindo instalação…'
              : canNativeInstall
                ? device === 'desktop'
                  ? 'Instalar no computador'
                  : 'Instalar no celular'
                : device === 'ios'
                  ? 'Como instalar no iPhone'
                  : 'Instalar app'}
          </button>
          <button
            type="button"
            onClick={snoozePopup}
            className="w-full py-2.5 bg-transparent text-zinc-500 hover:text-zinc-300 font-bold rounded-xl cursor-pointer transition-colors text-[11px]"
          >
            Agora não (lembrar em {SNOOZE_DAYS} dias)
          </button>
        </div>
      </div>
    </div>
  )
}
