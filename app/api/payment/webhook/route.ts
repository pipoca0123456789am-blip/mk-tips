import { NextResponse } from 'next/server'

/**
 * Webhook endpoint for Velana payment gateway.
 * Called automatically by Velana when a PIX payment status changes (e.g., paid, expired, refunded).
 * 
 * Expected payload from Velana:
 * {
 *   "id": "transaction_id",
 *   "status": "paid" | "pending" | "expired" | "refunded",
 *   "amount": 5000,  // in cents
 *   "paidAt": "2026-07-16T22:00:00Z",
 *   "customer": { "email": "...", "name": "..." },
 *   ...
 * }
 */

// In-memory store for confirmed transactions (in production, use a database)
// This is shared with the status-check endpoint via a global Map
declare global {
  var velanaConfirmedPayments: Map<string, { status: string; amount: number; paidAt: string }>
}

if (!global.velanaConfirmedPayments) {
  global.velanaConfirmedPayments = new Map()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('[Velana Webhook] Received:', JSON.stringify(body, null, 2))

    const transactionId = body.id || body.transactionId || body.transaction_id
    const status = body.status || body.event || ''
    const amount = body.amount || 0
    const paidAt = body.paidAt || body.paid_at || new Date().toISOString()

    if (!transactionId) {
      console.warn('[Velana Webhook] Missing transaction ID')
      return NextResponse.json({ received: false, error: 'Missing transaction ID' }, { status: 400 })
    }

    // Store the confirmed payment
    if (status === 'paid' || status === 'approved' || status === 'completed') {
      global.velanaConfirmedPayments.set(transactionId, {
        status: 'paid',
        amount: typeof amount === 'number' ? amount / 100 : 0,
        paidAt
      })
      console.log(`[Velana Webhook] Payment ${transactionId} marked as PAID`)
    } else if (status === 'expired' || status === 'cancelled' || status === 'refunded') {
      global.velanaConfirmedPayments.set(transactionId, {
        status,
        amount: typeof amount === 'number' ? amount / 100 : 0,
        paidAt
      })
      console.log(`[Velana Webhook] Payment ${transactionId} marked as ${status.toUpperCase()}`)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true, transactionId, status })
  } catch (err: any) {
    console.error('[Velana Webhook] Error:', err)
    return NextResponse.json({ received: false, error: err.message }, { status: 500 })
  }
}

// GET endpoint for the frontend to check if a webhook confirmation arrived
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ confirmed: false, error: 'Missing transaction ID' }, { status: 400 })
  }

  const payment = global.velanaConfirmedPayments.get(id)
  if (payment && payment.status === 'paid') {
    // Remove from map after consumption (one-time read)
    global.velanaConfirmedPayments.delete(id)
    return NextResponse.json({ confirmed: true, status: 'paid', amount: payment.amount, paidAt: payment.paidAt })
  }

  return NextResponse.json({ confirmed: false, status: payment?.status || 'pending' })
}
