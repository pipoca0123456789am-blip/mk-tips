import { NextResponse } from 'next/server'
const WACLI = process.env.WACLI_BASE_URL ?? 'http://localhost:3333'
const MOCK = [
  { id: 'ct-1', name: 'Henrique Blume', phone: '+5511999990001', hasWhatsApp: true, tags: ['VIP'], plan: 'VIP Anual', communityId: 'c-1', communityName: 'Comunidade 1', status: 'active' },
  { id: 'ct-2', name: 'Lucas Pereira', phone: '+5521988887777', hasWhatsApp: true, tags: ['Starter'], plan: 'Starter', communityId: 'c-3', communityName: 'Comunidade 3', status: 'active' },
  { id: 'ct-3', name: 'Fernanda Silva', phone: '+5511977776666', hasWhatsApp: true, tags: ['Free'], plan: 'Free', communityId: null, communityName: null, status: 'left' },
  { id: 'ct-4', name: 'Carlos Eduardo', phone: '+5519966665555', hasWhatsApp: true, tags: ['VIP'], plan: 'VIP Anual', communityId: 'c-5', communityName: 'Comunidade 5', status: 'active' },
  { id: 'ct-5', name: 'Mariana Costa', phone: '+5531955554444', hasWhatsApp: true, tags: ['Free'], plan: 'Free', communityId: 'c-4', communityName: 'Comunidade 4', status: 'active' },
  { id: 'ct-6', name: 'Rodrigo Santos', phone: '+5511944443333', hasWhatsApp: true, tags: ['Ex-Membro'], plan: 'Free', communityId: null, communityName: null, status: 'left' },
  { id: 'ct-7', name: 'Juliana Oliveira', phone: '+5521933332222', hasWhatsApp: true, tags: ['Free'], plan: 'Free', communityId: null, communityName: null, status: 'left' }
]

export async function GET() {
  try {
    const res = await fetch(`${WACLI}/api/contacts`, { cache: 'no-store' })
    const list = await res.json()
    if (!list || list.length === 0) {
      return NextResponse.json(MOCK)
    }
    return NextResponse.json(list)
  } catch {
    return NextResponse.json(MOCK)
  }
}
export async function POST(req: Request) {
  const body = await req.json()
  try {
    const res = await fetch(`${WACLI}/api/contacts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    return NextResponse.json(await res.json(), { status: 201 })
  } catch {
    return NextResponse.json({ id: `ct-${Date.now()}`, ...body }, { status: 201 })
  }
}
