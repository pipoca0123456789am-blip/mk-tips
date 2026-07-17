'use client';

import { useState, useEffect, useCallback } from 'react';
import { db, DBUser, DBTip, DBTipster, DBLog, DBAuditLog, DBTicket } from './db';

// Generic hook for async data fetching with auto-refresh on db events
export function useDbQuery<T>(fetcher: () => Promise<T>, deps: any[] = []): { data: T | null; loading: boolean; refresh: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      console.error('useDbQuery error:', e);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
    window.addEventListener('oddvault_db_update', load);
    return () => window.removeEventListener('oddvault_db_update', load);
  }, [load]);

  return { data, loading, refresh: load };
}

// Specific hooks for common queries
export function useUsers() {
  return useDbQuery(() => db.getUsers());
}

export function useActiveUser() {
  return useDbQuery(() => db.getActiveUser());
}

export function useTipsters() {
  return useDbQuery(() => db.getTipsters());
}

export function useTips(period?: string) {
  return useDbQuery(() => db.getTips(period), [period]);
}

export function useLogs(period?: string) {
  return useDbQuery(() => db.getLogs(period), [period]);
}

export function useAuditLogs(period?: string) {
  return useDbQuery(() => db.getAuditLogs(period), [period]);
}

export function useTickets() {
  return useDbQuery(() => db.getTickets());
}

export function useFavorites(userId?: string) {
  return useDbQuery(() => db.getFavorites(userId), [userId]);
}

export function useBankrollLogs(userId?: string) {
  return useDbQuery(() => db.getBankrollLogs(userId), [userId]);
}

export function useReferrals(userId?: string) {
  return useDbQuery(() => db.getReferrals(userId), [userId]);
}

export function useChallengeStages() {
  return useDbQuery(() => db.getChallengeStages());
}
