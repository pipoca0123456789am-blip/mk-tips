// app/api/whatsapp/sessions/route.ts
// Proxy de sessões → WACLI (com mock fallback)

import { NextResponse } from 'next/server'

const WACLI = process.env.WACLI_BASE_URL ?? 'http://localhost:3333'

const MOCK_SESSIONS = [
  {
    id: 's-1',
    name: 'MK TIPS Principal',
    number: '+55 11 99999-0001',
    photo: null,
    status: 'online',
    lastConnected: new Date().toISOString(),
    device: 'iPhone 15 Pro',
    uptime: '3h 42m',
    sentCount: 1284,
    receivedCount: 312,
  },
  {
    id: 's-2',
    name: 'MK TIPS Suporte',
    number: '+55 11 99999-0002',
    photo: null,
    status: 'qr_pending',
    lastConnected: new Date(Date.now() - 86400000).toISOString(),
    device: 'Android',
    uptime: '0m',
    sentCount: 0,
    receivedCount: 0,
  },
]

export async function GET() {
  try {
    const res = await fetch(`${WACLI}/api/sessions`, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const res = await fetch(`${WACLI}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(await res.json())
  } catch {
    const mock = {
      id: `s-${Date.now()}`,
      name: body.name,
      number: '',
      status: 'qr_pending',
      lastConnected: new Date().toISOString(),
      device: '',
      uptime: '0m',
      sentCount: 0,
      receivedCount: 0,
    }
    return NextResponse.json(mock, { status: 201 })
  }
}
