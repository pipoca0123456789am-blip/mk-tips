'use client'

import React, { useState, useEffect } from 'react'
import { X, Smartphone, Bell, Check, Globe, Compass, Monitor, Apple } from 'lucide-react'

type OSTab = 'android' | 'ios' | 'windows' | 'macos'

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showSplash, setShowSplash] = useState(false)
  const [snoozeChecked, setSnoozeChecked] = useState(false)
  const [activeTab, setActiveTab] = useState<OSTab>('android')

  useEffect(() => {
    // Detect if running in standalone mode (already installed)
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
    setIsStandalone(!!checkStandalone)

    // Splash screen animation logic when app is opened in standalone
    if (checkStandalone) {
      const splashShown = sessionStorage.getItem('oddvault_splash_shown')
      if (!splashShown) {
        setShowSplash(true)
        sessionStorage.setItem('oddvault_splash_shown', 'true')
        const timer = setTimeout(() => {
          setShowSplash(false)
        }, 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('SW Registered:', reg)
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  window.location.reload()
                }
              }
            }
          }
        })
        .catch((err) => console.log('SW Registration Error:', err))
    }

    // Check notification permission state
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setPushSubscribed(true)
      }
    }

    const snoozeTime = localStorage.getItem('oddvault_pwa_snooze')
    const isSnoozed = snoozeTime && Date.now() < parseInt(snoozeTime)
    const isDismissed = localStorage.getItem('oddvault_pwa_dismissed')

    // Detect OS for setting default tab
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : ''
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setActiveTab('ios')
    } else if (/macintosh|mac os x/.test(userAgent)) {
      setActiveTab('macos')
    } else if (/windows|win32/.test(userAgent)) {
      setActiveTab('windows')
    } else {
      setActiveTab('android')
    }

    // Install prompt listener (Android/Chrome/Windows)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!isDismissed && !isStandalone && !isSnoozed) {
        setShowBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Manual detection for iOS since beforeinstallprompt is not supported
    if (/iphone|ipad|ipod/.test(userAgent) && !isStandalone && !isDismissed && !isSnoozed) {
      setShowBanner(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isStandalone])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowBanner(false)
      }
      setDeferredPrompt(null)
    } else {
      // If manual install on iOS or other browsers
      alert('Siga as instruções passo a passo abaixo para adicionar à tela inicial!')
    }
  }

  const handleDismiss = () => {
    if (snoozeChecked) {
      // Snooze for 7 days
      localStorage.setItem('oddvault_pwa_snooze', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString())
    } else {
      // Permanent dismiss
      localStorage.setItem('oddvault_pwa_dismissed', 'true')
    }
    setShowBanner(false)
  }

  const handleSubscribePush = () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações push.')
      return
    }

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setPushSubscribed(true)
        alert('🔔 Notificações push ativadas com sucesso!')
        setTimeout(() => {
          new Notification('MK TIPS Premium', {
            body: '🎯 Nova Tip Disponível! Real Madrid vs Man City - odd 1.91',
            icon: '/icon.svg'
          })
        }, 3000)
      } else {
        alert('Permissão para notificações negada.')
      }
    })
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0c1210] z-[9999] flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-emerald-500/20 mx-auto">
            <Smartphone className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wider">MK TIPS</h1>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Tips Esportivas Premium</p>
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

  const instructions = {
    android: [
      'Abra a plataforma no Google Chrome.',
      'Faça login normalmente.',
      'Toque no menu de três pontos (⋮) no canto superior direito.',
      'Toque em "Instalar aplicativo" ou "Adicionar à tela inicial".',
      'Confirme clicando em "Instalar".'
    ],
    ios: [
      'Abra a plataforma utilizando o Safari.',
      'Faça login normalmente.',
      'Toque no botão "Compartilhar" (ícone com seta para cima).',
      'Escolha a opção "Adicionar à Tela de Início".',
      'Confirme tocando em "Adicionar" no canto superior.'
    ],
    windows: [
      'Abra a plataforma no Google Chrome ou Microsoft Edge.',
      'Faça login normalmente.',
      'Clique no ícone de monitor com seta na barra de endereço (lado direito).',
      'Clique no botão "Instalar".',
      'Pronto! Atalho adicionado ao Menu Iniciar e Desktop.'
    ],
    macos: [
      'Abra a plataforma no Google Chrome ou Microsoft Edge.',
      'Faça login normalmente.',
      'Clique no ícone de instalação na barra de endereço.',
      'Confirme clicando em "Instalar".',
      'O aplicativo ficará disponível no Launchpad e pasta Aplicativos.'
    ]
  }

  const tabsConfig = [
    { key: 'android', label: 'Android', icon: Globe },
    { key: 'ios', label: 'iPhone (iOS)', icon: Compass },
    { key: 'windows', label: 'Windows', icon: Monitor },
    { key: 'macos', label: 'macOS', icon: Apple }
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-sm sm:max-w-md bg-zinc-950 border border-zinc-850 p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl text-xs text-zinc-300 flex flex-col gap-3.5 sm:gap-4 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">📲 Instale nosso aplicativo</h3>
              <p className="text-[9.5px] sm:text-[10px] text-zinc-400 mt-1 leading-relaxed">
                Tenha acesso mais rápido às tips, receba notificações em tempo real e acompanhe suas apostas com apenas um toque.
              </p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-zinc-500 hover:text-white cursor-pointer -mt-1 -mr-1 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Operating Systems Tabs */}
        <div className="border-b border-zinc-900 pb-2">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">Guia de Instalação Rápida</span>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabsConfig.map(tab => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as OSTab)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0 text-[10px] ${
                    activeTab === tab.key
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-900/40 border border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Step by Step instructions list */}
        <div className="bg-zinc-900/30 border border-zinc-850 p-4 rounded-xl space-y-2">
          {instructions[activeTab].map((step, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">{idx + 1}</span>
              <span className="text-zinc-300 leading-relaxed text-[10.5px]">{step}</span>
            </div>
          ))}
        </div>

        {/* Dismiss snooze option */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="snooze"
            checked={snoozeChecked}
            onChange={e => setSnoozeChecked(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950 cursor-pointer"
          />
          <label htmlFor="snooze" className="text-zinc-400 font-medium select-none cursor-pointer">
            Não mostrar novamente por 7 dias.
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-zinc-900">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 font-bold rounded-xl cursor-pointer transition-colors"
          >
            Agora Não
          </button>
          {deferredPrompt && (
            <button
              onClick={handleInstall}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-xl cursor-pointer transition-colors shadow-lg shadow-emerald-500/15"
            >
              Instalar Agora
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
