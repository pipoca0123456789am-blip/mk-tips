import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, step, twoFactorCode } = await req.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const admin2fa = process.env.ADMIN_2FA_CODE || ''

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { ok: false, error: 'Admin não configurado no servidor.' },
        { status: 500 },
      )
    }

    if (step === 'login') {
      if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
        password !== adminPassword
      ) {
        return NextResponse.json({ ok: false, error: 'Credenciais incorretas.' }, { status: 401 })
      }
      return NextResponse.json({ ok: true, next: '2fa' })
    }

    if (step === '2fa') {
      const code = String(twoFactorCode || '')
      if (admin2fa) {
        if (code !== admin2fa) {
          return NextResponse.json({ ok: false, error: 'Código 2FA inválido.' }, { status: 401 })
        }
      } else if (!/^\d{6}$/.test(code)) {
        return NextResponse.json({ ok: false, error: 'Código 2FA inválido.' }, { status: 401 })
      }
      return NextResponse.json({ ok: true, next: 'dashboard' })
    }

    return NextResponse.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro interno.' }, { status: 500 })
  }
}
