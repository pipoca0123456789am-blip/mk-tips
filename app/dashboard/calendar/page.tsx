'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db, DBTip } from '@/lib/db'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

export default function UserCalendarPage() {
  const [tips, setTips] = useState<DBTip[]>([])
  
  useEffect(() => {
    setTips(db.getTips())
  }, [])

  // Simulated days of current month (July 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-emerald-500" />
            Calendário de Tips
          </h1>
          <p className="text-sm text-zinc-400">Acompanhe cronogramas de eventos esportivos futuros e tips passadas.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-white">
          <button className="p-1 hover:bg-zinc-800 rounded"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-bold px-2">Julho 2026</span>
          <button className="p-1 hover:bg-zinc-800 rounded"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <Card className="border-zinc-850 bg-zinc-900/20 p-4">
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pb-3 border-b border-zinc-850">
          <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mt-3 text-xs">
          {/* Pad empty days for July 2026 starting on Wednesday (3 empty slots) */}
          {[1, 2, 3].map(empty => (
            <div key={`empty-${empty}`} className="min-h-[80px] bg-zinc-950/20 border border-transparent rounded-lg" />
          ))}

          {daysInMonth.map(day => {
            // Check if there are tips on this simulated day (all simulated tips are around July 7-9)
            const dayTips = tips.filter(t => {
              const tipDay = new Date(t.datetime).getDate()
              return tipDay === day
            })

            return (
              <div 
                key={day} 
                className={`min-h-[80px] p-2 rounded-lg border flex flex-col justify-between transition-all ${
                  dayTips.length > 0
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700' 
                    : 'bg-zinc-950/30 border-zinc-900/50'
                }`}
              >
                <span className={`font-bold ${day === 9 ? 'text-emerald-400 font-black' : 'text-zinc-500'}`}>{day}</span>
                
                <div className="space-y-1">
                  {dayTips.map(t => (
                    <div 
                      key={t.id} 
                      className={`px-1 py-0.5 rounded text-[8px] truncate font-semibold border ${
                        t.status === 'Green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        t.status === 'Red' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        'bg-zinc-800 border-zinc-750 text-zinc-300'
                      }`}
                      title={t.match}
                    >
                      {t.match.split('vs')[0]}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
