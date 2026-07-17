import { NextResponse } from 'next/server'
const WACLI = process.env.WACLI_BASE_URL ?? 'http://localhost:3333'
const MOCK = [
  { id: 'g-1', name: '⚽ Tips Futebol VIP', photo: null, membersCount: 412, communityId: 'c-1', communityName: 'VIP Anual MK Tips', description: 'Tips exclusivas de futebol' },
  { id: 'g-2', name: '🏀 Tips Basquete', photo: null, membersCount: 198, communityId: 'c-1', communityName: 'VIP Anual MK Tips', description: 'Tips de NBA e NBB' },
  { id: 'g-3', name: '🎾 Tips Tênis', photo: null, membersCount: 156, communityId: 'c-2', communityName: 'Starter MK Tips', description: 'ATP e WTA' },
  { id: 'g-4', name: '📊 Gestão de Banca', photo: null, membersCount: 634, communityId: 'c-3', communityName: 'Free Trial MK Tips', description: 'Educação financeira' },
]
export async function GET() {
  try {
    const res = await fetch(`${WACLI}/api/groups`, { cache: 'no-store' })
    return NextResponse.json(await res.json())
  } catch { return NextResponse.json([]) }
}
