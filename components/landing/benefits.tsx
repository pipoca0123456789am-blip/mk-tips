'use client'

import React from 'react'
import {
  LayoutDashboard,
  History,
  TrendingUp,
  Wallet,
  Bell,
  Smartphone,
  Users,
  MessageCircle,
  FileText,
  Monitor,
  RefreshCw,
  Award
} from 'lucide-react'

const whyChooseUs = [
  { icon: LayoutDashboard, title: 'Dashboard Inteligente', desc: 'Centralize seus lucros, ROI, cotações e desempenho geral em um único painel minimalista.' },
  { icon: History, title: 'Histórico Completo', desc: 'Acesso completo a todas as tips resolvidas, sem ocultação ou manipulação de resultados.' },
  { icon: TrendingUp, title: 'Estatísticas Avançadas', desc: 'Filtre e analise sua taxa de acerto por modalidade esportiva, mercado e campeonato.' },
  { icon: Wallet, title: 'Gestão de Banca', desc: 'Monitore stakes sugeridas, lucros acumulados e controle o seu caixa de forma inteligente.' },
  { icon: Bell, title: 'Notificações Instantâneas', desc: 'Fique sabendo de novas tips no momento exato em que forem publicadas pelo analista.' },
  { icon: Smartphone, title: 'Aplicativo (PWA)', desc: 'Instale a plataforma diretamente em sua tela inicial sem consumir memória adicional.' },
  { icon: Users, title: 'Comunidade Integrada', desc: 'Conecte-se e interaja com outros assinantes e discuta estratégias do mercado.' },
  { icon: MessageCircle, title: 'CRM Inteligente', desc: 'Envio automatizado de relatórios e alertas diretamente via integrações WhatsApp.' }
]

const generalBenefits = [
  { icon: Award, title: 'Receba Tips Diariamente', desc: 'Novas tips e análises de valor publicadas todos os dias por analistas especializados.' },
  { icon: History, title: 'Histórico Completo', desc: 'Transparência em primeiro lugar. Veja todas as entradas passadas com ROI exato.' },
  { icon: LayoutDashboard, title: 'Dashboard Moderno', desc: 'Interface profissional e intuitiva inspirada nas melhores plataformas financeiras do mundo.' },
  { icon: FileText, title: 'Relatórios Completos', desc: 'Gere relatórios em PDF/Excel de suas apostas e desempenho para exportação rápida.' },
  { icon: Wallet, title: 'Gestão da Banca', desc: 'Controle de stake ideal baseado na sua banca simulada ou real configurada no perfil.' },
  { icon: Bell, title: 'Notificações no Celular', desc: 'Alertas em tempo real via push ou Telegram direto no seu smartphone.' },
  { icon: Smartphone, title: 'Acesso pelo Celular', desc: 'Totalmente otimizado para dispositivos móveis com carregamento ultra-rápido.' },
  { icon: Monitor, title: 'Acesso pelo Computador', desc: 'Painel completo e multitelas para analistas e traders que utilizam monitores.' },
  { icon: RefreshCw, title: 'Atualizações Constantes', desc: 'Melhorias contínuas de funcionalidades, integrações e novidades sem custos adicionais.' }
]

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative py-24 sm:py-32 bg-black overflow-hidden border-t border-zinc-900/40">
      <div className="pointer-events-none absolute right-1/4 top-1/4 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[120px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Diferenciais Premium
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Por que escolher a MK Tips?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Nossa plataforma foi desenvolvida com foco total na usabilidade, profissionalismo e ferramentas exclusivas para investidores esportivos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 hover:border-[#00E08A]/20 hover:bg-zinc-950/80 transition-all duration-300"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/5 blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] transition-colors group-hover:bg-[#00E08A] group-hover:text-black">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-white text-sm">{item.title}</h3>
                <p className="mt-2 text-zinc-400 text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Benefits() {
  return (
    <section id="recursos" className="relative py-24 sm:py-32 bg-black overflow-hidden border-t border-zinc-900/40">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Recursos e Funcionalidades
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Elimine planilhas complexas e canais dispersos. Centralize e gerencie sua rotina profissional de forma organizada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalBenefits.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group rounded-xl border border-zinc-900 bg-zinc-950/30 p-6 hover:border-[#00E08A]/20 hover:bg-zinc-950/65 transition-all"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-[#00E08A] transition-colors group-hover:bg-[#00E08A]/10">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-bold text-white text-sm">{item.title}</h3>
                <p className="mt-2 text-zinc-400 text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
