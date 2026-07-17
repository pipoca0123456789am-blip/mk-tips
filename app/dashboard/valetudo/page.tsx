'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db } from '@/lib/db'
import { 
  Trophy, 
  Users, 
  Timer, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle, 
  Calendar, 
  Eye, 
  EyeOff, 
  UserCheck, 
  FileText,
  Search,
  Lock,
  Compass,
  ListTodo,
  TrendingUp,
  History,
  Grid
} from 'lucide-react'

import { useRouter } from 'next/navigation'

type TournamentTab = 'campeonatos' | 'meus' | 'ranking' | 'historico' | 'premiacoes' | 'regras' | 'faq'

export default function UserValeTudoPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TournamentTab>('campeonatos')
  const [tournaments, setTournaments] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [phases, setPhases] = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [activeUser, setActiveUser] = useState<any>(null)
  
  // Selection state for detail view
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null)
  const [selectedPrediction, setSelectedPrediction] = useState<{ [phaseId: string]: string }>({})
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    const loadData = () => {
      if (!db.isReady()) return
      setTournaments(db.getTournaments())
      setParticipants(db.getTournamentParticipants())
      setPhases(db.getTournamentPhases())
      setPredictions(db.getParticipantPredictions())
      setActiveUser(db.getActiveUser())
    }
    loadData()
    window.addEventListener('oddvault_db_update', loadData)
    return () => window.removeEventListener('oddvault_db_update', loadData)
  }, [])

  const handleJoinTournament = (tourId: string) => {
    if (!activeUser) return
    const tour = tournaments.find(t => t.id === tourId)
    if (!tour) return

    // Create participant entry
    const isAlreadyJoined = participants.some(p => p.tournamentId === tourId && p.userId === activeUser.id)
    if (isAlreadyJoined) {
      setNotification('Você já está inscrito neste campeonato!')
      return
    }

    // Wallet Balance Check
    const userWallet = db.getWallet(activeUser.id)
    if (userWallet.available < tour.entryFee) {
      alert(`Saldo insuficiente! Você precisa de R$ ${tour.entryFee.toFixed(2)}, mas possui apenas R$ ${userWallet.available.toFixed(2)}. Vá em Minha Carteira para adicionar saldo.`)
      router.push('/dashboard/wallet')
      return
    }

    // Deduct from wallet
    const updatedWallet = {
      ...userWallet,
      available: userWallet.available - tour.entryFee,
      totalBet: userWallet.totalBet + tour.entryFee
    }
    db.setWallet(activeUser.id, updatedWallet)

    // Add to ledger transactions
    const walletTxs = db.getWalletTransactions(activeUser.id)
    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'Inscrição',
      amount: -tour.entryFee,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString().slice(0, 5),
      status: 'Aprovado',
      txId: `TX-TOUR-${tourId.slice(-4)}-${Date.now().toString().slice(-4)}`
    }
    db.setWalletTransactions(activeUser.id, [newTx, ...walletTxs])

    const newParticipant = {
      id: `part-${Date.now()}`,
      tournamentId: tourId,
      userId: activeUser.id,
      userName: activeUser.name,
      userNickname: activeUser.name.toLowerCase().replace(/\s+/g, '_'),
      status: 'Vivo',
      currentPhase: 1,
      joinedAt: new Date().toISOString()
    }

    // Log payment audit
    db.addLog('Payment', `Inscrição no campeonato ${tour.name} debitada da carteira: R$ ${tour.entryFee.toFixed(2)}`, '127.0.0.1', 'Web App', activeUser.name)

    // Update counts
    const updatedTournaments = tournaments.map(t => {
      if (t.id === tourId) {
        return {
          ...t,
          participantsCount: t.participantsCount + 1,
          survivorsCount: t.survivorsCount + 1
        }
      }
      return t
    })

    const updatedParticipants = [...participants, newParticipant]
    
    db.setTournaments(updatedTournaments)
    db.setTournamentParticipants(updatedParticipants)
    
    setNotification('Inscrição realizada com sucesso! Saldo debitado de sua carteira.')
    setTimeout(() => setNotification(null), 4000)
  }

  const handleSendPrediction = (phaseId: string, tourId: string, choice: string) => {
    if (!activeUser) return
    
    // Check if user is registered and Alive
    const userPart = participants.find(p => p.tournamentId === tourId && p.userId === activeUser.id)
    if (!userPart || userPart.status !== 'Vivo') {
      alert('Apenas participantes vivos inscritos podem enviar palpites.')
      return
    }

    const phase = phases.find(p => p.id === phaseId)
    if (!phase) return

    // Save prediction
    const updatedPredictions = predictions.filter(pred => !(pred.phaseId === phaseId && pred.userId === activeUser.id))
    const newPrediction = {
      id: `pred-${Date.now()}`,
      tournamentId: tourId,
      phaseId,
      userId: activeUser.id,
      prediction: choice,
      submittedAt: new Date().toISOString()
    }

    const finalPredictions = [...updatedPredictions, newPrediction]
    db.setParticipantPredictions(finalPredictions)
    setPredictions(finalPredictions)

    // Log action
    db.addLog('Auth', `Palpite enviado para a fase ${phase.phaseNumber} de ${tourId}: ${choice}`, '127.0.0.1', 'Web App', activeUser.name)

    setSelectedPrediction(prev => ({ ...prev, [phaseId]: choice }))
    setNotification('Palpite registrado com sucesso!')
    setTimeout(() => setNotification(null), 3000)
  }

  const activeTour = tournaments.find(t => t.id === selectedTourId)
  const activeTourPhases = phases.filter(p => p.tournamentId === selectedTourId)
  const userJoinedTournaments = tournaments.filter(t => participants.some(p => p.tournamentId === t.id && p.userId === activeUser?.id))

  if (activeUser?.plan === 'Free') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-emerald-500" />
            Torneios Vale Tudo
          </h1>
          <p className="text-sm text-zinc-400">Entre em torneios de sobrevivência, dê palpites certeiros e dispute prêmios reais.</p>
        </div>

        <Card className="border-zinc-850 bg-zinc-950/80 p-8 text-center space-y-6 max-w-2xl mx-auto border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Torneio Vale Tudo Bloqueado!</h2>
          <p className="text-zinc-400 leading-relaxed text-xs max-w-md mx-auto">
            A participação nos torneios de sobrevivência Vale Tudo com prêmios acumulados em dinheiro real é exclusiva para membros com planos ativos (Starter, Premium ou VIP).
          </p>
          <a
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Fazer Upgrade do Plano
          </a>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-zinc-300">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            🏆 VALE TUDO
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase animate-pulse">PREMIUM ELIMINATOR</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Previsões esportivas em formato eliminatório Battle Royale. Sobreviva até a última fase e dispute o acumulado!</p>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs Submenu */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-zinc-900 z-10 relative">
        {([
          { id: 'campeonatos', label: 'Campeonatos' },
          { id: 'meus', label: 'Meus Campeonatos' },
          { id: 'ranking', label: 'Ranking Geral' },
          { id: 'historico', label: 'Histórico' },
          { id: 'premiacoes', label: 'Premiações' },
          { id: 'regras', label: 'Regras' },
          { id: 'faq', label: 'FAQ' }
        ] as { id: TournamentTab; label: string }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setSelectedTourId(null)
            }}
            className={`px-4 py-2.5 rounded-t-lg font-bold text-xs transition-all cursor-pointer shrink-0 border-b-2 -mb-[2px] ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Campeonatos Tab */}
      {activeTab === 'campeonatos' && !selectedTourId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {tournaments.map(tour => {
            const isJoined = participants.some(p => p.tournamentId === tour.id && p.userId === activeUser?.id)
            const poolValue = tour.participantsCount * tour.entryFee
            const prizeValue = poolValue * (1 - tour.platformCutPercent / 100)

            return (
              <Card key={tour.id} className="border-zinc-850 bg-zinc-950 overflow-hidden flex flex-col hover:border-zinc-800 transition-all duration-300 group">
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/90 text-black text-[9px] font-black rounded uppercase tracking-wider">
                    {tour.type}
                  </span>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{tour.name}</h2>
                    <p className="text-zinc-400 text-[11px] mt-1.5 line-clamp-2">{tour.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-[10px]">
                    <div className="p-2 bg-zinc-900/60 rounded border border-zinc-900">
                      <span className="text-zinc-500 block">Inscrição</span>
                      <strong className="text-white text-xs block mt-0.5">R$ {tour.entryFee.toFixed(2)}</strong>
                    </div>
                    <div className="p-2 bg-zinc-900/60 rounded border border-zinc-900">
                      <span className="text-zinc-500 block">Prêmio Estimado</span>
                      <strong className="text-emerald-400 text-xs block mt-0.5">R$ {prizeValue.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                    <span>👥 {tour.participantsCount} Inscritos</span>
                    <span>⏱️ Início: {new Date(tour.startDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTourId(tour.id)}
                      className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 text-white font-bold rounded text-xs transition-colors cursor-pointer border border-zinc-800"
                    >
                      Ver Detalhes
                    </button>
                    {!isJoined ? (
                      <button
                        onClick={() => handleJoinTournament(tour.id)}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded text-xs transition-colors cursor-pointer"
                      >
                        Participar
                      </button>
                    ) : (
                      <span className="flex-1 flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-bold">
                        Inscrito ✓
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Selected Tournament Detail View */}
      {selectedTourId && activeTour && (
        <div className="space-y-6 animate-fade-in">
          {/* Back button */}
          <button 
            onClick={() => setSelectedTourId(null)}
            className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Voltar para campeonatos
          </button>

          {/* Banner */}
          <div className="relative h-64 rounded-xl overflow-hidden bg-zinc-900">
            <img src={activeTour.banner} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-black rounded uppercase tracking-wider block w-max mb-2">
                {activeTour.type}
              </span>
              <h2 className="text-2xl font-black text-white">{activeTour.name}</h2>
              <p className="text-xs text-zinc-300 max-w-2xl mt-1.5">{activeTour.description}</p>
            </div>
          </div>

          {/* Stats details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-950 border-zinc-900 p-4">
              <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Pool de Prêmios</span>
              <strong className="text-xl font-extrabold text-emerald-400 mt-1 block">
                R$ {(activeTour.participantsCount * activeTour.entryFee * (1 - activeTour.platformCutPercent / 100)).toFixed(2)}
              </strong>
              <span className="text-[9px] text-zinc-500 mt-0.5 block">Pool Bruto: R$ {(activeTour.participantsCount * activeTour.entryFee).toFixed(2)}</span>
            </Card>

            <Card className="bg-zinc-950 border-zinc-900 p-4">
              <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Participantes</span>
              <strong className="text-xl font-extrabold text-white mt-1 block">{activeTour.participantsCount}</strong>
              <span className="text-[9px] text-zinc-500 mt-0.5 block">Máximo: {activeTour.maxParticipants}</span>
            </Card>

            <Card className="bg-zinc-950 border-zinc-900 p-4">
              <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Fases Totais</span>
              <strong className="text-xl font-extrabold text-white mt-1 block">{activeTour.totalPhases}</strong>
              <span className="text-[9px] text-zinc-500 mt-0.5 block">1 Previsão por fase</span>
            </Card>

            <Card className="bg-zinc-950 border-zinc-900 p-4">
              <span className="text-[10px] text-zinc-550 block font-bold uppercase tracking-wider">Sobreviventes</span>
              <strong className="text-xl font-extrabold text-emerald-400 mt-1 block">{activeTour.survivorsCount}</strong>
              <span className="text-[9px] text-zinc-500 mt-0.5 block">Taxa de Sobrevivência: {((activeTour.survivorsCount / (activeTour.participantsCount || 1)) * 100).toFixed(0)}%</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Play Predictions section */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-extrabold text-white">🎯 Previsões das Fases</h3>
              
              {activeTourPhases.length === 0 ? (
                <div className="p-8 bg-zinc-950 rounded-lg border border-zinc-900 text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-xs text-zinc-400">Nenhuma rodada configurada para este campeonato ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTourPhases.map((phase) => {
                    const existingPred = predictions.find(p => p.phaseId === phase.id && p.userId === activeUser?.id);
                    const userPart = participants.find(p => p.tournamentId === selectedTourId && p.userId === activeUser?.id);
                    const isAlive = userPart && userPart.status === 'Vivo';

                    return (
                      <Card key={phase.id} className="bg-zinc-950 border-zinc-900 p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[9px] font-bold border border-zinc-700">
                              FASE {phase.phaseNumber}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-2">{phase.match}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">Mercado: {phase.market}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-zinc-550 block font-semibold">Limite Envio</span>
                            <span className="text-xs text-white block mt-0.5">{new Date(phase.deadline).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="mt-4 pt-4 border-t border-zinc-900/60">
                          {phase.status === 'Encerrada' ? (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-zinc-500">Rodada finalizada. Resultado Oficial: <strong className="text-white">{phase.correctAnswer}</strong></span>
                              {existingPred && (
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${existingPred.prediction === phase.correctAnswer ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                  Seu Palpite: {existingPred.prediction} ({existingPred.prediction === phase.correctAnswer ? 'Green' : 'Red'})
                                </span>
                              )}
                            </div>
                          ) : isAlive ? (
                            <div className="space-y-3">
                              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Escolha sua Previsão:</span>
                              <div className="grid grid-cols-3 gap-2">
                                {['Casa', 'Empate', 'Visitante'].map(opt => {
                                  const isSelected = selectedPrediction[phase.id] === opt || existingPred?.prediction === opt
                                  return (
                                    <button
                                      key={opt}
                                      onClick={() => handleSendPrediction(phase.id, selectedTourId!, opt)}
                                      className={`py-2 px-4 rounded text-xs font-bold border transition-all cursor-pointer ${
                                        isSelected 
                                          ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-white'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded flex items-center gap-2 text-red-400/80 text-[11px]">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Você precisa estar inscrito e VIVO no campeonato para enviar previsões.</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Side stats / Battle royale view */}
            <div className="space-y-6">
              <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Grid className="w-4 h-4 text-emerald-500" />
                  Battle Royale Stats
                </h3>

                <div className="space-y-3 text-[11px]">
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span className="text-zinc-500">Participantes Vivos</span>
                    <strong className="text-white">{activeTour.survivorsCount}</strong>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span className="text-zinc-500">Participantes Eliminados</span>
                    <strong className="text-red-400">{activeTour.participantsCount - activeTour.survivorsCount}</strong>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span className="text-zinc-500">Taxa de Sobrevivência</span>
                    <strong className="text-emerald-400">{((activeTour.survivorsCount / (activeTour.participantsCount || 1)) * 100).toFixed(0)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Fases Concluídas</span>
                    <strong className="text-white">{phases.filter(p => p.tournamentId === selectedTourId && p.status === 'Encerrada').length} / {activeTour.totalPhases}</strong>
                  </div>
                </div>
              </Card>

              {/* Participants list */}
              <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4">
                <h3 className="text-sm font-extrabold text-white">👥 Participantes</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {participants.filter(p => p.tournamentId === selectedTourId).map(part => (
                    <div key={part.id} className="flex justify-between items-center text-xs">
                      <span>@{part.userNickname}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        part.status === 'Vivo' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {part.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* 2. Meus Campeonatos */}
      {activeTab === 'meus' && (
        <div className="space-y-6 animate-fade-in">
          {userJoinedTournaments.length === 0 ? (
            <div className="p-12 bg-zinc-950 rounded-lg border border-zinc-900 text-center">
              <Compass className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Você não participa de nenhum campeonato</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1.5">Inscreva-se em um dos campeonatos disponíveis na aba "Campeonatos" para começar a jogar.</p>
              <button 
                onClick={() => setActiveTab('campeonatos')}
                className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Ver Campeonatos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userJoinedTournaments.map(tour => {
                const userPart = participants.find(p => p.tournamentId === tour.id && p.userId === activeUser?.id);
                return (
                  <Card key={tour.id} className="bg-zinc-950 border-zinc-850 p-5 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-0.5 bg-zinc-850 text-zinc-400 border border-zinc-800 text-[9px] font-bold rounded uppercase tracking-wider">{tour.type}</span>
                        <h3 className="text-base font-bold text-white mt-2">{tour.name}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        userPart?.status === 'Vivo' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        Você está: {userPart?.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] bg-zinc-900/40 p-3 rounded border border-zinc-900">
                      <div>
                        <span className="text-zinc-550 block">Inscrição</span>
                        <strong className="text-white mt-0.5 block">R$ {tour.entryFee.toFixed(2)}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-550 block">Sua Fase</span>
                        <strong className="text-white mt-0.5 block">Fase {userPart?.currentPhase}</strong>
                      </div>
                      <div>
                        <span className="text-zinc-550 block">Vivos / Total</span>
                        <strong className="text-emerald-400 mt-0.5 block">{tour.survivorsCount} / {tour.participantsCount}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTourId(tour.id)}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded text-xs transition-colors cursor-pointer"
                    >
                      Palpitar & Acompanhar
                    </button>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Ranking */}
      {activeTab === 'ranking' && (
        <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-white">Ranking Geral de Sobreviventes</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Sobreviventes ordenados por sequência e quantidade total de previsões corretas.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500">
                  <th className="py-2.5 font-bold">Posição</th>
                  <th className="py-2.5 font-bold">Nickname</th>
                  <th className="py-2.5 font-bold">Campeonato</th>
                  <th className="py-2.5 font-bold">Status</th>
                  <th className="py-2.5 font-bold text-right">Acertos</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { rank: 1, nick: '@lucas_green', tour: 'Vale Tudo Brasileirão Premium', status: 'Vivo', hits: 4 },
                  { rank: 2, nick: '@henrique_blume', tour: 'Vale Tudo Brasileirão Premium', status: 'Vivo', hits: 3 },
                  { rank: 3, nick: '@matheus_tips', tour: 'Champions League Eliminator VIP', status: 'Vivo', hits: 3 },
                  { rank: 4, nick: '@rodrigo_bet', tour: 'Vale Tudo Brasileirão Premium', status: 'Eliminado', hits: 2 },
                  { rank: 5, nick: '@felipe_odds', tour: 'Champions League Eliminator VIP', status: 'Eliminado', hits: 1 }
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-zinc-900/60 hover:bg-zinc-900/25">
                    <td className="py-3 font-bold text-zinc-400">#{item.rank}</td>
                    <td className="py-3 font-bold text-white">{item.nick}</td>
                    <td className="py-3 text-zinc-500">{item.tour}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        item.status === 'Vivo' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-extrabold text-[#00E08A]">{item.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 4. Histórico */}
      {activeTab === 'historico' && (
        <Card className="bg-zinc-950 border-zinc-900 p-5 space-y-4 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-white">Seu Histórico de Competições</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Seu registro completo de participações, palpites e resultados.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-zinc-900/40 rounded border border-zinc-900 flex justify-between items-center text-xs">
              <div>
                <strong className="text-white text-sm block">Vale Tudo Brasileirão Premium</strong>
                <span className="text-zinc-500 mt-1 block">Inscrição: R$ 50,00 • Status: Em Andamento</span>
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">
                Fase 1 Superada ✓
              </span>
            </div>
            <div className="p-4 bg-zinc-900/40 rounded border border-zinc-900 flex justify-between items-center text-xs">
              <div>
                <strong className="text-white text-sm block">Copa do Mundo Simulado Cup</strong>
                <span className="text-zinc-500 mt-1 block">Inscrição: R$ 20,00 • Finalizado em Junho</span>
              </div>
              <span className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold">
                Eliminado na Fase 3 ✗
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* 5. Premiações */}
      {activeTab === 'premiacoes' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="bg-zinc-950 border-zinc-900 p-6 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Como as Premiações são Distribuidas?
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400">
              Cada campeonato do Vale Tudo arrecada inscrições que são somadas a um <strong>Pool de Premiação</strong>. A plataforma desconta de 10% a 20% da taxa operacional (conforme regras do torneio) e o restante do saldo arrecadado é dividido 100% entre os sobreviventes vencedores!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-zinc-900/50 rounded border border-zinc-850">
                <span className="text-xs font-bold text-zinc-400 block mb-1">🥇 1º Lugar</span>
                <p className="text-2xl font-black text-emerald-400">60%</p>
                <span className="text-[10px] text-zinc-550 mt-1 block">Da premiação líquida total</span>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded border border-zinc-850">
                <span className="text-xs font-bold text-zinc-400 block mb-1">🥈 2º Lugar</span>
                <p className="text-2xl font-black text-white">25%</p>
                <span className="text-[10px] text-zinc-550 mt-1 block">Da premiação líquida total</span>
              </div>
              <div className="p-4 bg-zinc-900/50 rounded border border-zinc-850">
                <span className="text-xs font-bold text-zinc-400 block mb-1">🥉 3º Lugar</span>
                <p className="text-2xl font-black text-zinc-400">15%</p>
                <span className="text-[10px] text-zinc-550 mt-1 block">Da premiação líquida total</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 6. Regras */}
      {activeTab === 'regras' && (
        <Card className="bg-zinc-950 border-zinc-900 p-6 space-y-4 animate-fade-in text-xs leading-relaxed">
          <h2 className="text-base font-bold text-white">Regulamento Oficial do Vale Tudo</h2>
          <div className="space-y-3 text-zinc-400">
            <p>1. <strong>Participação:</strong> Qualquer usuário logado com saldo suficiente ou assinatura ativa pode se inscrever pagando a taxa descrita no card.</p>
            <p>2. <strong>Envio de Previsões:</strong> O participante deve enviar seu palpite de 1X2 antes do horário limite estipulado em cada fase.</p>
            <p>3. <strong>Mecânica Eliminatória:</strong> Caso o participante acerte o palpite do evento, ele avança para a próxima fase. Se errar, é desclassificado/eliminado imediatamente.</p>
            <p>4. <strong>Privacidade:</strong> Os palpites de outros usuários só são revelados após o encerramento oficial da rodada/evento.</p>
            <p>5. <strong>Premiação:</strong> Disputada entre os sobreviventes que restarem após a última fase do campeonato.</p>
          </div>
        </Card>
      )}

      {/* 7. FAQ */}
      {activeTab === 'faq' && (
        <Card className="bg-zinc-950 border-zinc-900 p-6 space-y-4 animate-fade-in">
          <h2 className="text-base font-bold text-white">Perguntas Frequentes (FAQ)</h2>
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-white mb-1">E se o jogo for cancelado ou adiado?</h4>
              <p className="text-zinc-400">Em caso de jogos adiados por mais de 36 horas, a fase correspondente será anulada ("Void") e todos os participantes sobreviventes daquela fase avançam automaticamente.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Como retiro meu prêmio?</h4>
              <p className="text-zinc-400">Os prêmios são depositados automaticamente na sua carteira de banca da plataforma MK Tips em até 24 horas úteis pós-término do campeonato.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
