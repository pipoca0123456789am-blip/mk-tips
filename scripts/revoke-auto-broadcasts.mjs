/**
 * Apaga mensagens de tips automáticas enviadas via wacli (revoke for everyone).
 * Uso: node scripts/revoke-auto-broadcasts.mjs
 */
import { execFileSync } from 'child_process'
import { createClient } from '@supabase/supabase-js'
import { join } from 'path'

const wacli =
  process.env.WACLI_BIN ||
  join(process.env.LOCALAPPDATA || '', 'wacli', 'wacli.exe')

const account = process.env.WACLI_ACCOUNT || 'me'

function wacliJson(args) {
  const out = execFileSync(wacli, ['--account', account, ...args, '--json'], {
    encoding: 'utf8',
    timeout: 120000,
  })
  return JSON.parse(out)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function isAutoTipMessage(m) {
  if (!m.FromMe || m.Revoked) return false
  const text = m.Text || m.Snippet || ''
  return (
    text.includes('MK Tips') &&
    (text.includes('Oportunidade') || text.includes('saa-s-sports-tips'))
  )
}

async function main() {
  console.log('Buscando mensagens automáticas no wacli...')
  let messages = []
  for (const q of ['Oportunidade', 'saa-s-sports-tips-three']) {
    try {
      const res = wacliJson(['messages', 'search', q, '--limit', '200'])
      messages.push(...(res.data?.messages || []))
    } catch (e) {
      console.warn(`Busca "${q}":`, e.message)
    }
  }

  const seen = new Set()
  const toRevoke = []
  for (const m of messages) {
    if (!isAutoTipMessage(m)) continue
    const key = `${m.ChatJID}|${m.MsgID}`
    if (seen.has(key)) continue
    seen.add(key)
    toRevoke.push(m)
  }

  console.log(`Revogando ${toRevoke.length} mensagem(ns)...`)
  let ok = 0
  let fail = 0
  for (const m of toRevoke) {
    try {
      execFileSync(
        wacli,
        [
          '--account',
          account,
          '--lock-wait',
          '30s',
          'messages',
          'revoke',
          '--chat',
          m.ChatJID,
          '--id',
          m.MsgID,
        ],
        { encoding: 'utf8', timeout: 60000 },
      )
      ok++
      console.log(`✓ ${m.ChatName || m.ChatJID} · ${m.MsgID.slice(0, 12)}…`)
      await sleep(800)
    } catch (e) {
      fail++
      console.error(`✗ ${m.ChatJID} ${m.MsgID}:`, e.stderr || e.message)
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url && key) {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await supabase
      .from('tips')
      .delete()
      .eq('status', 'Pendente')
      .eq('tipster_name', 'MK Tips')
      .contains('risk_indicators', ['Auto-import'])
      .select('id, match')

    if (error) {
      console.warn('Supabase:', error.message)
    } else {
      console.log(`Removidas ${data?.length || 0} tips Pendentes do painel.`)
    }
  }

  console.log(`Concluído: ${ok} revogadas, ${fail} falhas.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
