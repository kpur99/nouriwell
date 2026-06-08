'use client'
import { useState } from 'react'
import { SupplementIcon } from '../components/NouriIcons'
import Sidebar from '../components/Sidebar'

interface Supplement {
  id: string
  name: string
  dose: string
  frequency: string
  time: string
  taken: boolean
  notes: string
}

export default function Tracker() {
  const [supplements, setSupplements] = useState<Supplement[]>([
    { id: '1', name: 'Magnesium glycinate', dose: '300mg', frequency: 'daily', time: 'evening', taken: false, notes: '' },
    { id: '2', name: 'Vitamin D3', dose: '2000 IU', frequency: 'daily', time: 'morning', taken: true, notes: '' },
    { id: '3', name: 'Ashwagandha', dose: '600mg', frequency: 'daily', time: 'morning', taken: false, notes: '' },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newSupp, setNewSupp] = useState({ name: '', dose: '', frequency: 'daily', time: 'morning' })
  const [checkLoading, setCheckLoading] = useState(false)
  const [checkResult, setCheckResult] = useState('')

  function toggleTaken(id: string) {
    setSupplements(s => s.map(x => x.id === id ? { ...x, taken: !x.taken } : x))
  }

  function addSupplement() {
    if (!newSupp.name) return
    setSupplements(s => [...s, { ...newSupp, id: Date.now().toString(), taken: false, notes: '' }])
    setNewSupp({ name: '', dose: '', frequency: 'daily', time: 'morning' })
    setShowAdd(false)
  }

  function removeSupp(id: string) {
    setSupplements(s => s.filter(x => x.id !== id))
  }

  async function checkInteractions() {
    setCheckLoading(true)
    const list = supplements.map(s => `${s.name} ${s.dose}`).join(', ')
    const res = await fetch('/api/remedies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptom: `Check for interactions, contraindications, and timing recommendations for this supplement stack: ${list}. Give specific advice on what to take together, what to separate, and any concerns.`,
        profile: {}
      })
    })
    const data = await res.json()
    setCheckResult(data.intro || 'Analysis complete.')
    setCheckLoading(false)
  }

  const taken = supplements.filter(s => s.taken).length
  const total = supplements.length

  return (
    <div className="min-h-screen bg-[#f4faf7] font-sans">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
        <Sidebar active="Supplement tracker" />
        <div>
      <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
          <SupplementIcon size={16} color="#5DCAA5" /> Supplement tracker
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Your daily supplement <span className="text-[#5DCAA5]">routine</span></h1>
        <p className="text-lg text-[#7aaa94] max-w-xl mx-auto">Track what you take, when you take it, and check for interactions.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Progress */}
        <div className="bg-white border border-[#d4ede2] rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-medium text-[#0a2e22]">Today's progress</span>
            <span className="text-2xl font-medium text-[#1D9E75]">{taken}/{total}</span>
          </div>
          <div className="h-3 bg-[#f4faf7] rounded-full overflow-hidden">
            <div className="h-3 bg-[#1D9E75] rounded-full transition-all" style={{ width: total ? `${(taken/total)*100}%` : '0%' }} />
          </div>
          <p className="text-sm text-[#7aaa94] mt-2">{taken === total && total > 0 ? '🎉 All done for today!' : `${total - taken} remaining`}</p>
        </div>

        {/* Supplement list */}
        <div className="mb-6">
          {supplements.map(s => (
            <div key={s.id} className={`bg-white border rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all ${s.taken ? 'border-[#1D9E75] opacity-75' : 'border-[#d4ede2]'}`}>
              <button
                onClick={() => toggleTaken(s.id)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${s.taken ? 'bg-[#1D9E75] border-[#1D9E75]' : 'bg-white border-[#d4ede2]'}`}
              >
                {s.taken && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <div className="flex-1">
                <p className={`text-base font-medium ${s.taken ? 'line-through text-[#7aaa94]' : 'text-[#0a2e22]'}`}>{s.name}</p>
                <p className="text-sm text-[#7aaa94]">{s.dose} · {s.frequency} · {s.time}</p>
              </div>
              <button onClick={() => removeSupp(s.id)} className="text-[#aac9b8] hover:text-red-400 bg-none border-none cursor-pointer text-lg">×</button>
            </div>
          ))}
        </div>

        {/* Add supplement */}
        {showAdd ? (
          <div className="bg-white border border-[#d4ede2] rounded-2xl p-6 mb-6">
            <h3 className="text-base font-medium text-[#0a2e22] mb-4">Add supplement</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-[#7aaa94] mb-1 block">Name</label>
                <input className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]" placeholder="e.g. Ashwagandha" value={newSupp.name} onChange={e => setNewSupp(x => ({ ...x, name: e.target.value }))}/>
              </div>
              <div>
                <label className="text-xs text-[#7aaa94] mb-1 block">Dose</label>
                <input className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]" placeholder="e.g. 600mg" value={newSupp.dose} onChange={e => setNewSupp(x => ({ ...x, dose: e.target.value }))}/>
              </div>
              <div>
                <label className="text-xs text-[#7aaa94] mb-1 block">Frequency</label>
                <select className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]" value={newSupp.frequency} onChange={e => setNewSupp(x => ({ ...x, frequency: e.target.value }))}>
                  <option>daily</option><option>twice daily</option><option>weekly</option><option>as needed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#7aaa94] mb-1 block">Time of day</label>
                <select className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]" value={newSupp.time} onChange={e => setNewSupp(x => ({ ...x, time: e.target.value }))}>
                  <option>morning</option><option>afternoon</option><option>evening</option><option>with food</option><option>before bed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={addSupplement} className="flex-1 py-3 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer font-medium hover:bg-[#0F6E56]">Add supplement</button>
              <button onClick={() => setShowAdd(false)} className="px-6 py-3 bg-[#f4faf7] text-[#4a6b5e] rounded-xl border border-[#d4ede2] cursor-pointer hover:border-[#1D9E75]">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAdd(true)} className="w-full py-4 border-2 border-dashed border-[#d4ede2] rounded-2xl text-[#7aaa94] text-sm cursor-pointer bg-transparent hover:border-[#1D9E75] hover:text-[#1D9E75] transition-all mb-6">
            + Add supplement
          </button>
        )}

        {/* Interaction checker */}
        <div className="bg-[#0a2e22] rounded-2xl p-6">
          <h3 className="text-base font-medium text-white mb-2">AI interaction checker</h3>
          <p className="text-sm text-[#7aaa94] mb-4">Check your full supplement stack for conflicts, timing issues, and optimization tips.</p>
          {checkResult && <div className="bg-[#1a3a2a] rounded-xl p-4 mb-4 text-sm text-[#5DCAA5] leading-relaxed">{checkResult}</div>}
          <button onClick={checkInteractions} disabled={checkLoading || supplements.length === 0} className="w-full py-3 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer font-medium hover:bg-[#0F6E56] disabled:opacity-50 disabled:cursor-not-allowed">
            {checkLoading ? 'Checking...' : '✦ Check my supplement stack'}
          </button>
        </div>
        </div>
      </div>
    </div>
    </div>
  )
}
