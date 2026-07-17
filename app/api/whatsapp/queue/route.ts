import { NextResponse } from 'next/server'

let QUEUE: any[] = []

export async function GET() {
  return NextResponse.json(QUEUE)
}

export async function POST(req: Request) {
  const body = await req.json()
  
  if (body.action === 'push') {
    const newItem = {
      id: `q-${Date.now()}`,
      campaignId: body.campaignId || `camp-${Date.now()}`,
      campaignName: body.campaignName || 'Nova Tip',
      total: body.total || 120,
      sent: 0,
      failed: 0,
      status: 'running',
      ratePerMin: 60,
      startedAt: new Date().toISOString(),
      estimatedEnd: new Date(Date.now() + 120000).toISOString()
    }
    QUEUE.unshift(newItem)
    
    // Simulate progression
    const interval = setInterval(() => {
      const idx = QUEUE.findIndex(q => q.id === newItem.id)
      if (idx === -1) {
        clearInterval(interval)
        return
      }
      const item = QUEUE[idx]
      if (item.sent >= item.total) {
        item.status = 'done'
        item.estimatedEnd = new Date().toISOString()
        clearInterval(interval)
      } else {
        const batch = Math.min(15, item.total - item.sent)
        item.sent += batch
        item.failed += Math.random() > 0.95 ? 1 : 0
      }
    }, 2500)

    return NextResponse.json(newItem)
  }

  if (body.action === 'delete') {
    QUEUE = QUEUE.filter(q => q.id !== body.id)
    return NextResponse.json({ ok: true })
  }

  const { id, action } = body
  return NextResponse.json({ ok: true, id, action })
}
