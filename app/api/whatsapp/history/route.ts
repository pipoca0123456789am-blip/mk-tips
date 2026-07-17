import { NextResponse } from 'next/server'
const MOCK = Array.from({ length: 20 }, (_, i) => ({
  id: `msg-${i}`,
  to: `+5511${String(999990000 + i).slice(0, 9)}`,
  toName: ['Henrique Blume', 'Lucas Pereira', 'Fernanda Silva', 'Carlos Eduardo'][i % 4],
  message: '🎯 Nova Tip publicada! Evento: Flamengo x Palmeiras | Odd: 1.85 | Stake: 3u',
  sessionId: 's-1',
  status: ['delivered', 'sent', 'failed', 'read'][i % 4],
  sentAt: new Date(Date.now() - i * 300000).toISOString(),
  deliveredAt: i % 4 !== 2 ? new Date(Date.now() - i * 295000).toISOString() : undefined,
}))
export async function GET() { return NextResponse.json([]) }
