'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import { CycleSyncingIcon } from '../components/NouriIcons'
import { supabase, getUserAccess } from '../../lib/supabase'

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
  const [profile, setProfile] = useState<{ name: string } | null>(null)
  const [isPro, setIsPro] = useState(true)
  const [selectedPhase, setSelectedPhase] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CycleData | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('name').eq('id', user.id).single()
        if (data) setProfile(data)
      }
      const { isPro } = await getUserAccess()
      setIsPro(isPro)
    }
    load()
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
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#faf8f3', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ height: 64, background: '#fff', borderBottom: '0.5px solid #e0d8c8', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2a5c45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
              <path d="M17 4C17 4 9 11 9 19a8 8 0 0016 0c0-8-8-15-8-15z" fill="#fff" opacity=".95"/>
              <path d="M17 12C17 12 13 16 13 20a4 4 0 008 0c0-4-4-8-4-8z" fill="#fff" opacity=".4"/>
              <path d="M17 24v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 500, color: '#1a3328', letterSpacing: '-0.3px' }}>
            Nouri<span style={{ color: '#3d8c6a' }}>well</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          {!isPro && (
            <button
              onClick={async () => {
                const res = await fetch('/api/checkout', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }}
              style={{ background: '#2a5c45', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ✦ Upgrade to Pro
            </button>
          )}
          {profile?.name && (
            <span style={{ fontSize: 13, color: '#8aad96' }}>
              <strong style={{ color: '#1a3328', fontWeight: 500 }}>{profile.name}</strong>
            </span>
          )}
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e8f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#2a5c45' }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </nav>

      <div className="layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar active="Hormone balancing" isPro={isPro} />
        <div>
        {isPro ? (
          <>
      <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
          <CycleSyncingIcon size={16} color="#5DCAA5" /> Hormone balancing
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Balance your hormones <span className="text-[#5DCAA5]">every phase</span></h1>
        <p className="text-lg text-[#7aaa94] max-w-xl mx-auto">Get phase-specific remedies, foods, and practices tailored to your hormone balancing needs.</p>
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
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '0 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#e8f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M18 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 11V7a4 4 0 018 0v4" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#1a3328', marginBottom: 12 }}>This is a Pro feature</h2>
            <p style={{ fontSize: 15, color: '#5a7a6a', maxWidth: 420, lineHeight: 1.7, marginBottom: 32 }}>
              Upgrade to Nouriwell Root Pro to unlock hormone balancing, healing recipes, resource library and unlimited AI remedies.
            </p>
            <div style={{ background: '#faf8f3', border: '0.5px solid #e0d8c8', borderRadius: 20, padding: '24px 32px', marginBottom: 32, maxWidth: 320, width: '100%' }}>
              <div style={{ fontSize: 13, color: '#8aad96', marginBottom: 4 }}>Root Pro</div>
              <div style={{ fontSize: 36, fontWeight: 500, color: '#1a3328', marginBottom: 16 }}>$12 <span style={{ fontSize: 14, fontWeight: 400, color: '#8aad96' }}>/ month</span></div>
              {['Unlimited AI remedies', 'Hormone balancing', 'Healing recipes', 'Resource library', 'Full encyclopedia'].map(f => (
                <div key={f} style={{ fontSize: 13, color: '#5a7a6a', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="#3d8c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/checkout', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }}
              style={{ background: '#2a5c45', color: '#fff', border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 16, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Upgrade to Pro — $12/mo
            </button>
            <p style={{ fontSize: 12, color: '#8aad96', marginTop: 12 }}>Cancel anytime</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
