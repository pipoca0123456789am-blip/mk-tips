import { NextResponse } from 'next/server'

const WACLI = process.env.WACLI_BASE_URL ?? 'http://localhost:3333'

const MOCK = [
  { id: 'c-1', name: 'Comunidade 1', description: 'Grupo VIP de Tips Oficiais', link: 'https://chat.whatsapp.com/BsAWncJpdS8BYKOG84P56c', membersCount: 1248, status: 'active', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'c-3', name: 'Comunidade 3', description: 'Grupo Gratuito de Tips Diárias', link: 'https://chat.whatsapp.com/D8o95E6iJEL9eOEEdAlo5f', membersCount: 894, status: 'active', createdAt: '2026-02-15T10:00:00Z' },
  { id: 'c-4', name: 'Comunidade 4', description: 'Grupo Gratuito Alerta de Odds', link: 'https://chat.whatsapp.com/KOfP5HGorFIBLEtNOWh54O', membersCount: 1543, status: 'active', createdAt: '2026-03-01T10:00:00Z' },
  { id: 'c-5', name: 'Comunidade 5', description: 'Grupo VIP Alavancagem e Sinais', link: 'https://chat.whatsapp.com/HNlHK88CPYZ8YqDrpXAEKS', membersCount: 652, status: 'active', createdAt: '2026-03-10T10:00:00Z' },
  { id: 'c-6', name: 'Comunidade 6', description: 'Grupo Geral Vale Tudo Bet', link: 'https://chat.whatsapp.com/BmverNAh6lQCs5wDMyl2kv', membersCount: 2311, status: 'active', createdAt: '2026-03-15T10:00:00Z' },
  { id: 'c-7', name: 'Comunidade 7', description: 'Grupo Geral Novidades e Bônus', link: 'https://chat.whatsapp.com/KWSeX7GLdEz6uy71jwxHLH', membersCount: 1105, status: 'active', createdAt: '2026-03-20T10:00:00Z' },
]

export async function GET() {
  try {
    const res = await fetch(`${WACLI}/api/communities`, { cache: 'no-store' })
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
    const res = await fetch(`${WACLI}/api/communities/import`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ imported: 3 }, { status: 200 })
  }
}
