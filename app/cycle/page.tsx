'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getUserAccess } from '../../lib/supabase'

const PHASES = [
  { name: 'Menstrual', days: '1–5', color: '#FAECE7', text: '#712B13', desc: 'Rest & release', emoji: '🌑' },
  { name: 'Follicular', days: '6–13', color: '#E1F5EE', text: '#085041', desc: 'Rise & prepare', emoji: '🌒' },
  { name: 'Ovulatory', days: '14–16', color: '#FAEEDA', text: '#633806', desc: 'Peak energy', emoji: '🌕' },
  { name: 'Luteal', days: '17–28', color: '#EEEDFE', text: '#3C3489', desc: 'Wind down', emoji: '🌘' },
]

interface CycleData {
  phase_description: string
  energy_level: string
  mood_tendency: string
  remedies: { name: string; emoji: string; type: string; how: string }[]
  foods: { name: string; emoji: string; why: string }[]
  practices: { name: string; emoji: string; how: string }[]
  avoid: string[]
}

export default function Cycle() {
  const [isPro, setIsPro] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [selectedPhase, setSelectedPhase] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CycleData | null>(null)

  useEffect(() => {
    async function checkAccess() {
      const { isPro } = await getUserAccess()
      setIsPro(isPro)
      setCheckingAccess(false)
    }
    checkAccess()
  }, [])

  async function getGuide() {
    if (!selectedPhase) return
    setLoading(true)
    setData(null)
    try {
      const res = await fetch('/api/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: selectedPhase, symptoms, profile: {} })
      })
      const json = await res.json()
      setData(json)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f4faf7] font-sans">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
        <Sidebar active="Cycle syncing" />
        <div>
      <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
          🌸 Cycle syncing
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Nourish your body <span className="text-[#5DCAA5]">every phase</span></h1>
        <p className="text-lg text-[#7aaa94] max-w-xl mx-auto">Get phase-specific remedies, foods, and practices tailored to where you are in your cycle.</p>
        {!isPro && <div className="inline-flex items-center gap-2 bg-[#EEEDFE] text-[#3C3489] text-xs px-3 py-1.5 rounded-full mt-4">🔒 Pro feature</div>}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Phase selector */}
        <div className="bg-white border border-[#d4ede2] rounded-2xl p-6 mb-6">
          <p className="text-sm font-medium text-[#7aaa94] uppercase tracking-widest mb-4">What phase are you in?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {PHASES.map(p => (
              <div
                key={p.name}
                onClick={() => setSelectedPhase(p.name)}
                className={`rounded-2xl p-4 cursor-pointer border-2 text-center transition-all ${selectedPhase === p.name ? 'border-[#1D9E75]' : 'border-[#d4ede2]'}`}
                style={{ background: selectedPhase === p.name ? p.color : '#fff' }}
              >
                <div className="text-2xl mb-2">{p.emoji}</div>
                <div className="text-sm font-medium text-[#0a2e22]">{p.name}</div>
                <div className="text-xs text-[#7aaa94]">Days {p.days}</div>
                <div className="text-xs mt-1" style={{ color: p.text }}>{p.desc}</div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-xs text-[#7aaa94] mb-2 block">Any current symptoms? (optional)</label>
            <textarea
              className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] resize-none focus:outline-none focus:border-[#1D9E75]"
              rows={2}
              placeholder="e.g. cramps, fatigue, mood swings, cravings..."
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
            />
          </div>

          <button
            onClick={getGuide}
            disabled={!selectedPhase || loading}
            className="w-full py-4 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer text-base font-medium hover:bg-[#0F6E56] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Building your phase guide...' : '✦ Get my phase guide'}
          </button>
        </div>

        {/* Results */}
        {data && (
          <div className="space-y-5">
            {/* Phase overview */}
            <div className="bg-white border border-[#d4ede2] rounded-2xl p-6">
              <h3 className="text-base font-medium text-[#0a2e22] mb-3">{selectedPhase} phase overview</h3>
              <p className="text-sm text-[#4a6b5e] leading-relaxed mb-4">{data.phase_description}</p>
              <div className="flex gap-3 flex-wrap">
                <span className="text-xs bg-[#E1F5EE] text-[#085041] px-3 py-1.5 rounded-full">Energy: {data.energy_level}</span>
                <span className="text-xs bg-[#FBEAF0] text-[#72243E] px-3 py-1.5 rounded-full">{data.mood_tendency}</span>
              </div>
            </div>

            {/* Remedies */}
            <div className="bg-white border border-[#d4ede2] rounded-2xl p-6">
              <h3 className="text-base font-medium text-[#0a2e22] mb-4">Recommended remedies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.remedies.map((r, i) => (
                  <div key={i} className="border border-[#d4ede2] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{r.emoji}</span>
                      <span className="text-sm font-medium text-[#0a2e22]">{r.name}</span>
                    </div>
                    <p className="text-xs text-[#4a6b5e] leading-relaxed">{r.how}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Foods */}
            <div className="bg-white border border-[#d4ede2] rounded-2xl p-6">
              <h3 className="text-base font-medium text-[#0a2e22] mb-4">Foods to focus on</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.foods.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[#f4faf7] rounded-xl">
                    <span className="text-xl">{f.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-[#0a2e22]">{f.name}</p>
                      <p className="text-xs text-[#7aaa94] leading-relaxed">{f.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practices + Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-[#d4ede2] rounded-2xl p-6">
                <h3 className="text-base font-medium text-[#0a2e22] mb-4">Practices</h3>
                {data.practices.map((p, i) => (
                  <div key={i} className="mb-3 pb-3 border-b border-[#f0f7f3] last:border-b-0 last:mb-0 last:pb-0">
                    <p className="text-sm font-medium text-[#0a2e22] mb-1">{p.emoji} {p.name}</p>
                    <p className="text-xs text-[#4a6b5e]">{p.how}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#FAECE7] border border-[#f0c4b0] rounded-2xl p-6">
                <h3 className="text-base font-medium text-[#712B13] mb-4">Avoid this phase</h3>
                {data.avoid.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2 text-sm text-[#712B13]">
                    <span>✕</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    </div>
  )
}
