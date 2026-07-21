/**
 * Sincroniza participantes de cada comunidade/grupo via wacli (SEM enviar mensagens).
 * Uso: node --env-file=.env.local scripts/sync-community-contacts.mjs
 */
import { execFileSync } from 'child_process'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const BUCKET = 'mktips-private'
const OBJECT_PATH = 'community-contacts.json'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const configPath = join(root, 'config', 'auto-pipeline.json')

const wacli =
  process.env.WACLI_BIN ||
  join(process.env.LOCALAPPDATA || '', 'wacli', 'wacli.exe')
const account = process.env.WACLI_ACCOUNT || 'me'

function loadTargets() {
  const cfg = JSON.parse(readFileSync(configPath, 'utf8'))
  return cfg.targets || []
}

function groupInfo(jid) {
  const out = execFileSync(
    wacli,
    ['--account', account, '--lock-wait', '45s', 'groups', 'info', '--jid', jid, '--json'],
    { encoding: 'utf8', timeout: 180000 },
  )
  const parsed = JSON.parse(out)
  return parsed.data || parsed
}

function phoneFromParticipant(p) {
  const raw = p.PhoneNumber || p.JID || ''
  const num = String(raw).split('@')[0].replace(/\D/g, '')
  if (!num) return ''
  return num.startsWith('55') ? `+${num}` : `+${num}`
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function ensureBucket(supabase) {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = (buckets || []).some((b) => b.name === BUCKET)
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: false })
    if (error && !/already exists/i.test(error.message)) throw error
  }
}

async function saveRows(supabase, rows, syncedAt) {
  await ensureBucket(supabase)
  const payload = JSON.stringify({ syncedAt, rows })
  const { error } = await supabase.storage.from(BUCKET).upload(OBJECT_PATH, payload, {
    contentType: 'application/json',
    upsert: true,
  })
  if (error) throw error

  const exportDir = join(root, 'config')
  mkdirSync(exportDir, { recursive: true })
  writeFileSync(join(exportDir, 'community-contacts-export.json'), payload, 'utf8')
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Faltam variáveis Supabase no .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const targets = loadTargets()
  if (targets.length === 0) {
    console.error('Nenhum target em config/auto-pipeline.json')
    process.exit(1)
  }

  console.log(`Comunidades/grupos a varrer: ${targets.length} (somente leitura, sem mensagens)`)

  const rows = []
  const syncedAt = new Date().toISOString()

  for (const jid of targets) {
    console.log(`→ ${jid}`)
    try {
      const info = groupInfo(jid)
      const name = info.Name || jid
      const participants = info.Participants || []
      console.log(`   ${name}: ${participants.length} participantes`)

      for (const p of participants) {
        const phone = phoneFromParticipant(p)
        if (!phone || phone.length < 10) continue
        rows.push({
          phone,
          display_name: (p.DisplayName || '').trim(),
          whatsapp_jid: p.PhoneNumber || p.JID || '',
          community_jid: jid,
          community_name: name,
          is_admin: Boolean(p.IsAdmin || p.IsSuperAdmin),
          synced_at: syncedAt,
        })
      }
      await sleep(1200)
    } catch (e) {
      console.error(`   erro:`, e.stderr?.toString() || e.message)
    }
  }

  if (rows.length === 0) {
    console.log('Nenhum contato coletado.')
    process.exit(0)
  }

  try {
    await saveRows(supabase, rows, syncedAt)
  } catch (e) {
    console.error('Erro ao salvar no Supabase Storage:', e.message)
    process.exit(1)
  }

  // Opcional: tabela SQL (se existir)
  const { error: tableProbe } = await supabase.from('community_contacts').select('id').limit(1)
  if (!tableProbe) {
    const batchSize = 200
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      await supabase.from('community_contacts').upsert(batch, { onConflict: 'phone,community_jid' })
    }
    console.log('Também sincronizado na tabela community_contacts.')
  }

  const uniquePhones = new Set(rows.map((r) => r.phone))
  console.log(`Salvos ${rows.length} vínculos (${uniquePhones.size} números únicos) no Storage.`)
  console.log('Veja em: Admin → CRM WhatsApp → Contatos → Atualizar lista')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
