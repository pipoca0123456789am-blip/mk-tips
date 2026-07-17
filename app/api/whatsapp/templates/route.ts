import { NextResponse } from 'next/server'
const TEMPLATES = [
  { id: 'tpl-1', name: 'Nova Tip', content: '🎯 *NOVA TIP MK TIPS* 🎯\n\n*Evento:* {{evento}}\n*Mercado:* {{mercado}}\n*Odd:* {{odd}}\n*Stake:* {{stake}}u\n*Tipster:* {{tipster}}\n\n_Entre agora: {{link}}_', variables: ['evento','mercado','odd','stake','tipster','link'], createdAt: new Date().toISOString() },
  { id: 'tpl-2', name: 'Boas-vindas', content: 'Olá, {{nome}}! 👋\n\nBem-vindo à *MK TIPS*! Seu plano *{{plano}}* já está ativo.\n\nAcompanhe suas tips em: {{link}}', variables: ['nome','plano','link'], createdAt: new Date().toISOString() },
  { id: 'tpl-3', name: 'Recuperação de Checkout', content: 'Ei, {{nome}}! 👀\n\nVi que você estava interessado no plano *{{plano}}*...\n\nUse o cupom *RETORNO10* e ganhe 10% de desconto hoje! 🔥\n\n{{link}}', variables: ['nome','plano','link'], createdAt: new Date().toISOString() },
  { id: 'tpl-4', name: 'Nova Alavancagem', content: '🚀 *ALAVANCAGEM ESPECIAL*\n\n{{nome}}, temos uma oportunidade única no mercado de {{mercado}}!\n\n*Evento:* {{evento}}\n*Odd:* {{odd}}\n\nAcesse agora: {{link}}', variables: ['nome','mercado','evento','odd','link'], createdAt: new Date().toISOString() },
  { id: 'tpl-5', name: 'Vale Tudo', content: '🏆 *VALE TUDO — COMPETIÇÃO ATIVA!*\n\n{{nome}}, a competição está rolando!\n\n*Sua posição:* {{saldo}} pontos\n*Data fim:* {{data}}\n\nJogue agora: {{link}}', variables: ['nome','saldo','data','link'], createdAt: new Date().toISOString() },
]
export async function GET() { return NextResponse.json([]) }
export async function POST(req: Request) {
  const body = await req.json()
  return NextResponse.json({ id: `tpl-${Date.now()}`, ...body, createdAt: new Date().toISOString() }, { status: 201 })
}
