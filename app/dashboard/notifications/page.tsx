'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBLog } from '@/lib/db'
import { Bell, Shield, Mail, Calendar, MessageSquare } from 'lucide-react'

export default function UserNotificationsPage() {
  const [logs, setLogs] = useState<DBLog[]>([])
  const [alerts, setAlerts] = useState([
    { id: 'tip', label: 'Nova Tip publicada', desc: 'Receber alertas quando analistas lançarem novas entradas.', enabled: true },
    { id: 'result', label: 'Resultado final das Tips', desc: 'Notificações de Green, Red ou Void.', enabled: true },
    { id: 'odd', label: 'Grandes variações de cotações', desc: 'Alertar caso a odd recomendada flutue significativamente.', enabled: false }
  ])

  useEffect(() => {
    // Fetch logs from the simulated db to represent actual system notifications
    setLogs(db.getLogs())

    const handleUpdate = () => {
      setLogs(db.getLogs())
    }

    window.addEventListener('oddvault_db_update', handleUpdate)
    return () => {
      window.removeEventListener('oddvault_db_update', handleUpdate)
    }
  }, [])

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Bell className="w-7 h-7 text-emerald-500" />
          Central de Notificações
        </h1>
        <p className="text-sm text-zinc-400">Configure suas preferências de alertas e acompanhe comunicados importantes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts listing (actual system notifications) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-850 bg-zinc-900/20">
            <CardHeader>
              <CardTitle className="text-base font-bold">Mensagens Recentes</CardTitle>
              <CardDescription>Alertas e comunicados disparados pelo sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              {logs.length > 0 ? (
                logs.map(log => (
                  <div key={log.id} className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-lg flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center w-full gap-2">
                        <span className="font-bold text-white">Notificação do Sistema</span>
                        <span className="text-[9px] text-zinc-550">{log.timestamp.replace('T', ' ').split('.')[0]}</span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed">{log.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-550 flex flex-col items-center justify-center gap-2">
                  <Bell className="w-8 h-8 text-zinc-650" />
                  <p className="font-semibold">Nenhum Alerta no Momento</p>
                  <p className="text-[10px] text-zinc-600">Novas notificações aparecerão aqui à medida que as dicas forem atualizadas.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preferences sidebars */}
        <div className="space-y-6">
          <Card className="border-zinc-850 bg-zinc-900/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Preferências de Push</CardTitle>
              <CardDescription>Eventos que disparam alertas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              {alerts.map(alert => (
                <div key={alert.id} className="flex justify-between items-center p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-850">
                  <div>
                    <h4 className="font-bold text-white leading-tight">{alert.label}</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{alert.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={alert.enabled}
                    onChange={() => toggleAlert(alert.id)}
                    className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-zinc-850 bg-zinc-900/30">
            <CardHeader>
              <CardTitle className="text-sm font-bold">Canais Integrados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-900/40 rounded border border-zinc-850 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white block">Telegram Bot</span>
                  <span className="text-[10px] text-zinc-500">Integrado</span>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">Ativo</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
