import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    sessionsOnline: 1,
    sentToday: 1284,
    deliveredToday: 1261,
    failedToday: 23,
    communities: 3,
    groups: 4,
    participants: 5563,
    campaigns: 7,
    deliveryRate: 98.2,
    readRate: 71.4,
    conversions: 48,
  })
}
