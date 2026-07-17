import { supabase, isSupabaseConfigured } from './supabase';

// =============================================
// VALE TUDO MÓDULO INTERFACES
// =============================================

export interface DBTournament {
  id: string;
  name: string;
  type: 'Diário' | 'Semanal' | 'Especial' | 'Copa' | 'Champions' | 'Brasileirão' | 'VIP' | 'Exclusivo';
  image: string;
  banner: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  entryFee: number;
  minParticipants: number;
  maxParticipants: number;
  totalPhases: number;
  totalWinners: number;
  status: 'Ativo' | 'Encerrado' | 'Cancelado';
  platformCutPercent: number; // ex: 20
  prizeDistribution: number[]; // ex: [60, 25, 15]
  adminFee: number; // valor fixo extra
  participantsCount: number;
  survivorsCount: number;
}

export interface DBTournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  userName: string;
  userNickname: string;
  status: 'Vivo' | 'Eliminado';
  currentPhase: number;
  joinedAt: string;
}

export interface DBTournamentPhase {
  id: string;
  tournamentId: string;
  phaseNumber: number;
  status: 'Pendente' | 'Encerrada';
  match: string;
  market: string;
  deadline: string;
  correctAnswer?: string; // ex: 'Casa', 'Empate', 'Visitante'
}

export interface DBParticipantPrediction {
  id: string;
  tournamentId: string;
  phaseId: string;
  userId: string;
  prediction: string; // 'Casa' | 'Empate' | 'Visitante'
  isCorrect?: boolean;
  submittedAt: string;
}
