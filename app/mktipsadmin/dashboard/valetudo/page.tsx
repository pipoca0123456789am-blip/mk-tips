'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db } from '@/lib/db'
import { 
  Trophy, 
  Users, 
  Plus, 
  Trash2, 
  Play, 
  Settings, 
  DollarSign, 
  Percent, 
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Copy,
  ChevronRight,
  TrendingUp,
  FileText,
  UserCheck
} from 'lucide-react'

export default function AdminValeTudoPage() {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [phases, setPhases] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  
  // Modal toggle state
  const [showAddTourModal, setShowAddTourModal] = useState(false)
  const [showAddPhaseModal, setShowAddPhaseModal] = useState(false)

  // Creation form state: Tournaments
  const [name, setName] = useState('')
  const [type, setType] = useState<'Diário' | 'Semanal' | 'Especial' | 'Copa' | 'Champions' | 'Brasileirão' | 'VIP' | 'Exclusivo'>('Brasileirão')
  const [image, setImage] = useState('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop')
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('2026-07-20')
  const [endDate, setEndDate] = useState('2026-08-10')
  const [startTime, setStartTime] = useState('19:00')
  const [entryFee, setEntryFee] = useState(50)
  const [minParticipants, setMinParticipants] = useState(10)
  const [maxParticipants, setMaxParticipants] = useState(500)
  const [totalPhases, setTotalPhases] = useState(5)
  const [totalWinners, setTotalWinners] = useState(3)
  const [platformCutPercent, setPlatformCutPercent] = useState(20)
  
  // Phase form state
  const [phaseTourId, setPhaseTourId] = useState('')
  const [phaseNumber, setPhaseNumber] = useState(1)
  const [phaseMatch, setPhaseMatch] = useState('')
  const [phaseMarket, setPhaseMarket] = useState('Vencedor do Encontro')
  const [phaseDeadline, setPhaseDeadline] = useState('2026-07-20T19:00')

  // Financial config states
  const [platformCutGlobal, setPlatformCutGlobal] = useState(20)
  const [prizeDistList, setPrizeDistList] = useState('60, 25, 15')
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    const loadData = () => {
      if (!db.isReady()) return
      setTournaments(db.getTournaments())
      setParticipants(db.getTournamentParticipants())
      setPhases(db.getTournamentPhases())
      setPredictions(db.getParticipantPredictions())
    }
    loadData()
    window.addEventListener('oddvault_db_update', loadData)
    return () => window.removeEventListener('oddvault_db_update', loadData)
  }, [])

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description) return

    const dist = prizeDistList.split(',').map(v => Number(v.trim()))

    const newTour = {
      id: `tour-${Date.now()}`,
      name,
      type,
      image,
      banner,
      description,
      startDate,
      endDate,
      startTime,
      entryFee,
      minParticipants,
      maxParticipants,
      totalPhases,
      totalWinners,
      status: 'Ativo',
      platformCutPercent: platformCutGlobal,
      prizeDistribution: dist,
      adminFee: 0,
      participantsCount: 0,
      survivorsCount: 0
    }

    const updated = [newTour, ...tournaments]
    setTournaments(updated)
    db.setTournaments(updated)
    
    // Reset form
    setName('')
    setDescription('')
    setShowAddTourModal(false)

    db.addLog('Audit', `Campeonato Vale Tudo "${newTour.name}" criado pelo admin.`, '189.120.45.10', 'MacBook Pro', 'Admin Master')
    setNotification('Campeonato criado com sucesso!')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCreatePhase = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phaseTourId || !phaseMatch) return

    const newPhase = {
      id: `phase-${Date.now()}`,
      tournamentId: phaseTourId,
      phaseNumber,
      status: 'Pendente',
      match: phaseMatch,
      market: phaseMarket,
      deadline: new Date(phaseDeadline).toISOString()
    }

    const updated = [...phases, newPhase]
    setPhases(updated)
    db.setTournamentPhases(updated)

    setPhaseMatch('')
    setShowAddPhaseModal(false)

    db.addLog('Audit', `Nova fase cadastrada para o torneio ${phaseTourId}.`, '189.120.45.10', 'MacBook Pro', 'Admin Master')
    setNotification('Nova fase/rodada adicionada com sucesso!')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleResolvePhase = (phaseId: string, result: 'Casa' | 'Empate' | 'Visitante') => {
    // 1. Resolve phase in database
    const updatedPhases = phases.map(p => {
      if (p.id === phaseId) {
        return { ...p, status: 'Encerrada', correctAnswer: result }
      }
      return p
    })
    setPhases(updatedPhases)
    db.setTournamentPhases(updatedPhases)

    // Find tournament ID
    const targetPhase = phases.find(p => p.id === phaseId)
    if (!targetPhase) return
    const tourId = targetPhase.tournamentId

    // 2. Validate predictions to eliminate or qualify users
    const phasePredictions = predictions.filter(pred => pred.phaseId === phaseId)
    const tourParticipants = participants.filter(part => part.tournamentId === tourId)

    const updatedParticipants = participants.map(part => {
      if (part.tournamentId === tourId && part.status === 'Vivo') {
        const userPred = phasePredictions.find(pred => pred.userId === part.userId)
        
        // If did not predict or prediction is wrong -> Eliminate
        if (!userPred || userPred.prediction !== result) {
          db.addLog('Audit', `Usuário @${part.userNickname} eliminado do campeonato ${tourId}`, '189.120.45.10', 'System', 'Admin Master')
          return { ...part, status: 'Eliminado' }
        } else {
          // Qualification
          return { ...part, currentPhase: part.currentPhase + 1 }
        }
      }
      return part
    })

    setParticipants(updatedParticipants)
    db.setTournamentParticipants(updatedParticipants)

    // Recalculate survivors
    const aliveCount = updatedParticipants.filter(p => p.tournamentId === tourId && p.status === 'Vivo').length
    const updatedTournaments = tournaments.map(t => {
      if (t.id === tourId) {
        return {
          ...t,
          survivorsCount: aliveCount
        }
      }
      return t
    })

    setTournaments(updatedTournaments)
    db.setTournaments(updatedTournaments)

    setNotification(`Resultados publicados! Fase ${targetPhase.phaseNumber} resolvida.`)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDuplicateTournament = (tourId: string) => {
    const orig = tournaments.find(t => t.id === tourId)
    if (!orig) return

    const duplicated = {
      ...orig,
      id: `tour-${Date.now()}`,
      name: `${orig.name} (Cópia)`,
      participantsCount: 0,
      survivorsCount: 0,
      status: 'Ativo'
    }

    const updated = [duplicated, ...tournaments]
    setTournaments(updated)
    db.setTournaments(updated)

    setNotification('Campeonato duplicado com sucesso!')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleCancelTournament = (tourId: string) => {
    const updated = tournaments.map(t => {
      if (t.id === tourId) {
        return { ...t, status: 'Cancelado' }
      }
      return t
    })
    setTournaments(updated)
    db.setTournaments(updated)

    setNotification('Campeonato cancelado.')
    setTimeout(() => setNotification(null), 3000)
  }

  // Dashboard Stats Calculations
  const activeTournaments = tournaments.filter(t => t.status === 'Ativo').length
  const totalRevenue = tournaments.reduce((acc, t) => acc + (t.participantsCount * t.entryFee), 0)
  const totalProfit = tournaments.reduce((acc, t) => acc + (t.participantsCount * t.entryFee * (t.platformCutPercent / 100)), 0)
  const totalInscritos = tournaments.reduce((acc, t) => acc + t.participantsCount, 0)
  const totalSurvivors = tournaments.reduce((acc, t) => acc + t.survivorsCount, 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-zinc-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Gerenciamento Vale Tudo
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">Admin Panel</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Crie campeonatos, gerencie as rodadas de palpites e publique resultados oficiais para eliminar os eliminados.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja zerar TODOS os dados do Vale Tudo, faturamento, lucros, carteiras e transações? Esta ação é irreversível.')) {
                // Clear Vale Tudo
                localStorage.removeItem('mktips_tournaments')
                localStorage.removeItem('mktips_tournament_participants')
                localStorage.removeItem('mktips_tournament_phases')
                localStorage.removeItem('mktips_participant_predictions')

                // Clear Wallets, Transactions, and Withdrawals
                localStorage.removeItem('mktips_withdrawals')
                const users = db.getUsers()
                users.forEach(u => {
                  localStorage.removeItem(`mktips_wallet_${u.id}`)
                  localStorage.removeItem(`mktips_transactions_${u.id}`)
                })

                // Reset DB hooks
                db.setTournaments([])
                db.setTournamentParticipants([])
                db.setTournamentPhases([])
                db.setWithdrawalRequests([])
                
                setTournaments([])
                setParticipants([])
                setPhases([])
                setPredictions([])
                setNotification('Todos os dados, faturamento e carteiras do Vale Tudo foram zerados!')
                setTimeout(() => setNotification(null), 4000)
              }
            }}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-200 border border-red-900/60 font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Zerar Tudo
          </button>
          <button
            onClick={() => setShowAddTourModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Novo Campeonato
          </button>
          <button
            onClick={() => {
              if (tournaments.length === 0) {
                alert('Crie um campeonato antes de adicionar fases.')
                return
              }
              setPhaseTourId(tournaments[0].id)
              setShowAddPhaseModal(true)
            }}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded text-xs transition-colors cursor-pointer border border-zinc-800 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Nova Fase/Rodada
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
          <UserCheck className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin dashboard stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-zinc-950 border-zinc-900 p-4">
          <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Campeonatos Ativos</span>
          <strong className="text-xl font-extrabold text-white mt-1 block">{activeTournaments}</strong>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 p-4">
          <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Receita Bruta Pool</span>
          <strong className="text-xl font-extrabold text-emerald-400 mt-1 block">R$ {totalRevenue.toFixed(2)}</strong>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 p-4">
          <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Lucro Plataforma</span>
          <strong className="text-xl font-extrabold text-white mt-1 block">R$ {totalProfit.toFixed(2)}</strong>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 p-4">
          <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Total Inscritos</span>
          <strong className="text-xl font-extrabold text-white mt-1 block">{totalInscritos}</strong>
        </Card>
        <Card className="bg-zinc-950 border-zinc-900 p-4">
          <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Total Vivos</span>
          <strong className="text-xl font-extrabold text-emerald-400 mt-1 block">{totalSurvivors}</strong>
        </Card>
      </div>

      {/* Financial Config Section */}
      <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-emerald-500" />
          Configuração Financeira Global do Vale Tudo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-2">Porcentagem Retida da Plataforma (%)</label>
            <input 
              type="number" 
              value={platformCutGlobal}
              onChange={e => setPlatformCutGlobal(Number(e.target.value))}
              className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
            />
          </div>
          <div>
            <label className="block text-zinc-400 mb-2">Distribuição de Premiação (Separada por vírgulas, ex: 1º, 2º, 3º)</label>
            <input 
              type="text" 
              value={prizeDistList}
              onChange={e => setPrizeDistList(e.target.value)}
              className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
            />
          </div>
        </div>
      </Card>

      {/* Main content grid: tournaments list */}
      <div className="space-y-6">
        <h3 className="text-base font-extrabold text-white">🏆 Campeonatos Cadastrados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map(tour => {
            const tourPhases = phases.filter(p => p.tournamentId === tour.id)
            const poolValue = tour.participantsCount * tour.entryFee
            const prizeValue = poolValue * (1 - tour.platformCutPercent / 100)

            return (
              <Card key={tour.id} className="bg-zinc-950 border-zinc-850 p-5 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[9px] font-bold rounded uppercase tracking-wider text-zinc-400">{tour.type}</span>
                    <h4 className="text-base font-bold text-white mt-2">{tour.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                    tour.status === 'Ativo' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {tour.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px] bg-zinc-900/40 p-3 rounded border border-zinc-900">
                  <div>
                    <span className="text-zinc-550 block">Inscrição</span>
                    <strong className="text-white mt-0.5 block">R$ {tour.entryFee}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-550 block">Pool Total</span>
                    <strong className="text-white mt-0.5 block">R$ {poolValue}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-550 block">Líquido Prêmio</span>
                    <strong className="text-emerald-400 mt-0.5 block">R$ {prizeValue}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-550 block">Vivos / Inscritos</span>
                    <strong className="text-white mt-0.5 block">{tour.survivorsCount} / {tour.participantsCount}</strong>
                  </div>
                </div>

                {/* Sub-phases management inside tournament cards */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Fases da Competição</span>
                  {tourPhases.length === 0 ? (
                    <span className="text-[10px] text-zinc-500 block">Nenhuma fase configurada.</span>
                  ) : (
                    <div className="space-y-2">
                      {tourPhases.map(phase => (
                        <div key={phase.id} className="p-2 bg-zinc-900 rounded border border-zinc-850 flex justify-between items-center text-[10px]">
                          <div>
                            <strong className="text-white">Fase {phase.phaseNumber}</strong>: {phase.match}
                          </div>
                          <div>
                            {phase.status === 'Pendente' ? (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleResolvePhase(phase.id, 'Casa')}
                                  className="px-1.5 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded"
                                >
                                  Casa Wins
                                </button>
                                <button
                                  onClick={() => handleResolvePhase(phase.id, 'Empate')}
                                  className="px-1.5 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded"
                                >
                                  Empate Wins
                                </button>
                                <button
                                  onClick={() => handleResolvePhase(phase.id, 'Visitante')}
                                  className="px-1.5 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded"
                                >
                                  Visit. Wins
                                </button>
                              </div>
                            ) : (
                              <span className="text-zinc-500 font-bold">Encerrada: {phase.correctAnswer}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-zinc-900">
                  <button
                    onClick={() => handleDuplicateTournament(tour.id)}
                    className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded text-[10px] transition-colors border border-zinc-800"
                  >
                    Duplicar
                  </button>
                  <button
                    onClick={() => handleCancelTournament(tour.id)}
                    className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-red-400 font-bold rounded text-[10px] transition-colors border border-zinc-800"
                  >
                    Cancelar
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Add Tournament Modal */}
      {showAddTourModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg bg-zinc-950 border-zinc-800 text-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">Criar Campeonato Vale Tudo</CardTitle>
              <CardDescription>Configure as regras, prazos e pool de premiações para a competição premium.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateTournament}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Nome do Campeonato</label>
                    <input 
                      type="text" 
                      required
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      placeholder="E.g. Brasileirão Especial" 
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Tipo de Campeonato</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                    >
                      <option value="Brasileirão">Brasileirão</option>
                      <option value="Champions">Champions League</option>
                      <option value="Copa">Copa do Mundo</option>
                      <option value="Diário">Diário</option>
                      <option value="Semanal">Semanal</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Descrição</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Regras de participação..." 
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Inscrição (R$)</label>
                    <input 
                      type="number" 
                      value={entryFee} 
                      onChange={e => setEntryFee(Number(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Qtd de Fases</label>
                    <input 
                      type="number" 
                      value={totalPhases} 
                      onChange={e => setTotalPhases(Number(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Vencedores</label>
                    <input 
                      type="number" 
                      value={totalWinners} 
                      onChange={e => setTotalWinners(Number(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Data Início</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Data Fim</label>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Horário Limite</label>
                    <input 
                      type="text" 
                      value={startTime} 
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setShowAddTourModal(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded"
                  >
                    Criar Campeonato
                  </button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}

      {/* Add Phase Modal */}
      {showAddPhaseModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">Cadastrar Nova Fase/Rodada</CardTitle>
              <CardDescription>Cadastre as bets e os eventos de palpite para cada fase eliminatória.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreatePhase}>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Selecione o Campeonato</label>
                  <select
                    value={phaseTourId}
                    onChange={e => setPhaseTourId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                  >
                    {tournaments.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Etapa/Fase (Número)</label>
                    <input 
                      type="number" 
                      value={phaseNumber} 
                      onChange={e => setPhaseNumber(Number(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Mercado Esportivo</label>
                    <input 
                      type="text" 
                      value={phaseMarket} 
                      onChange={e => setPhaseMarket(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Partida / Evento</label>
                  <input 
                    type="text" 
                    required
                    value={phaseMatch} 
                    onChange={e => setPhaseMatch(e.target.value)}
                    placeholder="E.g. Barcelona vs PSG" 
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Prazo Envio (Data e Hora)</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={phaseDeadline} 
                    onChange={e => setPhaseDeadline(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white" 
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setShowAddPhaseModal(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded"
                  >
                    Salvar Fase
                  </button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
