import { NextResponse } from 'next/server'
const MOCK = Array.from({ length: 15 }, (_, i) => ({
  id: `log-${i}`,
  sessionId: 's-1',
  sessionName: 'MK TIPS Principal',
  action: ['Envio individual', 'Disparo em massa', 'Reconexão automática', 'Import comunidades'][i % 4],
  target: ['+5511999990001', 'Grupo VIP', 'WACLI', 'Comunidade Starter'][i % 4],
  status: i % 7 === 0 ? 'failed' : 'success',
  duration: Math.round(Math.random() * 500 + 50),
  timestamp: new Date(Date.now() - i * 600000).toISOString(),
}))
export async function GET() { return NextResponse.json(MOCK) }
