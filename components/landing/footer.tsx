'use client'

import React from 'react'
import { Camera, Send, MessageCircle, Mail, HelpCircle } from 'lucide-react'

const columns = [
  {
    title: 'Produto',
    links: [
      { label: 'Como Funciona', href: '#como-funciona' },
      { label: 'Recursos', href: '#recursos' },
      { label: 'Planos', href: '#planos' },
      { label: 'Resultados', href: '#resultados' }
    ]
  },
  {
    title: 'Institucional',
    links: [
      { label: 'Termos de Uso', href: '#' },
      { label: 'Política de Privacidade', href: '#' },
      { label: 'Contato', href: '#' }
    ]
  },
  {
    title: 'Suporte',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Central de Ajuda', href: '#' },
      { label: 'WhatsApp Suporte', href: '#' }
    ]
  }
]

const socials = [
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: Send, label: 'Telegram', href: '#' },
  { icon: HelpCircle, label: 'Suporte', href: '#' }
]

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid gap-10 lg:grid-cols-[2fr_repeat(3,1fr)]">
          {/* Logo & Description */}
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-2" aria-label="MK TIPS">
              <img src="/logo-mktips.png" alt="MK TIPS Logo" className="h-8 w-auto object-contain" />
            </a>
            <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-zinc-400">
              A plataforma SaaS premium de tips esportivas com ROI transparente e gestão de banca inteligente.
            </p>
            <div className="flex gap-2">
              {socials.map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-850 bg-zinc-900/30 text-zinc-400 hover:text-[#00E08A] hover:border-[#00E08A]/30 transition-all cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Columns */}
          {columns.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-450 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Responsible Gaming & Copyright */}
        <div className="pt-8 border-t border-zinc-900/80 space-y-6">
          <p className="text-[10px] leading-relaxed text-zinc-550 max-w-4xl">
            Apostas esportivas envolvem risco financeiro. Jogue com responsabilidade e aposte apenas o que você pode perder. Proibido para menores de 18 anos. Se o jogo deixou de ser diversão, procure ajuda.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-zinc-500 font-bold">
            <p>© {new Date().getFullYear()} MK TIPS. Todos os direitos reservados.</p>
            <p>CNPJ 00.000.000/0001-00</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
