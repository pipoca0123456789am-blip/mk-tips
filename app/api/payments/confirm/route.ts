import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

/**
 * Confirma pagamento e atualiza faturamento do usuário no Supabase.
 * Usado após PIX/cartão aprovados para refletir no painel admin.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    const name = String(body.name || '').trim()
    const amount = Number(body.amount) || 0
    const plan = body.plan ? String(body.plan) : null
    const productType = String(body.productType || 'plan')
    const transactionId = body.transactionId ? String(body.transactionId) : null
    const phone = String(body.phone || '')
    const cpf = String(body.cpf || '')

    if (!email || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: 'E-mail e valor são obrigatórios.' },
        { status: 400 },
      )
    }

    const admin = getSupabaseAdmin()
    if (!admin) {
      return NextResponse.json(
        { ok: false, error: 'Banco não configurado (SUPABASE_SERVICE_ROLE_KEY).' },
        { status: 500 },
      )
    }

    const allowedPlans = ['Free', 'Starter', 'Premium', 'VIP Anual']
    const resolvedPlan =
      plan && allowedPlans.includes(plan)
        ? plan
        : plan?.toLowerCase().includes('vip')
          ? 'VIP Anual'
          : plan?.toLowerCase().includes('starter')
            ? 'Starter'
            : plan?.toLowerCase().includes('premium')
              ? 'Premium'
              : null

    const { data: existing, error: findErr } = await admin
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (findErr) {
      return NextResponse.json({ ok: false, error: findErr.message }, { status: 500 })
    }

    const now = new Date().toISOString()
    let user = existing

    if (!user) {
      const id = crypto.randomUUID()
      const insertRow: Record<string, unknown> = {
        id,
        name: name || email.split('@')[0],
        email,
        phone,
        cpf,
        city: '',
        country: 'Brasil',
        language: 'pt-BR',
        plan: productType === 'plan' && resolvedPlan ? resolvedPlan : 'Free',
        role: 'User',
        status: 'Ativo',
        created_at: now,
        last_login: now,
        last_login_ip: '0.0.0.0',
        device: 'Web App',
        os: '',
        browser: '',
        days_remaining:
          productType === 'plan' && resolvedPlan === 'VIP Anual'
            ? 365
            : productType === 'plan'
              ? 30
              : 7,
        revenue_generated: amount,
        total_paid: amount,
        last_payment_date: now,
        bankroll: 0,
        bankroll_currency: 'R$',
        roi_individual: 0,
      }

      const { data: created, error: createErr } = await admin
        .from('users')
        .insert(insertRow)
        .select('*')
        .single()

      if (createErr) {
        return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 })
      }
      user = created
    } else {
      const patch: Record<string, unknown> = {
        total_paid: Number(user.total_paid || 0) + amount,
        revenue_generated: Number(user.revenue_generated || 0) + amount,
        last_payment_date: now,
        last_login: now,
      }

      if (productType === 'plan' && resolvedPlan) {
        patch.plan = resolvedPlan
        patch.days_remaining = resolvedPlan === 'VIP Anual' ? 365 : 30
        patch.status = 'Ativo'
      }

      if (name) patch.name = name
      if (phone) patch.phone = phone
      if (cpf) patch.cpf = cpf

      const { data: updated, error: updateErr } = await admin
        .from('users')
        .update(patch)
        .eq('id', user.id)
        .select('*')
        .single()

      if (updateErr) {
        return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 })
      }
      user = updated
    }

    // Best-effort payment log table (optional — ignore if table missing)
    const { error: payLogErr } = await admin.from('payments').insert({
      id: crypto.randomUUID(),
      user_id: user.id,
      email,
      amount,
      plan: resolvedPlan || productType,
      product_type: productType,
      transaction_id: transactionId,
      status: 'paid',
      created_at: now,
    })
    if (payLogErr) {
      console.warn('payments log skipped:', payLogErr.message)
    }

    return NextResponse.json({ ok: true, user })
  } catch (e: any) {
    console.error('payment confirm error:', e)
    return NextResponse.json({ ok: false, error: e?.message || 'Erro ao confirmar pagamento.' }, { status: 500 })
  }
}
