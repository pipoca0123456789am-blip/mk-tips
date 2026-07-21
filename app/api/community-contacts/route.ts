import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { loadContactsFromStorage, mapRowsToContacts } from '@/lib/community-contacts-store'

export async function GET() {
  const admin = getSupabaseAdmin()
  if (!admin) {
    return NextResponse.json({ ok: false, contacts: [], error: 'Supabase não configurado.' }, { status: 500 })
  }

  let rows = await loadContactsFromStorage(admin)

  if (rows.length === 0) {
    const { data, error } = await admin
      .from('community_contacts')
      .select('*')
      .order('community_name', { ascending: true })
      .order('phone', { ascending: true })

    if (!error && data?.length) {
      rows = data.map((row) => ({
        phone: row.phone,
        display_name: row.display_name,
        whatsapp_jid: row.whatsapp_jid,
        community_jid: row.community_jid,
        community_name: row.community_name,
        is_admin: row.is_admin,
        synced_at: row.synced_at,
      }))
    }
  }

  const contacts = mapRowsToContacts(rows)
  const uniquePhones = new Set(contacts.map((c) => c.phone))

  return NextResponse.json({
    ok: true,
    contacts,
    total: contacts.length,
    uniquePhones: uniquePhones.size,
    source: rows.length ? (contacts.length ? 'storage-or-table' : 'empty') : 'empty',
  })
}
