import { NextResponse } from 'next/server'
const AUTOMATIONS = [
  { id: 'auto-1', name: 'Disparo de Nova Tip', trigger: 'new_tip', templateId: 'tpl-1', sessionId: 's-1', targetType: 'communities', targetIds: ['c-1','c-2','c-3'], active: true, lastFired: new Date(Date.now()-3600000).toISOString(), firedCount: 128 },
  { id: 'auto-2', name: 'Boas-vindas ao Cadastro', trigger: 'payment_approved', templateId: 'tpl-2', sessionId: 's-1', targetType: 'contacts', targetIds: [], active: true, lastFired: new Date(Date.now()-7200000).toISOString(), firedCount: 47 },
  { id: 'auto-3', name: 'Recuperação de Abandono', trigger: 'popup', templateId: 'tpl-3', sessionId: 's-1', targetType: 'contacts', targetIds: [], active: false, lastFired: new Date(Date.now()-86400000).toISOString(), firedCount: 23 },
  { id: 'auto-4', name: 'Disparo de Alavancagem', trigger: 'new_leverage', templateId: 'tpl-4', sessionId: 's-1', targetType: 'communities', targetIds: ['c-1'], active: true, lastFired: new Date(Date.now()-172800000).toISOString(), firedCount: 15 },
  { id: 'auto-5', name: 'Vale Tudo — Nova Competição', trigger: 'valetudo', templateId: 'tpl-5', sessionId: 's-1', targetType: 'groups', targetIds: ['g-1'], active: true, lastFired: undefined, firedCount: 0 },
  { id: 'auto-6', name: 'Notificação de Cancelamento', trigger: 'cancellation', templateId: 'tpl-2', sessionId: 's-1', targetType: 'contacts', targetIds: [], active: false, lastFired: undefined, firedCount: 0 },
]
export async function GET() { return NextResponse.json([]) }
export async function POST(req: Request) {
  const body = await req.json()
  if (body.trigger) {
    // trigger fire event
    return NextResponse.json({ fired: 1 })
  }
  return NextResponse.json({ id: `auto-${Date.now()}`, ...body, firedCount: 0 }, { status: 201 })
}
