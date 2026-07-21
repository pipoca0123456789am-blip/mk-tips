/**
 * Lista tips via service role (diagnóstico).
 * Uso: node --env-file=.env.local scripts/count-tips.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing env')
  process.exit(1)
}

const admin = createClient(url, key, { auth: { persistSession: false } })
const client = createClient(url, anon || key, { auth: { persistSession: false } })

const { data: a, error: ae } = await admin.from('tips').select('id, match, status')
const { data: c, error: ce } = await client.from('tips').select('id, match, status')

console.log('admin count', a?.length ?? 0, ae?.message || 'ok')
console.log('anon count', c?.length ?? 0, ce?.message || 'ok')
if (a?.length) console.log(a.slice(0, 3).map((t) => `[${t.status}] ${t.match}`).join('\n'))
