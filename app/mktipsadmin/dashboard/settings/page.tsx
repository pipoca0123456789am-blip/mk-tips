'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBLog, DBAuditLog } from '@/lib/db'
import { Shield, ListFilter, RotateCcw, ShieldCheck, Terminal, Trash2 } from 'lucide-react'

export default function AdminSettingsPage() {
  const [logs, setLogs] = useState<DBLog[]>([])
  const [auditLogs, setAuditLogs] = useState<DBAuditLog[]>([])
  const [activeTab, setActiveTab] = useState<'security' | 'system_logs' | 'audit_logs'>('security')

  // Security variables
  const [twoFactor, setTwoFactor] = useState(true)
  const [rateLimit, setRateLimit] = useState(60)
  const [ipWhitelist, setIpWhitelist] = useState('189.120.45.10, 192.168.15.22')
  const [ipBlacklist, setIpBlacklist] = useState('')
  const [clientIp, setClientIp] = useState('127.0.0.1')

  useEffect(() => {
    setLogs(db.getLogs())
    setAuditLogs(db.getAuditLogs())
    
    // Load IP settings from db helper
    setIpBlacklist(db.getBlockedIps().join(', '))
    setClientIp(db.getClientIp())
  }, [activeTab])

  const handleBackup = (type: 'incremental' | 'full') => {
    db.addAuditLog('Admin Master', 'TRIGGER_BACKUP', 'System', '', `${type} backup triggered`)
    db.addLog('System', `Backup do sistema (${type}) executado com sucesso e enviado para AWS S3`, '189.120.45.10', 'MacBook Pro', 'Admin Master')
    alert(`Backup ${type} finalizado e armazenado na nuvem com sucesso!`)
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Parse and save blacklisted IPs
    const parsedBlacklist = ipBlacklist.split(',').map(ip => ip.trim()).filter(Boolean)
    db.setBlockedIps(parsedBlacklist)
    db.setClientIp(clientIp)

    db.addAuditLog('Admin Master', 'UPDATE_SECURITY_SETTINGS', 'System', `Blacklist Size: ${parsedBlacklist.length}`, `Blocked IPs: ${parsedBlacklist.join(', ')}`)
    db.addLog('System', 'Parâmetros de firewall, lista negra e IP simulado atualizados', '189.120.45.10', 'MacBook Pro', 'Admin Master')
    alert('Configurações de segurança e firewall atualizadas com sucesso!')
  }

  const clearLogs = () => {
    if (confirm('Deseja realmente limpar todos os logs do sistema e de auditoria permanentemente?')) {
      db.clearAllLogs()
      setLogs([])
      setAuditLogs([])
      alert('Todos os logs de sistema e trilhas de auditoria foram limpos com sucesso!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Segurança & Configurações</h1>
        <p className="text-sm text-zinc-400">Gerencie firewalls, logs de auditoria de alterações, 2FA e backups do sistema.</p>
      </div>

      {/* Tabs selectors */}
      <div className="flex gap-2 border-b border-zinc-900 pb-px">
        {[
          { id: 'security', label: 'Segurança & Backups', icon: Shield },
          { id: 'system_logs', label: 'Logs de Acesso (IP)', icon: Terminal },
          { id: 'audit_logs', label: 'Trilha de Auditoria', icon: ShieldCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security details */}
          <Card className="lg:col-span-2 border-zinc-850 bg-zinc-900/30">
            <CardHeader>
              <CardTitle className="text-base font-bold">Firewall & Controle de Acesso</CardTitle>
              <CardDescription>Configure limites de conexões simultâneas e controle de IP.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSecurity}>
              <CardContent className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-850">
                  <div>
                    <h3 className="font-bold text-white">Autenticação de Dois Fatores (2FA) Obrigatória</h3>
                    <p className="text-[10px] text-zinc-500">Exigir 2FA para logins administrativos.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={e => setTwoFactor(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 text-emerald-500 focus:ring-emerald-500 bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Rate Limit (Requisições por minuto)</label>
                  <input
                    type="number"
                    value={rateLimit}
                    onChange={e => setRateLimit(parseInt(e.target.value))}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Lista Branca de IPs Administrativos</label>
                  <input
                    type="text"
                    value={ipWhitelist}
                    onChange={e => setIpWhitelist(e.target.value)}
                    placeholder="E.g. 192.168.1.100, 189.120.45.10"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Lista Negra de IPs Bloqueados (Banidos)</label>
                  <input
                    type="text"
                    value={ipBlacklist}
                    onChange={e => setIpBlacklist(e.target.value)}
                    placeholder="E.g. 103.245.12.89"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Simulação de IP do Cliente (Para Teste de Bloqueio)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={clientIp}
                      onChange={e => setClientIp(e.target.value)}
                      placeholder="E.g. 177.45.198.24"
                      className="flex-1 p-2.5 bg-zinc-900 border border-zinc-800 rounded text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const blocked = ipBlacklist.split(',').map(ip => ip.trim()).filter(Boolean)
                        if (!blocked.includes(clientIp)) {
                          const newBlacklist = [...blocked, clientIp].join(', ')
                          setIpBlacklist(newBlacklist)
                          alert(`IP ${clientIp} adicionado à lista negra temporária. Clique em "Salvar Parâmetros" abaixo para efetivar e ser jogado na Caixa Preta!`)
                        }
                      }}
                      className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded font-bold text-[10px] cursor-pointer"
                    >
                      Autobloquear IP
                    </button>
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-1 block">Mude o IP ou clique em Autobloquear e salve para testar o redirecionamento automático para a Caixa Preta.</span>
                </div>
              </CardContent>
              <div className="p-6 border-t border-zinc-850 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded cursor-pointer"
                >
                  Salvar Parâmetros
                </button>
              </div>
            </form>
          </Card>

          {/* Backup options */}
          <Card className="border-zinc-850 bg-zinc-900/30 flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle className="text-base font-bold">Backups do Sistema</CardTitle>
                <CardDescription>Crie backups e envie snapshots instantâneos para servidores de nuvem seguros.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 bg-zinc-900/40 rounded border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Último Backup Incremental</span>
                  <p className="font-bold text-white mt-1">Hoje, há 3 horas</p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Tamanho das Tabelas DB</span>
                  <p className="font-bold text-white mt-1">14.8 MB (Compactado)</p>
                </div>
              </CardContent>
            </div>
            <div className="p-6 border-t border-zinc-850 space-y-2">
              <button
                onClick={() => handleBackup('incremental')}
                className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-200 font-semibold rounded cursor-pointer"
              >
                Gerar Backup Incremental
              </button>
              <button
                onClick={() => handleBackup('full')}
                className="w-full py-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-semibold rounded cursor-pointer"
              >
                Executar Backup Completo
              </button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'system_logs' && (
        <Card className="border-zinc-850 bg-zinc-900/20">
          <CardHeader className="flex flex-row justify-between items-center pb-4">
            <div>
              <CardTitle className="text-base font-bold">Logs de Segurança e Acesso</CardTitle>
              <CardDescription>Histórico de conexões de usuários e erros registrados em tempo real.</CardDescription>
            </div>
            <button
              onClick={clearLogs}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded text-xs font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar Logs
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs font-mono">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-500">
                    <th className="p-3">Data / Hora</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Evento</th>
                    <th className="p-3">IP</th>
                    <th className="p-3">Dispositivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-400">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-900/20">
                      <td className="p-3 whitespace-nowrap text-zinc-500">{log.timestamp.replace('T', ' ').split('.')[0]}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          log.type === 'Auth' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          log.type === 'Error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-zinc-900 text-zinc-400'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-350">{log.message}</td>
                      <td className="p-3 text-zinc-500">{log.ip}</td>
                      <td className="p-3 text-zinc-500">{log.device}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'audit_logs' && (
        <Card className="border-zinc-850 bg-zinc-900/20">
          <CardHeader>
            <CardTitle className="text-base font-bold">Trilha de Auditoria Geral</CardTitle>
            <CardDescription>Trilha de alterações feitas por administradores (Imutável).</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs font-mono">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-850 bg-zinc-900/40 text-zinc-500">
                    <th className="p-3">Data</th>
                    <th className="p-3">Autor</th>
                    <th className="p-3">Operação</th>
                    <th className="p-3">Target</th>
                    <th className="p-3">Valor Antigo</th>
                    <th className="p-3">Novo Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-400">
                  {auditLogs.map(audit => (
                    <tr key={audit.id} className="hover:bg-zinc-900/20">
                      <td className="p-3 whitespace-nowrap text-zinc-500">{audit.timestamp.replace('T', ' ').split('.')[0]}</td>
                      <td className="p-3 text-white font-bold">{audit.author}</td>
                      <td className="p-3 text-emerald-400 font-bold">{audit.operation}</td>
                      <td className="p-3 text-zinc-500">{audit.target}</td>
                      <td className="p-3 text-red-400 truncate max-w-[120px]" title={audit.oldValue}>{audit.oldValue || '-'}</td>
                      <td className="p-3 text-emerald-400 truncate max-w-[120px]" title={audit.newValue}>{audit.newValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
