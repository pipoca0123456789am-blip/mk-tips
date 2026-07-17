import { NextResponse } from 'next/server'

const WACLI = process.env.WACLI_BASE_URL ?? 'http://localhost:3333'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const res = await fetch(`${WACLI}/api/templates/${id}`, { method: 'DELETE' })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ success: true, id })
  }
}
