'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { db } from '@/lib/db'
import { Plus, Check, X, ShieldAlert, TrendingUp, Users, Trash2, Edit } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  rules: string
  createdAt: string
}

export default function AdminLeveragingPage() {
  const [tab, setTab] = useState<'alavancagem' | 'categorias'>('alavancagem')
  const [stages, setStages] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [showAdd, setShowAdd] = useState(false)
  const [showAddCat, setShowAddCat] = useState(false)

  // Free Leverage settings
  const [freeLimit, setFreeLimit] = useState(3)
  const [freeCampaignActive, setFreeCampaignActive] = useState(true)

  // Stage form
  const [challengeId, setChallengeId] = useState('starter')
  const [stepNumber, setStepNumber] = useState(1)
  const [match, setMatch] = useState('')
  const [market, setMarket] = useState('')
  const [odd, setOdd] = useState(1.85)
  const [justification, setJustification] = useState('')

  // Category form
  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [catRules, setCatRules] = useState('')
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

  useEffect(() => {
    setStages(db.getChallengeStages())
    
    // Load categories
    const stored = localStorage.getItem('mktips_categories')
    if (stored) {
      setCategories(JSON.parse(stored))
    } else {
      const defaults: Category[] = [
        { id: 'cat-1', name: 'Futebol VIP', description: 'Tips de valor nos principais campeonatos nacionais e ligas europeias.', rules: 'Entrada padrão com 1 a 3 unidades de stake. Verificar oscilações.', createdAt: new Date().toISOString() },
        { id: 'cat-2', name: 'Basquete Tripla', description: 'Múltiplas de 3 seleções com alta probabilidade na NBA.', rules: 'Apenas mercados de Handicap Alternativo e Pontos.', createdAt: new Date().toISOString() },
        { id: 'cat-3', name: 'Alavancagem 10k', description: 'Regulagem especial de banca para subida acelerada.', rules: 'Entrada agressiva. Siga estritamente as etapas 1 a 5.', createdAt: new Date().toISOString() }
      ]
      setCategories(defaults)
      localStorage.setItem('mktips_categories', JSON.stringify(defaults))
    }
  }, [])

  const saveCategories = (list: Category[]) => {
    setCategories(list)
    localStorage.setItem('mktips_categories', JSON.stringify(list))
  }

  const handleResolve = (stageId: string, status: 'Green' | 'Red') => {
    const updated = stages.map(s => {
      if (s.id === stageId) {
        db.addAuditLog('Admin Master', 'RESOLVE_CHALLENGE_STAGE', s.id, s.status, status)
        db.addLog('Audit', `Etapa ${s.stepNumber} do desafio ${s.challengeId} resolvida como ${status}`)
        return { ...s, status }
      }
      return s
    })
    setStages(updated)
    db.setChallengeStages(updated)
  }

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!match || !market) return

    const newStage = {
      id: `stg-${Date.now()}`,
      challengeId,
      stepNumber,
      match,
      sport: 'Futebol',
      market,
      odd,
      stakeSuggested: 20,
      time: 'Hoje • ' + new Date().toLocaleTimeString().slice(0, 5),
      justification,
      status: 'Pendente'
    }

    const updated = [...stages, newStage]
    setStages(updated)
    db.setChallengeStages(updated)
    db.addAuditLog('Admin Master', 'ADD_CHALLENGE_STAGE', newStage.id, '', `${match} (Odd ${odd})`)
    
    setMatch('')
    setMarket('')
    setJustification('')
    setShowAdd(false)
  }

  const handleSaveFreeCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    db.addAuditLog('Admin Master', 'UPDATE_FREE_LEVERAGE_SETTINGS', 'System', `Limit: 3`, `Limit: ${freeLimit}, Active: ${freeCampaignActive}`)
    alert('Campanha Alavancagem Free atualizada com sucesso!')
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName) return

    if (editingCatId) {
      const updated = categories.map(c => c.id === editingCatId ? { ...c, name: catName, description: catDesc, rules: catRules } : c)
      saveCategories(updated)
      setEditingCatId(null)
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catName,
        description: catDesc,
        rules: catRules,
        createdAt: new Date().toISOString()
      }
      saveCategories([...categories, newCat])
    }

    setCatName('')
    setCatDesc('')
    setCatRules('')
    setShowAddCat(false)
  }

  const deleteCategory = (id: string) => {
    if (!confirm('Deseja realmente excluir esta categoria definitivamente?')) return
    const filtered = categories.filter(c => c.id !== id)
    saveCategories(filtered)
  }

  const startEditCategory = (c: Category) => {
    setEditingCatId(c.id)
    setCatName(c.name)
    setCatDesc(c.description)
    setCatRules(c.rules)
    setShowAddCat(true)
  }

  return (
    <div className="space-y-6">
      {/* Header / Title block */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Alavancagens & Categorias</h1>
          <p className="text-sm text-zinc-400">Configure etapas de alavancagem profissional e gerencie categorias de tips.</p>
        </div>
        {tab === 'alavancagem' ? (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Etapa
          </button>
        ) : (
          <button
            onClick={() => { setEditingCatId(null); setCatName(''); setCatDesc(''); setCatRules(''); setShowAddCat(true) }}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Categoria
          </button>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-1.5 border-b border-zinc-900 pb-[1px]">
        <button
          onClick={() => setTab('alavancagem')}
          className={`px-4 py-2.5 font-bold text-xs capitalize transition-all cursor-pointer border-b-2 -mb-[2px] ${
            tab === 'alavancagem' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-350'
          }`}
        >
          Etapas de Alavancagem
        </button>
        <button
          onClick={() => setTab('categorias')}
          className={`px-4 py-2.5 font-bold text-xs capitalize transition-all cursor-pointer border-b-2 -mb-[2px] ${
            tab === 'categorias' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-350'
          }`}
        >
          Categorias de Tips
        </button>
      </div>

      {tab === 'alavancagem' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stages list */}
          <div className="lg:col-span-2 space-y-4">
            {stages.length > 0 ? (
              stages.map(stage => (
                <Card key={stage.id} className="border-zinc-850 bg-zinc-900/30 overflow-hidden">
                  <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-zinc-850 rounded text-[9px] font-bold text-zinc-400 uppercase">{stage.challengeId}</span>
                        <span className="text-[10px] text-zinc-500 font-bold">Etapa {stage.stepNumber}</span>
                      </div>
                      <h4 className="font-bold text-white mt-2 leading-tight">{stage.match}</h4>
                      <p className="text-[10px] text-zinc-450 mt-1">Mercado: {stage.market} • Odd: {stage.odd}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      {stage.status === 'Pendente' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolve(stage.id, 'Green')}
                            className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded font-semibold hover:bg-emerald-500/25 cursor-pointer"
                          >
                            Green
                          </button>
                          <button
                            onClick={() => handleResolve(stage.id, 'Red')}
                            className="px-3 py-1.5 bg-red-500/15 text-red-400 border border-red-500/20 rounded font-semibold hover:bg-red-500/25 cursor-pointer"
                          >
                            Red
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1.5 rounded font-black border uppercase tracking-wider text-[10px] ${
                          stage.status === 'Green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {stage.status}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-12 text-xs">Nenhuma etapa cadastrada.</p>
            )}
          </div>

          {/* Free trial campaign settings */}
          <div className="space-y-6">
            <Card className="border-zinc-850 bg-zinc-900/30">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Campanha Alavancagem Free</CardTitle>
                <CardDescription>Ajuste os parâmetros da demonstração gratuita.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveFreeCampaign}>
                <CardContent className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-zinc-950/65 rounded border border-zinc-900">
                    <div>
                      <span className="font-bold text-white block">Status da Campanha</span>
                      <span className="text-[9px] text-zinc-500">Ativa a liberação gratuita</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={freeCampaignActive}
                      onChange={e => setFreeCampaignActive(e.target.checked)}
                      className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Limite de Gestões Gratuitas</label>
                    <input
                      type="number"
                      value={freeLimit}
                      onChange={e => setFreeLimit(parseInt(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                    />
                  </div>

                  {/* Conversion metrics */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold block">Conversão & Métricas</span>
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div className="p-2.5 bg-zinc-950 rounded border border-zinc-900">
                        <span className="text-zinc-500 block">Iniciaram Trial</span>
                        <strong className="text-white text-xs block mt-1">428</strong>
                      </div>
                      <div className="p-2.5 bg-zinc-955 rounded border border-zinc-900">
                        <span className="text-zinc-500 block">Concluíram 3/3</span>
                        <strong className="text-white text-xs block mt-1">197</strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded flex justify-between items-center text-[10px]">
                      <span className="text-zinc-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        Taxa de Conversão
                      </span>
                      <span className="text-emerald-400 font-extrabold">21.8%</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 border-t border-zinc-850">
                  <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded text-xs transition-colors cursor-pointer">Salvar Campanha Free</button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(c => (
            <Card key={c.id} className="border-zinc-850 bg-zinc-900/30 flex flex-col justify-between">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <div>
                  <CardTitle className="text-base font-bold text-white">{c.name}</CardTitle>
                  <span className="text-[9px] text-zinc-500 block mt-1">Criada em: {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEditCategory(c)} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteCategory(c.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs py-4 flex-1">
                <div>
                  <span className="text-[10px] text-zinc-550 block font-bold">Descrição</span>
                  <p className="text-zinc-300 leading-relaxed mt-1 font-medium">{c.description}</p>
                </div>
                <div className="pt-2 border-t border-zinc-850">
                  <span className="text-[10px] text-zinc-550 block font-bold">Regras Específicas</span>
                  <p className="text-emerald-400 mt-1 font-mono text-[10px] leading-relaxed bg-zinc-950 p-2.5 rounded border border-zinc-900">{c.rules || 'Nenhuma regra especificada.'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Stage Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-zinc-955 border-zinc-800 text-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Cadastrar Nova Etapa</CardTitle>
              <CardDescription>Esta etapa ficará ativa imediatamente no projeto de alavancagem selecionado.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddStage}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-550 font-semibold mb-2">Alavancagem</label>
                    <select
                      value={challengeId}
                      onChange={e => setChallengeId(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                    >
                      <option value="starter">Starter - R$50</option>
                      <option value="pro">Pro - R$100</option>
                      <option value="elite">Elite - R$200</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-550 font-semibold mb-2">Etapa (Número)</label>
                    <input
                      type="number"
                      required
                      value={stepNumber}
                      onChange={e => setStepNumber(parseInt(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-555 font-semibold mb-2">Partida / Evento</label>
                  <input
                    type="text"
                    required
                    value={match}
                    onChange={e => setMatch(e.target.value)}
                    placeholder="E.g. PSG vs Marseille"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-zinc-555 font-semibold mb-2">Mercado</label>
                    <input
                      type="text"
                      required
                      value={market}
                      onChange={e => setMarket(e.target.value)}
                      placeholder="E.g. Ambos Marcam"
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-555 font-semibold mb-2">Odd Recomendada</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={odd}
                      onChange={e => setOdd(parseFloat(e.target.value))}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-550 font-semibold mb-2">Justificativa da Entrada</label>
                  <textarea
                    value={justification}
                    onChange={e => setJustification(e.target.value)}
                    placeholder="Justificativa rápida..."
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white h-20 resize-none"
                  />
                </div>
              </CardContent>
              <div className="p-6 border-t border-zinc-850 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-350 font-semibold rounded hover:bg-zinc-850 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded cursor-pointer">Salvar Etapa</button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddCat && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-zinc-950 border-zinc-800 text-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white">{editingCatId ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}</CardTitle>
              <CardDescription>Defina as regras e justificativas padrão para este grupo de dicas.</CardDescription>
            </CardHeader>
            <form onSubmit={handleAddCategory}>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Nome da Categoria</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    placeholder="E.g. Basquete Dupla"
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Descrição</label>
                  <textarea
                    required
                    value={catDesc}
                    onChange={e => setCatDesc(e.target.value)}
                    placeholder="Explicação sobre os critérios dessa categoria..."
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white h-20 resize-none focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 font-semibold mb-2">Regras Específicas</label>
                  <textarea
                    value={catRules}
                    onChange={e => setCatRules(e.target.value)}
                    placeholder="Regras de gestão de banca e odds recomendadas..."
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-850 rounded text-white h-20 resize-none focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </CardContent>
              <div className="p-6 border-t border-zinc-850 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddCat(false)} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold rounded hover:bg-zinc-850 cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded cursor-pointer">{editingCatId ? 'Atualizar Categoria' : 'Salvar Categoria'}</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
