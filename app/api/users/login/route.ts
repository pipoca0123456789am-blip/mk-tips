import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const normalized = String(email || '').trim().toLowerCase()
    const pass = String(password || '')
    if (!normalized || !pass) {
      return NextResponse.json({ ok: false, error: 'E-mail e senha obrigatórios.' }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return NextResponse.json({ ok: false, error: 'Banco não configurado.' }, { status: 500 })
    }

    const { data: user, error } = await admin
      .from('users')
      .select('*')
      .eq('email', normalized)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
    if (!user) {
      return NextResponse.json({ ok: false, error: 'E-mail ou senha incorretos.' }, { status: 401 })
    }

    if (['Master', 'Admin', 'Gerente'].includes(user.role)) {
      return NextResponse.json(
        { ok: false, error: 'Use o painel administrativo para esta conta.' },
        { status: 403 },
      )
    }

    const { data: cred } = await admin
      .from('user_credentials')
      .select('password')
      .eq('email', normalized)
      .maybeSingle()

    if (cred?.password) {
      if (cred.password !== pass) {
        return NextResponse.json({ ok: false, error: 'E-mail ou senha incorretos.' }, { status: 401 })
      }
    } else {
      // No server password yet — allow only if client will handle local creds
      return NextResponse.json({ ok: false, error: 'NO_SERVER_PASSWORD', user }, { status: 404 })
    }

    return NextResponse.json({ ok: true, user })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Erro no login.' }, { status: 500 })
  }
}
