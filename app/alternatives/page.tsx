'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import MedicalDisclaimer from '../components/MedicalDisclaimer'
import { supabase, getUserAccess } from '../../lib/supabase'

interface Alternative {
  name: string
  type: string
  instead_of: string
  why: string
  how: string
  source: string
}

interface Results {
  intro: string
  alternatives: Alternative[]
}

const QUICK_PICKS = ['Antibiotics', 'Ibuprofen', 'Melatonin', 'Antidepressants', 'Antacids', 'Sleep aids']

const typeStyle: Record<string, { bg: string; color: string }> = {
  herb: { bg: 'rgba(232,240,234,0.2)', color: '#a8d4be' },
  supplement: { bg: 'rgba(238,237,254,0.2)', color: '#d4c8f5' },
  'essential oil': { bg: 'rgba(250,238,218,0.25)', color: '#f0c4a8' },
  practice: { bg: 'rgba(251,234,240,0.2)', color: '#f0b8c8' },
  food: { bg: 'rgba(250,236,231,0.2)', color: '#f0b8a8' },
}

export default function Alternatives() {
  const [profile, setProfile] = useState<{ name: string } | null>(null)
  const [isPro, setIsPro] = useState(true)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState('')

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

  async function findAlternatives() {
    if (!input.trim()) return
    setLoading(true)
    setResults(null)
    setError('')
    try {
      const res = await fetch('/api/alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
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
        <Sidebar active="Natural Alternatives" isPro={isPro} />
        <div>
        {isPro ? (
          <>
            <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
              <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16l4-4-4-4" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8l-4 4 4 4" stroke="#5DCAA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Natural Alternatives
              </div>
              <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Natural <span className="text-[#5DCAA5]">Alternatives</span></h1>
              <p className="text-lg text-[#7aaa94] max-w-xl mx-auto">Discover holistic alternatives to conventional treatments</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">
              <MedicalDisclaimer style={{ marginBottom: 24 }} />

              <div className="bg-white border border-[#d4ede2] rounded-2xl p-6 mb-8">
                <p className="text-sm font-medium text-[#7aaa94] uppercase tracking-widest mb-4">What conventional treatment are you looking to replace?</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {QUICK_PICKS.map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setInput(q)}
                      className={`text-sm px-4 py-2 rounded-full cursor-pointer border transition-all ${input === q ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041] font-medium' : 'border-[#d4ede2] bg-white text-[#4a6b5e]'}`}
                    >{q}</button>
                  ))}
                </div>

                <input
                  className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75] mb-4"
                  placeholder="e.g. antibiotics, ibuprofen, melatonin, antidepressants..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && findAlternatives()}
                />

                <button
                  onClick={findAlternatives}
                  disabled={!input.trim() || loading}
                  className="w-full py-4 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer text-base font-medium hover:bg-[#0F6E56] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Finding alternatives...' : '✦ Find alternatives'}
                </button>

                {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
              </div>

              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-[#2a5c45] rounded-2xl p-5 min-h-[160px] opacity-50 animate-pulse" />
                  ))}
                </div>
              )}

              {results && (
                <div>
                  <p className="text-sm text-[#5a7a6a] leading-relaxed mb-6">{results.intro}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.alternatives.map((alt, i) => (
                      <div key={i} className="bg-[#2a5c45] rounded-2xl p-5">
                        <p className="text-xs text-[#7dc9a3] font-medium mb-2 uppercase tracking-wide">
                          Instead of {alt.instead_of || input}, try
                        </p>
                        <h3 className="text-base font-medium text-white mb-2">{alt.name}</h3>
                        <span style={{
                          fontSize: 10, display: 'inline-block', padding: '2px 8px', borderRadius: 6, marginBottom: 10,
                          background: typeStyle[alt.type]?.bg || 'rgba(232,240,234,0.2)',
                          color: typeStyle[alt.type]?.color || '#a8d4be',
                        }}>{alt.type}</span>
                        <p className="text-xs text-[#a8d4be] leading-relaxed mb-3"><strong style={{ color: '#fff' }}>Why:</strong> {alt.why}</p>
                        <p className="text-xs text-[#a8d4be] leading-relaxed mb-3"><strong style={{ color: '#fff' }}>How to use:</strong> {alt.how}</p>
                        {alt.source && (
                          <div style={{ fontSize: 10, color: '#7dc9a3', marginTop: 8, paddingTop: 8, borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                            📚 {alt.source}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <MedicalDisclaimer style={{ marginTop: 24 }} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '0 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#e8f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M7 16l4-4-4-4" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8l-4 4 4 4" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#1a3328', marginBottom: 12 }}>This is a Pro feature</h2>
            <p style={{ fontSize: 15, color: '#5a7a6a', maxWidth: 420, lineHeight: 1.7, marginBottom: 32 }}>
              Upgrade to Nouriwell Root Pro to unlock Natural Alternatives, hormone balancing, healing recipes, and more.
            </p>
            <div style={{ background: '#faf8f3', border: '0.5px solid #e0d8c8', borderRadius: 20, padding: '24px 32px', marginBottom: 32, maxWidth: 320, width: '100%' }}>
              <div style={{ fontSize: 13, color: '#8aad96', marginBottom: 4 }}>Root Pro</div>
              <div style={{ fontSize: 36, fontWeight: 500, color: '#1a3328', marginBottom: 16 }}>$12 <span style={{ fontSize: 14, fontWeight: 400, color: '#8aad96' }}>/ month</span></div>
              {['Unlimited AI remedies', 'Natural alternatives', 'Hormone balancing', 'Healing recipes', 'Resource library'].map(f => (
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
