import { NextResponse } from 'next/server'
const WACLI = process.env.WACLI_BASE_URL ?? 'http://localhost:3333'

/** Envio real só com WHATSAPP_SEND_ENABLED=true (ativar quando for anunciar nas comunidades). */
export async function POST(req: Request) {
  if (process.env.WHATSAPP_SEND_ENABLED !== 'true') {
    return NextResponse.json(
      { ok: false, disabled: true, error: 'Envio WhatsApp desligado. Ative quando for anunciar nas comunidades.' },
      { status: 403 },
    )
  }
  const body = await req.json()
  try {
    const res = await fetch(`${WACLI}/api/messages/send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ ok: false, error: 'WACLI indisponível.' }, { status: 503 })
  }
}
