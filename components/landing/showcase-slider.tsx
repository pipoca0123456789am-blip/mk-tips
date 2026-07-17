'use client'

import React, { useState } from 'react'
import {
  LayoutDashboard,
  History,
  TrendingUp,
  Wallet,
  Trophy,
  MessageCircle,
  Sparkles,
  Smartphone,
  ChevronRight,
  Award
} from 'lucide-react'
import Image from 'next/image'

const demoTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, title: 'Painel de Controle Central', desc: 'Monitore lucros acumulados, ROI, estatísticas gerais e tenha total visibilidade da sua performance.' },
  { id: 'tips', label: 'Histórico', icon: History, title: 'Histórico 100% Transparente', desc: 'Analise todas as dicas publicadas, com detalhes completos de mercado, cotação final e status resoluto.' },
  { id: 'bankroll', label: 'Gestão', icon: Wallet, title: 'Gestão de Caixa Inteligente', desc: 'Calcule a stake ideal recomendada para cada tip de acordo com a sua banca configurada.' },
  { id: 'app', label: 'Aplicativo', icon: Smartphone, title: 'Plataforma Mobile (PWA)', desc: 'Instale o app nativo em segundos. Notificações push e acesso imediato na tela inicial do celular.' },
  { id: 'valetudo', label: 'Vale Tudo', icon: Trophy, title: 'Torneio de Analistas', desc: 'Acompanhe competições emocionantes, rankings dinâmicos e siga os melhores apostadores.' },
  { id: 'ai', label: 'IA', icon: Sparkles, title: 'Central de Inteligência Esportiva', desc: 'Use IA avançada para analisar tendências de partidas e gerar probabilidades matemáticas reais.' },
  { id: 'crm', label: 'CRM', icon: MessageCircle, title: 'Automação WhatsApp CRM', desc: 'Envie relatórios automáticos de green/red e alertas aos seus clientes via WhatsApp.' },
  { id: 'ranking', label: 'Ranking', icon: Award, title: 'Painel Geral de Líderes', desc: 'Veja a classificação geral dos tipsters parceiros auditados com base no ROI e acertos.' },
  { id: 'stats', label: 'Estatísticas', icon: TrendingUp, title: 'ROI & Yield Detalhados', desc: 'Filtre relatórios e gráficos por esporte, mercado ou tipster para otimização contínua.' }
]

export function ShowcaseSlider() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const currentData = demoTabs.find(t => t.id === activeTab) || demoTabs[0]

  return (
    <section id="demo" className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="pointer-events-none absolute left-1/2 bottom-0 w-[550px] h-[550px] bg-emerald-500/5 rounded-full blur-[130px] -translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Demonstração Interativa
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Demonstração da Plataforma
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Explore as principais telas e recursos operacionais de nossa infraestrutura completa.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
          {demoTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/10 text-[#00E08A] border-[#00E08A]/35 shadow-lg shadow-[#00E08A]/5'
                    : 'bg-zinc-900/40 border-zinc-900 text-zinc-450 hover:text-zinc-300 hover:border-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto pt-4">
          
          {/* Text Info */}
          <div className="lg:col-span-4 text-left space-y-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#00E08A]/10 text-[#00E08A] border border-[#00E08A]/20">
              {React.createElement(currentData.icon, { className: 'w-5 h-5' })}
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{currentData.title}</h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{currentData.desc}</p>
            <div className="pt-2">
              <a href="#planos" className="text-xs font-bold text-[#00E08A] hover:underline flex items-center gap-1">
                Acessar agora
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Device Mockup Box */}
          <div className="lg:col-span-8 relative">
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[#00E08A]/5 blur-2xl opacity-60" />
            
            <div className="relative border border-zinc-900 bg-zinc-950/70 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-1.5 border-b border-zinc-900 px-4 py-3 bg-zinc-950/85">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-[10px] font-mono text-zinc-550">app.mktips.com/dashboard/{currentData.id}</span>
              </div>

              {/* Dynamic screen views */}
              <div className="relative aspect-[16/10] bg-zinc-950 p-4 overflow-hidden flex items-center justify-center">
                {activeTab === 'dashboard' && (
                  <div className="w-full h-full relative animate-scale-in">
                    <Image src="/dashboard-mockup.png" fill alt="Dashboard" className="object-cover rounded-lg" />
                  </div>
                )}
                {activeTab === 'tips' && (
                  <div className="w-full h-full relative animate-scale-in">
                    <Image src="/tips-mockup.png" fill alt="Histórico" className="object-cover rounded-lg" />
                  </div>
                )}
                {activeTab === 'bankroll' && (
                  <div className="w-full h-full relative animate-scale-in flex flex-col justify-center bg-zinc-950 p-6 border border-zinc-900/50 rounded-lg space-y-4">
                    <div>
                      <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Banca Auditada</span>
                      <h4 className="text-lg font-black text-white">Cálculo Automático de Gestão</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-850">
                        <span className="text-[9px] text-zinc-500 block">Sua Banca Ativa</span>
                        <span className="text-sm font-bold text-white font-mono">R$ 2.000,00</span>
                      </div>
                      <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-850">
                        <span className="text-[9px] text-zinc-500 block">Stake Sugerida (2%)</span>
                        <span className="text-sm font-bold text-[#00E08A] font-mono">R$ 40,00</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'app' && (
                  <div className="w-full h-full relative animate-scale-in flex items-center justify-center bg-zinc-950">
                    <div className="w-44 h-60 border-4 border-zinc-800 bg-zinc-950 rounded-[1.8rem] overflow-hidden flex flex-col justify-between p-3 relative shadow-2xl">
                      <div className="w-12 h-2.5 bg-zinc-800 rounded-full mx-auto" />
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-1.5 pt-2">
                        <Smartphone className="w-6 h-6 text-[#00E08A]" />
                        <h5 className="text-[9px] font-bold text-white">MK Tips App</h5>
                        <p className="text-[7.5px] text-zinc-500 leading-snug">PWA leve para carregamento imediato.</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'valetudo' && (
                  <div className="w-full h-full relative animate-scale-in flex flex-col justify-between bg-zinc-950 p-6 border border-zinc-900/50 rounded-lg">
                    <h4 className="text-base font-bold text-white">Torneio Vale Tudo</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 bg-zinc-900/40 rounded-lg border border-zinc-850">
                        <span>🏆 Analista Premium</span>
                        <span className="text-[#00E08A] font-bold">120 pts</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-zinc-900/40 rounded-lg border border-zinc-850">
                        <span>🥈 Pro Trader</span>
                        <span className="text-zinc-400 font-bold">95 pts</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'ai' && (
                  <div className="w-full h-full relative animate-scale-in flex flex-col justify-center bg-zinc-950 p-6 border border-zinc-900/50 rounded-lg space-y-2">
                    <span className="text-[10px] text-[#00E08A] font-bold block">MK AI Assistant</span>
                    <p className="text-xs text-zinc-350 leading-relaxed">
                      "Real Madrid possui 74% de probabilidade de vitória baseado no modelo de regressão e cotação justa avaliada em 1.65 contra a cotação de 1.80 oferecida."
                    </p>
                  </div>
                )}
                {activeTab === 'crm' && (
                  <div className="w-full h-full relative animate-scale-in flex flex-col justify-center bg-zinc-950 p-6 border border-zinc-900/50 rounded-lg space-y-3">
                    <span className="text-[9px] text-zinc-550 block font-bold uppercase">Integração WhatsApp</span>
                    <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-850 text-xs italic text-zinc-300">
                      "Mensagem automática enviada via WhatsApp API: 🚀 Nova tip recomendada disponível no seu painel!"
                    </div>
                  </div>
                )}
                {activeTab === 'ranking' && (
                  <div className="w-full h-full relative animate-scale-in flex flex-col justify-between bg-zinc-950 p-6 border border-zinc-900/50 rounded-lg">
                    <h4 className="text-sm font-bold text-white uppercase">Ranking Geral de Tipsters</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 bg-zinc-900/30 border border-zinc-850 rounded">
                        <span>1. Tipster Master</span>
                        <span className="text-[#00E08A] font-bold">+28.5% ROI</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'stats' && (
                  <div className="w-full h-full relative animate-scale-in flex flex-col justify-between bg-zinc-950 p-6 border border-zinc-900/50 rounded-lg">
                    <h4 className="text-sm font-bold text-white uppercase">Estatísticas Operacionais</h4>
                    <div className="h-32 bg-zinc-900/20 border border-zinc-900 rounded-xl flex items-end justify-between p-3 gap-2">
                      <div className="flex-1 bg-zinc-800 h-[30%] rounded hover:bg-[#00E08A]" />
                      <div className="flex-1 bg-zinc-800 h-[50%] rounded hover:bg-[#00E08A]" />
                      <div className="flex-1 bg-[#00E08A] h-[85%] rounded" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
