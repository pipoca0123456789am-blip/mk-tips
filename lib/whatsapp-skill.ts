// ============================================================
// lib/whatsapp-skill.ts
// Skill/API Layer — único ponto de integração com o WACLI.
// O SaaS NUNCA chama o OpenClaw WACLI diretamente.
// Toda comunicação ocorre via /api/whatsapp/*.
// ============================================================

const BASE = '/api/whatsapp'

// ─── Types ───────────────────────────────────────────────────

export type SessionStatus = 'online' | 'offline' | 'reconnecting' | 'qr_pending' | 'error'

export interface WASession {
  id: string
  name: string
  number: string
  photo?: string
  status: SessionStatus
  lastConnected: string
  device: string
  uptime: string
  sentCount: number
  receivedCount: number
}

export interface WACommunity {
  id: string
  name: string
  description: string
  photo?: string
  membersCount: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface WAGroup {
  id: string
  name: string
  photo?: string
  membersCount: number
  communityId?: string
  communityName?: string
  description?: string
}

export interface WAContact {
  id: string
  name: string
  phone: string
  hasWhatsApp: boolean
  tags: string[]
  plan?: string
  tipster?: string
  origin?: string
}

export interface WAMessage {
  id: string
  to: string
  toName: string
  message: string
  sessionId: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  sentAt: string
  deliveredAt?: string
}

export interface WAQueueItem {
  id: string
  campaignId: string
  campaignName: string
  total: number
  sent: number
  failed: number
  status: 'running' | 'paused' | 'done' | 'error'
  ratePerMin: number
  startedAt: string
  estimatedEnd: string
}

export interface WACampaign {
  id: string
  name: string
  audienceType: 'communities' | 'groups' | 'contacts' | 'segmented'
  audienceIds: string[]
  message: string
  mediaUrl?: string
  scheduledAt?: string
  status: 'draft' | 'scheduled' | 'running' | 'done' | 'paused'
  sentCount: number
  deliveredCount: number
  failedCount: number
  createdAt: string
}

export interface WAAutomation {
  id: string
  name: string
  trigger: 'new_tip' | 'new_leverage' | 'valetudo' | 'popup' | 'payment_approved' | 'cancellation' | 'upgrade'
  templateId: string
  sessionId: string
  targetType: 'communities' | 'groups' | 'contacts'
  targetIds: string[]
  active: boolean
  lastFired?: string
  firedCount: number
}

export interface WATemplate {
  id: string
  name: string
  content: string
  mediaUrl?: string
  variables: string[]
  createdAt: string
}

export interface WALog {
  id: string
  sessionId: string
  sessionName: string
  action: string
  target: string
  status: 'success' | 'failed'
  duration: number
  timestamp: string
}

export interface WADashboardStats {
  sessionsOnline: number
  sentToday: number
  deliveredToday: number
  failedToday: number
  communities: number
  groups: number
  participants: number
  campaigns: number
  deliveryRate: number
  readRate: number
  conversions: number
}

// ─── API Helpers ─────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`WhatsApp Skill: ${res.status} ${path}`)
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`WhatsApp Skill: ${res.status} ${path}`)
  return res.json()
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`WhatsApp Skill: ${res.status} ${path}`)
  return res.json()
}

// ─── Sessions ────────────────────────────────────────────────

export const waSessions = {
  list: () => get<WASession[]>('/sessions'),
  create: (name: string) => post<WASession>('/sessions', { name }),
  delete: (id: string) => del<{ ok: boolean }>(`/sessions/${id}`),
  getQrCode: (id: string) => get<{ qrcode: string; expired: boolean }>(`/sessions/${id}/qrcode`),
}

// ─── Communities ─────────────────────────────────────────────

export const waCommunities = {
  list: () => get<WACommunity[]>('/communities'),
  import: (sessionId: string) => post<{ imported: number }>('/communities/import', { sessionId }),
}

// ─── Groups ──────────────────────────────────────────────────

export const waGroups = {
  list: () => get<WAGroup[]>('/groups'),
  import: (sessionId: string) => post<{ imported: number }>('/groups/import', { sessionId }),
}

// ─── Contacts ────────────────────────────────────────────────

export const waContacts = {
  list: () => get<WAContact[]>('/contacts'),
  create: (contact: Omit<WAContact, 'id'>) => post<WAContact>('/contacts', contact),
  delete: (id: string) => del<{ ok: boolean }>(`/contacts/${id}`),
}

// ─── Messaging ───────────────────────────────────────────────

export const waMessaging = {
  send: (payload: { sessionId: string; to: string; message: string; mediaUrl?: string }) =>
    post<WAMessage>('/send', payload),
  sendBulk: (campaignId: string) => post<{ queued: number }>('/send/bulk', { campaignId }),
}

// ─── Queue ───────────────────────────────────────────────────

export const waQueue = {
  list: () => get<WAQueueItem[]>('/queue'),
  pause: (id: string) => post<{ ok: boolean }>(`/queue/${id}/pause`, {}),
  resume: (id: string) => post<{ ok: boolean }>(`/queue/${id}/resume`, {}),
}

// ─── Campaigns ───────────────────────────────────────────────

export const waCampaigns = {
  list: () => get<WACampaign[]>('/campaigns'),
  create: (campaign: Omit<WACampaign, 'id' | 'sentCount' | 'deliveredCount' | 'failedCount' | 'createdAt'>) =>
    post<WACampaign>('/campaigns', campaign),
}

// ─── Automations ─────────────────────────────────────────────

export const waAutomations = {
  list: () => get<WAAutomation[]>('/automations'),
  toggle: (id: string, active: boolean) => post<{ ok: boolean }>(`/automations/${id}/toggle`, { active }),
  create: (automation: Omit<WAAutomation, 'id' | 'lastFired' | 'firedCount'>) =>
    post<WAAutomation>('/automations', automation),
}

// ─── Templates ───────────────────────────────────────────────

export const waTemplates = {
  list: () => get<WATemplate[]>('/templates'),
  create: (template: Omit<WATemplate, 'id' | 'createdAt'>) => post<WATemplate>('/templates', template),
  delete: (id: string) => del<{ ok: boolean }>(`/templates/${id}`),
}

// ─── History & Logs ──────────────────────────────────────────

export const waHistory = {
  list: (page = 1, limit = 50) => get<WAMessage[]>(`/history?page=${page}&limit=${limit}`),
}

export const waLogs = {
  list: () => get<WALog[]>('/logs'),
}

// ─── Dashboard ───────────────────────────────────────────────

export const waDashboard = {
  stats: () => get<WADashboardStats>('/dashboard'),
}

// ─── Trigger Automation (called by internal events) ──────────

export async function triggerAutomation(
  trigger: WAAutomation['trigger'],
  context: Record<string, string>
): Promise<{ fired: number }> {
  return post('/automations/trigger', { trigger, context })
}
