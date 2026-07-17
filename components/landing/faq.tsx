'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  { q: 'Como funciona a MK Tips?', a: 'A MK Tips é uma plataforma SaaS profissional de investimentos esportivos. Nós reunimos estatísticas, histórico auditado, cálculo automático de stakes, comparação de odds e ferramentas em um único ecossistema.' },
  { q: 'Como recebo o acesso?', a: 'O acesso é imediato. Assim que o seu pagamento (via PIX ou cartão) for processado, você receberá seus dados de acesso por e-mail automaticamente.' },
  { q: 'Posso cancelar a assinatura?', a: 'Sim, você pode cancelar a assinatura a qualquer momento sem taxas adicionais ou fidelidade obrigatória diretamente no seu painel de conta.' },
  { q: 'Como funciona o aplicativo?', a: 'Nosso aplicativo usa tecnologia PWA (Progressive Web App). Você pode adicioná-lo à tela inicial do celular pelo Safari ou Chrome, sem ocupar espaço e com suporte a notificações push.' },
  { q: 'Como funciona o Plano VIP?', a: 'O Plano VIP é nossa assinatura anual com o melhor custo-benefício. Garante acesso total por 12 meses a todos os recursos Premium, robô de CRM integrado via WhatsApp e suporte prioritário 24/7.' },
  { q: 'A plataforma oferece lucro garantido?', a: 'Não. Investimentos esportivos envolvem riscos de perda de capital. Trabalhamos orientados a valor estatístico no longo prazo e gestão de riscos, sem qualquer promessa de lucros certos.' },
  { q: 'O que é ROI e Yield?', a: 'ROI é o Retorno sobre o Investimento em relação ao capital total movimentado. Yield representa o ganho percentual médio obtido sobre o montante total de stake apostada.' },
  { q: 'Quais esportes são analisados?', a: 'Cobrimos dezenas de modalidades, incluindo Futebol, Basquete (NBA), Tênis, E-sports, MMA e muito mais, monitorando campeonatos do mundo todo.' },
  { q: 'Preciso ter conta em várias casas de apostas?', a: 'Recomendamos possuir conta nas principais casas (Bet365, Betano, Stake, KTO, etc.) para aproveitar a melhor odd indicada automaticamente pela nossa comparação em tempo real.' },
  { q: 'O que é gestão de banca?', a: 'É o controle financeiro do seu capital de apostas. A plataforma calcula o percentual ideal de stake (ex: 1% a 3%) para cada tip publicada, evitando o risco de quebrar a banca.' },
  { q: 'Recebo alertas de novos palpites?', a: 'Sim. Você recebe notificações push em tempo real na plataforma, PWA do celular e, opcionalmente, via e-mail e canais integrados de Telegram/WhatsApp.' },
  { q: 'O histórico de tips é realmente transparente?', a: 'Sim. Não apagamos nem editamos resultados passados. Todo palpite resolvido (seja Green ou Red) permanece arquivado e auditado para livre consulta.' },
  { q: 'Posso usar a plataforma se for iniciante?', a: 'Perfeitamente. O painel é didático e fornece todas as orientações de valor esperado, justificativa das entradas e limites de banca para guiar iniciantes.' },
  { q: 'Como funciona o Torneio Vale Tudo?', a: 'É uma competição interna interativa de palpiteiros com rankings dinâmicos e premiações em destaque.' },
  { q: 'O que é a Central de IA?', a: 'É uma ferramenta que usa inteligência artificial e regressão matemática para prever tendências estatísticas de partidas com base em dados históricos dos times.' },
  { q: 'O que é a ferramenta CRM WhatsApp?', a: 'Uma funcionalidade avançada para parceiros e tipsters enviarem relatórios de desempenho e palpites aos seus clientes de forma automatizada no WhatsApp.' },
  { q: 'Há suporte em caso de dúvidas?', a: 'Sim. Dispomos de suporte via e-mail, central de chamados no painel e atendimento prioritário em tempo real via WhatsApp nos planos pagos.' },
  { q: 'A plataforma faz as apostas por mim?', a: 'Não. A MK Tips indica a melhor oportunidade, odd e link direto, mas a execução da aposta deve ser realizada pelo usuário em sua respectiva conta na casa de apostas.' },
  { q: 'Os dados da plataforma são atualizados em tempo real?', a: 'Sim. A sincronização de cotações, encerramento de tips e logs operacionais ocorrem de forma contínua e automática.' },
  { q: 'Consigo emitir comprovantes de assinatura?', a: 'Sim. Todo o histórico financeiro e faturas de renovação ficam disponíveis para download na área de faturamento do seu painel.' }
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-white text-xs sm:text-sm hover:text-[#00E08A] transition-colors cursor-pointer"
      >
        <span>{q}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-555 transition-transform duration-305 ${isOpen ? 'rotate-180 text-[#00E08A]' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 border-t border-zinc-900/60' : 'max-h-0'}`}>
        <p className="p-5 text-xs sm:text-sm leading-relaxed text-zinc-400">{a}</p>
      </div>
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-black overflow-hidden border-t border-zinc-900/40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Dúvidas Frequentes
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Tudo o que você precisa saber
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Selecione uma dúvida abaixo para obter suporte operacional imediato sobre a nossa infraestrutura.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <AccordionItem key={idx} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
