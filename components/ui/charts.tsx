'use client'

import React, { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line
} from 'recharts'
import { Download, FileSpreadsheet, FileText, Image as ImageIcon, Calendar } from 'lucide-react'

// Curated theme colors
const COLORS = {
  emerald: '#00E08A',
  indigo: '#6C5CE7',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  red: '#EF4444',
  zinc: '#94A3B8'
}

interface ChartDataPoint {
  label: string
  value: number
  secondaryValue?: number
  [key: string]: any
}

interface CommonChartWrapperProps {
  title: string
  subtitle?: string
  onPeriodChange?: (period: string) => void
  onExport?: (format: 'png' | 'excel' | 'pdf') => void
  children: React.ReactNode
}

export function ChartWrapper({ title, subtitle, onPeriodChange, onExport, children }: CommonChartWrapperProps) {
  const [activePeriod, setActivePeriod] = useState('30d')
  const [showExportMenu, setShowExportMenu] = useState(false)

  const periods = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: '90d', label: '90D' },
    { id: '12m', label: '12M' }
  ]

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-850/70 rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:border-zinc-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-[10px] sm:text-xs text-zinc-400 font-medium mt-0.5">{subtitle}</p>}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
          <div className="flex items-center bg-zinc-900 border border-zinc-850 p-1 rounded-xl">
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePeriod(p.id)
                  if (onPeriodChange) onPeriodChange(p.id)
                }}
                className={`text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activePeriod === p.id
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-zinc-950 border border-zinc-850 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    if (onExport) onExport('png')
                    setShowExportMenu(false)
                  }}
                  className="w-full text-left text-[10px] sm:text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> Exportar PNG
                </button>
                <button
                  onClick={() => {
                    if (onExport) onExport('excel')
                    setShowExportMenu(false)
                  }}
                  className="w-full text-left text-[10px] sm:text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Planilha Excel
                </button>
                <button
                  onClick={() => {
                    if (onExport) onExport('pdf')
                    setShowExportMenu(false)
                  }}
                  className="w-full text-left text-[10px] sm:text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-red-400" /> Relatório PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 min-h-[220px] relative">
        {children}
      </div>
    </div>
  )
}

interface AreaChartProps {
  data: ChartDataPoint[]
  height?: number
  color?: string
  fillColor?: string
  title?: string
  subtitle?: string
}

export function AreaChart({ data, height = 220, color = COLORS.emerald, title, subtitle }: AreaChartProps) {
  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#ffffff0a" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            borderColor: '#27272a',
            borderRadius: '12px',
            fontSize: '11px',
            color: '#fff'
          }}
          labelStyle={{ fontWeight: 'bold', color: '#a1a1aa' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fillOpacity={1}
          fill={`url(#grad-${color})`}
          activeDot={{ r: 6, stroke: '#09090b', strokeWidth: 2, fill: color }}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )

  if (title) {
    return (
      <ChartWrapper title={title} subtitle={subtitle}>
        {chart}
      </ChartWrapper>
    )
  }

  return chart
}

interface BarChartProps {
  data: ChartDataPoint[]
  height?: number
  color?: string
  accentColor?: string
  title?: string
  subtitle?: string
}

export function BarChart({ data, height = 220, color = COLORS.emerald, accentColor = COLORS.indigo, title, subtitle }: BarChartProps) {
  const hasSecondary = data.some(d => d.secondaryValue !== undefined)

  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#ffffff0a" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            borderColor: '#27272a',
            borderRadius: '12px',
            fontSize: '11px',
            color: '#fff'
          }}
          labelStyle={{ fontWeight: 'bold', color: '#a1a1aa' }}
        />
        <Bar
          dataKey="value"
          fill={color}
          radius={[4, 4, 0, 0]}
          maxBarSize={45}
        />
        {hasSecondary && (
          <Bar
            dataKey="secondaryValue"
            fill={accentColor}
            radius={[4, 4, 0, 0]}
            maxBarSize={45}
          />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  )

  if (title) {
    return (
      <ChartWrapper title={title} subtitle={subtitle}>
        {chart}
      </ChartWrapper>
    )
  }

  return chart
}

interface DonutChartProps {
  data: { name: string; value: number; color?: string }[]
  height?: number
  title?: string
  subtitle?: string
}

export function DonutChart({ data, height = 220, title, subtitle }: DonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0)
  const defaultColors = [COLORS.emerald, COLORS.red, COLORS.yellow, COLORS.blue]

  const chart = (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 h-full">
      <div className="relative" style={{ width: height * 0.8, height: height * 0.8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || defaultColors[index % defaultColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#09090b',
                borderColor: '#27272a',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#fff'
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</span>
          <span className="text-xl font-extrabold text-white">{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Sidebar Legend */}
      <div className="flex flex-col gap-2.5">
        {data.map((item, index) => {
          const color = item.color || defaultColors[index % defaultColors.length]
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'
          return (
            <div key={index} className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <div>
                <span className="text-xs font-semibold text-zinc-300 block leading-tight">{item.name}</span>
                <span className="text-[10px] text-zinc-500 font-bold block">{item.value} ({pct}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  if (title) {
    return (
      <ChartWrapper title={title} subtitle={subtitle}>
        {chart}
      </ChartWrapper>
    )
  }

  return chart
}

interface FunnelChartProps {
  data: { stage: string; value: number }[]
  height?: number
  title?: string
  subtitle?: string
}

export function FunnelChart({ data, height = 220, title, subtitle }: FunnelChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)

  const chart = (
    <div className="flex flex-col justify-center h-full space-y-3">
      {data.map((item, index) => {
        const widthPercent = (item.value / max) * 100
        const prevItem = data[index - 1]
        const conversion = prevItem ? ((item.value / prevItem.value) * 100).toFixed(1) : null

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-[10px] sm:text-xs">
              <span className="text-zinc-300 font-semibold">{item.stage}</span>
              <span className="text-white font-bold">{item.value.toLocaleString()} {conversion && <span className="text-emerald-400">({conversion}%)</span>}</span>
            </div>
            <div className="w-full bg-zinc-900 border border-zinc-850 h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )

  if (title) {
    return (
      <ChartWrapper title={title} subtitle={subtitle}>
        {chart}
      </ChartWrapper>
    )
  }

  return chart
}

interface HeatmapChartProps {
  data: { day: string; value: number }[]
  title?: string
  subtitle?: string
}

export function HeatmapChart({ data, title, subtitle }: HeatmapChartProps) {
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const chart = (
    <div className="flex flex-col justify-center h-full">
      <div className="grid grid-cols-7 gap-1.5">
        {daysOfWeek.map((day, i) => (
          <span key={i} className="text-[10px] text-zinc-500 font-bold text-center uppercase tracking-wider">{day}</span>
        ))}
        {data.map((item, i) => {
          let bg = 'bg-zinc-900/40 border border-zinc-850/60'
          if (item.value > 0 && item.value <= 2) bg = 'bg-emerald-950 border border-emerald-900/30'
          else if (item.value > 2 && item.value <= 5) bg = 'bg-emerald-800 border border-emerald-700/30 shadow-md shadow-emerald-500/5'
          else if (item.value > 5) bg = 'bg-emerald-500 border border-emerald-400/30 shadow-lg shadow-emerald-500/10'

          return (
            <div
              key={i}
              className={`aspect-square rounded-md transition-all duration-300 hover:scale-110 cursor-pointer ${bg} flex items-center justify-center group relative`}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-zinc-850 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                {item.day}: {item.value} Tips/Acessos
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  if (title) {
    return (
      <ChartWrapper title={title} subtitle={subtitle}>
        {chart}
      </ChartWrapper>
    )
  }

  return chart
}

interface TipsterPerformanceChartProps {
  data: { label: string; roi: number; yield: number; accuracy: number; profit: number }[]
  height?: number
  title?: string
  subtitle?: string
}

export function TipsterPerformanceChart({ data, height = 240, title, subtitle }: TipsterPerformanceChartProps) {
  const chart = (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 10, right: -10, left: -25, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#ffffff0a" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#09090b',
            borderColor: '#27272a',
            borderRadius: '12px',
            fontSize: '11px',
            color: '#fff'
          }}
        />
        <Bar
          yAxisId="left"
          dataKey="profit"
          fill={COLORS.emerald}
          radius={[4, 4, 0, 0]}
          name="Lucro (un)"
          maxBarSize={30}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="roi"
          stroke={COLORS.indigo}
          strokeWidth={2.5}
          name="ROI (%)"
          dot={{ r: 4, stroke: '#09090b', strokeWidth: 1.5, fill: COLORS.indigo }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="accuracy"
          stroke={COLORS.blue}
          strokeWidth={2}
          name="Taxa Acerto (%)"
          dot={{ r: 3, stroke: '#09090b', strokeWidth: 1, fill: COLORS.blue }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )

  if (title) {
    return (
      <ChartWrapper title={title} subtitle={subtitle}>
        {chart}
      </ChartWrapper>
    )
  }

  return chart
}

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function Sparkline({ data, width = 80, height = 30, color = COLORS.emerald }: SparklineProps) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1 || 1)

  const points = data.map((val, i) => {
    const x = i * stepX
    const y = height - ((val - min) / range) * height
    return { x, y }
  })

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    return `${acc} L ${p.x} ${p.y}`
  }, '')

  return (
    <svg width={width} height={height} className="overflow-visible select-none">
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
