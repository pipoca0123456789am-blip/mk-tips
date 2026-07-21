/**
 * Pipeline automático no PC:
 * 1) Importa jogos futuros → tips Pendentes (Supabase)
 * 2) Dispara mensagem via wacli nas comunidades/alvos
 *
 * Uso:
 *   node --env-file=.env.local scripts/auto-pipeline.mjs
 *   node --env-file=.env.local scripts/auto-pipeline.mjs --dry-run
 *
 * Pré-requisitos:
 *   - wacli instalado e autenticado (scripts/setup-wacli-windows.ps1)
 *   - config/auto-pipeline.json com targets (nome do grupo ou JID)
 */
import { createClient } from '@supabase/supabase-js'
import { execFileSync, spawnSync } from 'child_process'
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const configPath = join(root, 'config', 'auto-pipeline.json')
const statePath = join(root, 'config', '.auto-pipeline-state.json')

const dryRun = process.argv.includes('--dry-run')

function loadConfig() {
  const raw = JSON.parse(readFileSync(configPath, 'utf8'))
  if (dryRun) raw.dryRun = true
  return raw
}

function loadState() {
  if (!existsSync(statePath)) return { sentTipIds: [] }
  try {
    return JSON.parse(readFileSync(statePath, 'utf8'))
  } catch {
    return { sentTipIds: [] }
  }
}

function saveState(state) {
  mkdirSync(dirname(statePath), { recursive: true })
  writeFileSync(statePath, JSON.stringify(state, null, 2))
}

function findWacli() {
  const candidates = [
    process.env.WACLI_BIN,
    join(process.env.LOCALAPPDATA || '', 'wacli', 'wacli.exe'),
    join(process.env.USERPROFILE || '', 'bin', 'wacli.exe'),
    'wacli',
    'wacli.exe',
  ].filter(Boolean)

  for (const bin of candidates) {
    try {
      const r = spawnSync(bin, ['version', '--json'], { encoding: 'utf8', timeout: 8000 })
      if (r.status === 0 || (r.stdout || '').includes('version') || (r.stdout || r.stderr || '').length > 0) {
        // even if version flag differs, binary exists
      }
      const which = spawnSync(bin, ['--help'], { encoding: 'utf8', timeout: 8000 })
      if (which.status === 0 || (which.stdout || which.stderr || '').toLowerCase().includes('wacli')) {
        return bin
      }
    } catch {
      /* try next */
    }
  }
  return null
}

async function fetchNextEvents(leagues) {
  const events = []
  for (const league of leagues) {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=${league.id}`,
    )
    if (!res.ok) continue
    const data = await res.json()
    for (const ev of data.events || []) {
      if (ev.strSport && ev.strSport !== 'Soccer') continue
      events.push(ev)
    }
  }
  events.sort((a, b) =>
    String(a.strTimestamp || a.dateEvent).localeCompare(String(b.strTimestamp || b.dateEvent)),
  )
  return events
}

function formatMessage(tip, appUrl) {
  const when = new Date(tip.datetime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return [
    '🔥 *MK Tips — Oportunidade*',
    '',
    `⚽ ${tip.league}`,
    `*${tip.match}*`,
    `📅 ${when}`,
    `📊 ${tip.market} · ${tip.type}`,
    ` Odd *${Number(tip.odd).toFixed(2)}* · ${tip.recommended_bookmaker || tip.recommendedBookmaker || 'Betano'}`,
    '',
    `👉 ${appUrl}`,
  ].join('\n')
}

function sendViaWacli(wacliBin, account, to, message, dry) {
  if (dry) {
    console.log(`[dry-run] wacli send → ${to}`)
    console.log(message)
    console.log('---')
    return true
  }
  const args = ['send', 'text', '--to', to, '--message', message]
  if (account) args.unshift('--account', account)
  try {
    execFileSync(wacliBin, args, { encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'] })
    console.log(`✓ enviado: ${to}`)
    return true
  } catch (e) {
    console.error(`✗ falha ${to}:`, e.stderr || e.message)
    return false
  }
}

async function main() {
  const cfg = loadConfig()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const state = loadState()
  const sent = new Set(state.sentTipIds || [])

  console.log('1) Buscando jogos futuros...')
  const events = await fetchNextEvents(cfg.leagues || [])
  console.log(`   ${events.length} jogos encontrados`)

  const { data: pending } = await supabase.from('tips').select('match, datetime').eq('status', 'Pendente')
  const existingKeys = new Set(
    (pending || []).map((t) => `${String(t.match).toLowerCase()}|${String(t.datetime).slice(0, 16)}`),
  )

  const tipsToInsert = []
  for (const ev of events) {
    if (tipsToInsert.length >= (cfg.maxTipsPerRun || 8)) break
    const home = ev.strHomeTeam
    const away = ev.strAwayTeam
    if (!home || !away) continue
    const match = `${home} vs ${away}`
    const datetime = ev.strTimestamp
      ? new Date(ev.strTimestamp).toISOString()
      : `${ev.dateEvent}T${ev.strTime || '15:00:00'}Z`
    const key = `${match.toLowerCase()}|${datetime.slice(0, 16)}`
    if (existingKeys.has(key)) continue
    existingKeys.add(key)

    const odd = Number(cfg.defaultOdd) || 1.85
    const confidence = 7
    tipsToInsert.push({
      id: randomUUID(),
      sport: 'Futebol',
      league: ev.strLeague || 'Futebol',
      match,
      datetime,
      market: 'Resultado Final (1X2)',
      type: 'Casa vence',
      odd,
      stake: Number((confidence / 3).toFixed(1)),
      confidence,
      recommended_bookmaker: cfg.bookmaker || 'Betano',
      affiliate_url: 'https://www.betano.com',
      tipster_id: null,
      tipster_name: 'MK Tips',
      justification: `Oportunidade automática · ${home} x ${away}.`,
      risk_indicators: ['Auto-import', 'Revisar odd com a casa'],
      estimated_probability: Math.min(80, Math.floor(95 / odd)),
      ev: Number((odd * 0.52 - 1).toFixed(2)),
      views: 0,
      favorites_count: 0,
      status: 'Pendente',
      odds_comparison: [
        { bookmaker: cfg.bookmaker || 'Betano', odd },
        { bookmaker: 'Bet365', odd: Number((odd - 0.05).toFixed(2)) },
      ],
    })
  }

  let inserted = []
  if (tipsToInsert.length === 0) {
    console.log('2) Nenhuma tip nova para inserir (já existem ou sem jogos).')
  } else if (cfg.dryRun) {
    console.log(`2) [dry-run] inseriria ${tipsToInsert.length} tips:`)
    tipsToInsert.forEach((t) => console.log(`   - ${t.match} · ${t.datetime}`))
    inserted = tipsToInsert
  } else {
    const { data, error } = await supabase.from('tips').insert(tipsToInsert).select('*')
    if (error) {
      console.error('Erro insert:', error.message)
      process.exit(1)
    }
    inserted = data || []
    console.log(`2) Inseridas ${inserted.length} tips Pendentes.`)
  }

  // Também pega tips pendentes recentes ainda não enviadas
  const { data: toBroadcast } = await supabase
    .from('tips')
    .select('*')
    .eq('status', 'Pendente')
    .order('created_at', { ascending: false })
    .limit(cfg.maxTipsPerRun || 8)

  const tipsForSend = (toBroadcast || []).filter((t) => !sent.has(t.id))
  if (tipsForSend.length === 0 && inserted.length === 0) {
    console.log('3) Nada para enviar no WhatsApp.')
    return
  }

  const queue = tipsForSend.length ? tipsForSend : inserted
  console.log(`3) Disparando ${queue.length} tip(s) via wacli...`)

  const wacli = findWacli()
  if (!wacli && !cfg.dryRun) {
    console.error('wacli não encontrado. Rode: powershell -File scripts/setup-wacli-windows.ps1')
    console.error('Depois: wacli --account me auth')
    process.exit(1)
  }

  const targets = cfg.targets || []
  if (targets.length === 0) {
    console.error('Configure "targets" em config/auto-pipeline.json (nome do grupo ou JID).')
    process.exit(1)
  }

  for (const tip of queue) {
    const msg = formatMessage(
      {
        ...tip,
        recommended_bookmaker: tip.recommended_bookmaker,
      },
      cfg.appUrl,
    )
    let okAll = true
    for (const to of targets) {
      const ok = sendViaWacli(wacli || 'wacli', cfg.account || 'me', to, msg, cfg.dryRun)
      if (!ok) okAll = false
      // leve intervalo anti-spam
      if (!cfg.dryRun) await new Promise((r) => setTimeout(r, 1500))
    }
    if (okAll || cfg.dryRun) sent.add(tip.id)
  }

  if (!cfg.dryRun) {
    saveState({ sentTipIds: [...sent].slice(-200), updatedAt: new Date().toISOString() })
  }
  console.log('Pronto.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
