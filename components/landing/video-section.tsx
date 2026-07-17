'use client'

import React, { useState, useEffect } from 'react'
import { Play } from 'lucide-react'

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ') // Default placeholder (can be configured in admin)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mktips_admin_video_url')
      if (stored) {
        setVideoUrl(stored)
      }
    }
  }, [])

  return (
    <section id="video" className="relative py-24 sm:py-32 bg-black overflow-hidden border-b border-zinc-900/40">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/5 rounded-full blur-[130px] z-0" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 space-y-16">
        
        {/* Title */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs font-extrabold text-[#00E08A] uppercase tracking-widest bg-[#00E08A]/10 border border-[#00E08A]/20 px-3 py-1 rounded-full">
            Demonstração Rápida
          </span>
          <h2 className="text-balance text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Veja a nossa ferramenta em ação
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Assista a uma demonstração rápida e entenda como nossa tecnologia otimiza sua rotina no mercado esportivo.
          </p>
        </div>

        {/* Video Player Box */}
        <div className="max-w-4xl mx-auto relative group">
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[#00E08A]/5 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative border border-zinc-850 bg-zinc-950/80 rounded-2xl overflow-hidden aspect-video shadow-2xl backdrop-blur-2xl">
            <video
              className="w-full h-full absolute inset-0 rounded-2xl"
              src="/premium-cinematic.mp4"
              controls
              playsInline
            />
          </div>
        </div>

      </div>
    </section>
  )
}
