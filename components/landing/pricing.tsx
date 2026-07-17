'use client'

import React from 'react'
import { Check, Crown, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pricingPlans = [
  {
    name: 'Starter',
    price: '49,90',
    period: '/mês',
    description: 'Ideal para quem deseja começar utilizando uma plataforma profissional para acompanhar oportunidades, consultar histórico e organizar sua rotina de forma simples.',
    highlight: false,
    badge: null,
    cta: 'Começar no Starter',
    features: [
      'Visualização básica de tips',
      'Histórico dos últimos 30 dias',
      'Painel de controle simplificado',
      'Alertas básicos de odd',
      'Suporte padrão'
    ]
  },
  {
    name: 'Premium',
    price: '97,90',
    period: '/mês',
    description: 'Para quem deseja acesso completo à plataforma, estatísticas avançadas, histórico ilimitado e todos os recursos disponíveis diariamente.',
    highlight: true,
    badge: 'Mais Escolhido',
    cta: 'Assinar Premium',
    features: [
      'Tips 100% ilimitadas sem restrições',
      'Histórico completo e auditado total',
      'Métricas de ROI & Yield avançadas',
      'Gestão de banca com calculadora',
      'Suporte prioritário dedicado'
    ]
  },
  {
    name: 'VIP',
    price: '497,90',
    period: '/ano',
    description: 'A experiência definitiva da MK Tips. Economia anual, recursos exclusivos, acesso antecipado às novidades e atendimento prioritário.',
    highlight: false,
    badge: 'VIP Anual',
    cta: 'Quero ser VIP',
    features: [
      'Todos os recursos Premium por 1 ano',
      'Maior economia anual do plano',
      'Disparos automáticos WhatsApp CRM',
      'Acesso antecipado a novos módulos',
      'Atendimento prioritário VIP 24/7'
    ]
  }
]

const comparisonFeatures = [
  { label: 'Tips Diárias', starter: 'Até 5', premium: 'Ilimitadas', vip: 'Ilimitadas' },
  { label: 'Histórico Auditado', starter: '30 dias', premium: 'Completo', vip: 'Completo' },
  { label: 'Gestão de Banca', starter: 'Não', premium: 'Sim', vip: 'Sim' },
  { label: 'Gráficos e Estatísticas', starter: 'Básicos', premium: 'Avançados', vip: 'Avançados' },
  { label: 'WhatsApp CRM Integrado', starter: 'Não', premium: 'Não', vip: 'Sim' },
  { label: 'Notificações Instantâneas', starter: 'Sim', premium: 'Sim (Push)', vip: 'Sim (Push/Telegram)' },
  { label: 'Suporte Técnico', starter: 'Padrão', premium: 'Prioritário', vip: 'VIP Dedicado 24/7' }
]

export function Pricing({ onSelectPlan }: { onSelectPlan: (plan: 'Starter' | 'Premium' | 'VIP Anual') => void }) {
  return (
    <section id="planos" className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      <div className="pointer-events-none absolute left-1/2 top-1/4 w-[750px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] -translate-x-1/2" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Nossos Planos
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Escolha o plano ideal para sua banca
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Acesso imediato às melhores oportunidades. Sem multas de cancelamento e com total transparência.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 bg-zinc-950/40 backdrop-blur-md transition-all duration-300 transform hover:scale-[1.03] ${
                plan.highlight
                  ? 'border-[#00E08A]/50 bg-zinc-950/70 shadow-xl shadow-[#00E08A]/5 lg:-mt-4 lg:mb-4'
                  : 'border-zinc-900 hover:border-zinc-800'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  plan.highlight 
                    ? 'bg-[#00E08A] text-black shadow-lg shadow-[#00E08A]/20' 
                    : 'bg-zinc-900 border border-zinc-850 text-zinc-450'
                }`}>
                  {plan.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {plan.name === 'VIP' && <Crown className="h-5 w-5 text-yellow-500" />}
                  {plan.name === 'Premium' && <Award className="h-5 w-5 text-[#00E08A]" />}
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">{plan.name}</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed min-h-[90px]">{plan.description}</p>

                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase">R$</span>
                  <span className="font-mono text-3xl font-black text-white tracking-tight">{plan.price}</span>
                  <span className="text-xs text-zinc-500 font-bold">{plan.period}</span>
                </div>

                <ul className="space-y-3 pt-6 border-t border-zinc-900">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-zinc-350">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[#00E08A] border border-emerald-500/20">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => onSelectPlan((plan.name === 'VIP' ? 'VIP Anual' : plan.name) as any)}
                  className={`w-full py-3 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all ${
                    plan.highlight
                      ? 'bg-[#00E08A] text-black hover:bg-[#00E08A]/90'
                      : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-350 hover:text-white border border-zinc-800'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Plan Comparison Matrix Table */}
        <div className="pt-16 space-y-6 max-w-5xl mx-auto">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Comparação Detalhada</h3>
            <p className="text-xs text-zinc-550 mt-1">Veja quais recursos e ferramentas acompanham cada plano.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950/60 font-bold uppercase text-zinc-550 text-[10px] tracking-wider">
                  <th className="p-4">Recursos</th>
                  <th className="p-4 text-center">Starter</th>
                  <th className="p-4 text-center text-[#00E08A]">Premium</th>
                  <th className="p-4 text-center">VIP (Anual)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/15 transition-colors">
                    <td className="p-4 font-semibold text-white">{row.label}</td>
                    <td className="p-4 text-center text-zinc-400 font-medium">{row.starter}</td>
                    <td className="p-4 text-center text-[#00E08A] font-bold">{row.premium}</td>
                    <td className="p-4 text-center text-zinc-400 font-medium">{row.vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}
