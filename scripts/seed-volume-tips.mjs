/**
 * Preenche tips históricas (volume) a partir de jogos reais já finalizados.
 * Uso: node --env-file=.env.local scripts/seed-volume-tips.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const LEAGUES = [
  { id: '4328', name: 'Premier League', season: '2025-2026' },
  { id: '4335', name: 'La Liga', season: '2025-2026' },
  { id: '4332', name: 'Serie A', season: '2025-2026' },
  { id: '4331', name: 'Bundesliga', season: '2025-2026' },
]

async function fetchPast(leagueId, season) {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=${leagueId}&s=${season}`,
  )
  if (!res.ok) throw new Error(`HTTP ${res.status} league ${leagueId}`)
  const data = await res.json()
  return Array.isArray(data.events) ? data.events : []
}

function buildTip(event, status) {
  const home = event.strHomeTeam
  const away = event.strAwayTeam
  const hs = Number(event.intHomeScore)
  const as = Number(event.intAwayScore)
  const homeWon = hs > as
  const draw = hs === as

  // Mercado 1X2 alinhado ao resultado real (Green) ou invertido (Red)
  let type
  if (status === 'Green') {
    type = draw ? 'Empate' : homeWon ? 'Casa vence' : 'Fora vence'
  } else {
    type = draw ? 'Casa vence' : homeWon ? 'Fora vence' : 'Casa vence'
  }

  const odd =
    status === 'Green'
      ? Number((1.65 + Math.random() * 0.55).toFixed(2))
      : Number((1.9 + Math.random() * 0.7).toFixed(2))

  const confidence = status === 'Green' ? 7 + Math.floor(Math.random() * 3) : 5 + Math.floor(Math.random() * 2)
  const datetime = event.strTimestamp
    ? new Date(event.strTimestamp).toISOString()
    : `${event.dateEvent}T${event.strTime || '15:00:00'}Z`

  return {
    id: randomUUID(),
    sport: 'Futebol',
    league: event.strLeague || 'Futebol',
    match: `${home} vs ${away}`,
    datetime,
    market: 'Resultado Final (1X2)',
    type,
    odd,
    stake: Number((confidence / 3).toFixed(1)),
    confidence,
    recommended_bookmaker: 'Betano',
    affiliate_url: 'https://www.betano.com',
    tipster_id: null,
    tipster_name: 'MK Tips',
    justification: `Análise pré-jogo · placar final ${hs}x${as}.`,
    risk_indicators: ['Mercado de volume histórico'],
    estimated_probability: Math.min(85, Math.floor(95 / odd)),
    ev: Number((odd * 0.55 - 1).toFixed(2)),
    views: 40 + Math.floor(Math.random() * 200),
    favorites_count: 3 + Math.floor(Math.random() * 25),
    status,
    odds_comparison: [
      { bookmaker: 'Betano', odd },
      { bookmaker: 'Bet365', odd: Number((odd - 0.05).toFixed(2)) },
      { bookmaker: 'Stake', odd: Number((odd - 0.02).toFixed(2)) },
    ],
  }
}

async function main() {
  // Remove seed anterior deste script (mesmo tipster_name + market)
  await supabase
    .from('tips')
    .delete()
    .eq('tipster_name', 'MK Tips')
    .contains('risk_indicators', ['Mercado de volume histórico'])

  const all = []
  for (const league of LEAGUES) {
    try {
      const events = await fetchPast(league.id, league.season)
      all.push(...events)
      console.log(`${league.name}: ${events.length} jogos`)
    } catch (e) {
      console.warn(`Falha ${league.name}:`, e.message)
    }
  }

  const finished = all
    .filter(
      (e) =>
        e.strStatus === 'FT' &&
        e.intHomeScore != null &&
        e.intAwayScore != null &&
        e.strSport === 'Soccer',
    )
    .sort((a, b) => String(b.dateEvent).localeCompare(String(a.dateEvent)))

  // unique by idEvent
  const seen = new Set()
  const unique = []
  for (const e of finished) {
    if (seen.has(e.idEvent)) continue
    seen.add(e.idEvent)
    unique.push(e)
  }

  const picked = unique.slice(0, 15)
  if (picked.length < 15) {
    console.warn(`Só achei ${picked.length} jogos finalizados.`)
  }

  // 2 reds nos índices 4 e 11 (resto green)
  const redIndexes = new Set([4, 11].filter((i) => i < picked.length))
  const tips = picked.map((e, i) => buildTip(e, redIndexes.has(i) ? 'Red' : 'Green'))

  const { data, error } = await supabase.from('tips').insert(tips).select('id, match, status, datetime')

  if (error) {
    console.error('Erro ao inserir:', error.message)
    process.exit(1)
  }

  console.log(`Inseridas ${data.length} tips:`)
  for (const t of data) {
    console.log(`  [${t.status}] ${t.match} · ${t.datetime}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
