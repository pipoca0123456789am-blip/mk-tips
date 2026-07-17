'use client'

import React, { useEffect, useState } from 'react'
import { db } from '@/lib/db'
import { ShieldAlert } from 'lucide-react'

export default function CaixaPretaPage() {
  const [ip, setIp] = useState('127.0.0.1')
  const [timestamp, setTimestamp] = useState('')
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIp(db.getClientIp())
      setTimestamp(new Date().toISOString())
    }
  }, [])

  const handleClearBan = () => {
    db.clearOwnIpBan()
    setCleared(true)
    setTimeout(() => {
      window.location.href = '/mktipsadmin'
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-red-500 selection:text-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#110505_1px,transparent_1px),linear-gradient(to_bottom,#110505_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="w-full max-w-2xl bg-zinc-950 border border-red-950 p-6 md:p-8 rounded-xl space-y-6 relative shadow-[0_0_50px_rgba(239,68,68,0.05)]">
        <div className="w-16 h-16 bg-red-950/15 text-red-500 rounded-full flex items-center justify-center border border-red-500/25 mx-auto animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-xl md:text-2xl font-black tracking-widest text-red-500 uppercase animate-pulse">
            CAIXA PRETA — SISTEMA BLOQUEADO
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Intrusão Detectada • Endereço de IP Banido
          </p>
        </div>

        <div className="bg-zinc-900/30 border border-red-950/60 p-4 rounded-lg text-[11px] leading-relaxed text-red-400 font-mono space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 text-[9px] bg-red-950/40 text-red-400 font-black tracking-widest rounded border border-red-500/10 uppercase select-none">
            Status: {cleared ? 'CLEARED' : 'BANNED'}
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-650">[TIMESTAMP]</span>
            <span>{timestamp}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-650">[DEVICE_IP]</span>
            <span className="font-extrabold text-white">{ip}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-650">[VIOLATION]</span>
            <span className="text-amber-400">Acesso não autorizado ou comportamento hostil detectado</span>
          </div>
          <div className="flex gap-2 border-t border-red-950/40 pt-2 mt-2">
            <span className="text-zinc-650">[FIREWALL]</span>
            <span className="text-red-500">
              Firewall MK-SHIELD bloqueou sua conexão. Se você é o administrador, use &quot;Desbloquear meu IP&quot; abaixo.
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-red-950/40">
          <button
            type="button"
            onClick={() => {
              window.location.href = '/'
            }}
            className="flex-1 py-3 bg-zinc-900 border border-red-950 hover:bg-zinc-850 hover:text-white text-red-400 font-bold rounded-lg text-xs transition-colors cursor-pointer text-center"
          >
            Voltar para a Página Inicial
          </button>
          <button
            type="button"
            onClick={handleClearBan}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-black font-extrabold rounded-lg text-xs transition-colors cursor-pointer text-center"
          >
            Desbloquear meu IP
          </button>
        </div>

        <p className="text-[10px] text-zinc-650 text-center uppercase tracking-wider select-none">
          MK-SHIELD v2.4.9 • security.mktips.app
        </p>
      </div>
    </div>
  )
}
