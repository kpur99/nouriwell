'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import Sidebar from '../components/Sidebar'
import MedicalDisclaimer from '../components/MedicalDisclaimer'
import {
  HeadacheIcon, StomachAcheIcon, AnxietyIcon, BrainFogIcon,
  PoorSleepIcon, LowEnergyIcon, MusclePainIcon, BloatingIcon,
  ColdImmunityIcon, InflammationIcon, EssentialOilIcon, HerbIcon,
  SupplementIcon, PracticeIcon
} from '../components/NouriIcons'

interface Profile {
  name: string
  age_range: string
  goals: string[]
  diet: string
  stress_level: number
  allergies: string[]
  medications: string[]
}

interface Remedy {
  name: string
  type: string
  how: string
  source?: string
}

interface Results {
  intro: string
  remedies: Remedy[]
}

const AILMENTS = [
  { label: 'Headache', icon: <HeadacheIcon size={13} /> },
  { label: 'Stomach ache', icon: <StomachAcheIcon size={13} /> },
  { label: 'Anxiety', icon: <AnxietyIcon size={13} /> },
  { label: 'Poor sleep', icon: <PoorSleepIcon size={13} /> },
  { label: 'Low energy', icon: <LowEnergyIcon size={13} /> },
  { label: 'Muscle pain', icon: <MusclePainIcon size={13} /> },
  { label: 'Bloating', icon: <BloatingIcon size={13} /> },
  { label: 'Cold / immunity', icon: <ColdImmunityIcon size={13} /> },
  { label: 'Brain fog', icon: <BrainFogIcon size={13} /> },
  { label: 'Inflammation', icon: <InflammationIcon size={13} /> },
]

const typeStyle: Record<string, { bg: string; color: string }> = {
  'essential oil': { bg: 'rgba(250,238,218,0.25)', color: '#f0c4a8' },
  herb: { bg: 'rgba(232,240,234,0.2)', color: '#a8d4be' },
  supplement: { bg: 'rgba(238,237,254,0.2)', color: '#d4c8f5' },
  food: { bg: 'rgba(250,236,231,0.2)', color: '#f0b8a8' },
  practice: { bg: 'rgba(251,234,240,0.2)', color: '#f0b8c8' },
}

const typeIconColor: Record<string, string> = {
  'essential oil': '#f0c4a8',
  herb: '#a8d4be',
  supplement: '#d4c8f5',
  food: '#f0b8a8',
  practice: '#f0b8c8',
}

function RemedyIcon({ type, size = 16 }: { type: string; size?: number }) {
  const color = typeIconColor[type] || '#a8d4be'
  if (type === 'essential oil') return <EssentialOilIcon size={size} color={color} />
  if (type === 'herb') return <HerbIcon size={size} color={color} />
  if (type === 'supplement') return <SupplementIcon size={size} color={color} />
  if (type === 'practice') return <PracticeIcon size={size} color={color} />
  return <HerbIcon size={size} color={color} />
}

export default function RemedyFinder() {
  const [searchCount, setSearchCount] = useState(0)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isPro, setIsPro] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState('')
  const [remedyCount, setRemedyCount] = useState(6)
  const prevRemedyCountRef = useRef(6)
  const lastQueryRef = useRef('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          setSearchCount(data?.remedy_searches_count || 0)
        }
        const { data: profile } = await supabase.from('profiles').select('is_beta').eq('id', user.id).single()
        setIsPro(profile?.is_beta === true)
      }
    }
    load()
  }, [])

  function toggleChip(label: string) {
    setSelected(s => s.includes(label) ? s.filter(x => x !== label) : [...s, label])
  }

  async function findRemedies() {
    const query = selected.length
      ? selected.join(', ') + (symptom ? '. ' + symptom : '')
      : symptom
    if (!query.trim()) return
    const symptomPayload = query + '. Severity: ' + severity
    lastQueryRef.current = symptomPayload
    setLoading(true)
    setResults(null)
    setError('')
    setRemedyCount(6)
    prevRemedyCountRef.current = 6
    try {
      const res = await fetch('/api/remedies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: symptomPayload, profile: profile || {}, remedyCount: 6 })
      })
      const data = await res.json()
      if (data.error === 'limit_reached') {
        setError('limit_reached')
      } else if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
        setSearchCount(c => c + 1)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  useEffect(() => {
    async function fetchMore() {
      if (remedyCount <= prevRemedyCountRef.current || !results) return
      const additional = remedyCount - prevRemedyCountRef.current
      prevRemedyCountRef.current = remedyCount
      setLoadingMore(true)
      try {
        const res = await fetch('/api/remedies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            symptom: lastQueryRef.current,
            profile: profile || {},
            remedyCount: additional,
            existingRemedies: results.remedies.map(r => r.name),
          })
        })
        const data = await res.json()
        if (!data.error && data.remedies?.length) {
          setResults(prev => prev ? { ...prev, remedies: [...prev.remedies, ...data.remedies] } : prev)
        }
      } catch {
        // keep existing results on failure
      }
      setLoadingMore(false)
    }
    fetchMore()
  }, [remedyCount])

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

      {/* Hero */}
      <div style={{ background: '#1e3d2e', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(61,140,106,0.2)', color: '#7dc9a3', fontSize: 13, padding: '7px 18px', borderRadius: 20, marginBottom: 16, border: '0.5px solid rgba(125,201,163,0.3)' }}>
          <HerbIcon size={14} color="#7dc9a3" /> AI Remedy Finder
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 500, color: '#fff', marginBottom: 12, letterSpacing: '-0.3px' }}>
          What are you <span style={{ color: '#7dc9a3', fontStyle: 'italic' }}>experiencing?</span>
        </h1>
        <p style={{ fontSize: 16, color: '#8aad96', maxWidth: 500, margin: '0 auto', lineHeight: 1.7, fontWeight: 300 }}>
          Describe your symptoms and get specific essential oils, herbs, and supplements tailored to your profile.
        </p>
      </div>

      <div className="layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar active="Remedy finder" isPro={isPro} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', alignItems: 'start' }}>

          {/* Remedy finder */}
          <div style={{ padding: 32, borderRight: '0.5px solid #e0d8c8', minHeight: 'calc(100vh - 64px)' }}>

            <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Quick select</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
              {AILMENTS.map(a => (
                <button
                  key={a.label}
                  onClick={() => toggleChip(a.label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                    borderRadius: 20, border: selected.includes(a.label) ? '1px solid #3d8c6a' : '1px solid #e0d8c8',
                    background: selected.includes(a.label) ? '#e8f0ea' : '#fff',
                    color: selected.includes(a.label) ? '#2a5c45' : '#5a7a6a',
                    fontWeight: selected.includes(a.label) ? 500 : 400,
                    fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s'
                  }}
                >
                  {a.icon} {a.label}
                </button>
              ))}
            </div>

            <div style={{ background: '#fff', border: '1.5px solid #e0d8c8', borderRadius: 14, padding: 14, marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#5a7a6a', fontWeight: 500, display: 'block', marginBottom: 6 }}>Or describe in your own words</label>
              <textarea
                value={symptom}
                onChange={e => setSymptom(e.target.value)}
                placeholder="e.g. I've had a tension headache at the base of my skull since this morning..."
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', color: '#1a3328', resize: 'none', minHeight: 64, background: 'transparent', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, paddingTop: 10, borderTop: '0.5px solid #e0d8c8' }}>
                <span style={{ fontSize: 11, color: '#5a7a6a', fontWeight: 500 }}>Severity:</span>
                {['Mild', 'Moderate', 'Severe'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSeverity(s.toLowerCase())}
                    style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                      border: severity === s.toLowerCase() ? '1px solid #3d8c6a' : '1px solid #e0d8c8',
                      background: severity === s.toLowerCase() ? '#e8f0ea' : '#fff',
                      color: severity === s.toLowerCase() ? '#2a5c45' : '#5a7a6a',
                      fontWeight: severity === s.toLowerCase() ? 500 : 400
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>

            <MedicalDisclaimer style={{ marginBottom: 14 }} />

            <button
              onClick={findRemedies}
              disabled={loading || (!selected.length && !symptom.trim())}
              style={{
                width: '100%', background: loading ? '#7aaa94' : '#2a5c45', color: '#fff',
                border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24
              }}
            >
              <HerbIcon size={15} color="#fff" />
              {loading ? 'Finding remedies...' : 'Find my holistic remedies'}
            </button>

            {error === 'limit_reached' ? (
              <div style={{ background: '#1e3d2e', borderRadius: 16, padding: 28, textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: '#fff', marginBottom: 8 }}>Monthly limit reached</h3>
                <p style={{ fontSize: 13, color: '#a8d4be', lineHeight: 1.6, marginBottom: 20 }}>
                  You've used all 3 free remedy searches this month. Upgrade to Pro for unlimited searches, plus cycle syncing, healing recipes, and more.
                </p>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/checkout', { method: 'POST' })
                    const data = await res.json()
                    if (data.url) window.location.href = data.url
                  }}
                  style={{ background: '#3d8c6a', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Upgrade to Pro — $12/mo
                </button>
              </div>
            ) : error ? (
              <p style={{ color: '#E24B4A', fontSize: 13, marginBottom: 16 }}>{error}</p>
            ) : null}

            {loading && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ background: '#2a5c45', borderRadius: 12, padding: 14, minHeight: 120, opacity: 0.5 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.1)', marginBottom: 8 }} />
                    <div style={{ width: '70%', height: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 6, marginBottom: 6 }} />
                    <div style={{ width: '40%', height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 6, marginBottom: 4 }} />
                    <div style={{ width: '80%', height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 6 }} />
                  </div>
                ))}
              </div>
            )}

            {results && (
              <>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Recommended for you
                  <div style={{ flex: 1, height: '0.5px', background: '#e0d8c8' }} />
                </div>
                <p style={{ fontSize: 13, color: '#5a7a6a', fontWeight: 500, lineHeight: 1.65, marginBottom: 14 }}>{results.intro}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {results.remedies.map((r, i) => (
                    <div key={i} style={{ background: '#2a5c45', borderRadius: 12, padding: 14 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <RemedyIcon type={r.type} size={16} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', marginBottom: 3 }}>{r.name}</div>
                      <span style={{ fontSize: 10, display: 'inline-block', padding: '2px 6px', borderRadius: 6, marginBottom: 5, background: typeStyle[r.type]?.bg || 'rgba(232,240,234,0.2)', color: typeStyle[r.type]?.color || '#a8d4be' }}>{r.type}</span>
                      <div style={{ fontSize: 11, color: '#a8d4be', lineHeight: 1.5 }}>{r.how}</div>
                      {isPro && r.source && (
                        <div style={{ fontSize: 10, color: '#7dc9a3', marginTop: 6, paddingTop: 6, borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                          📚 {r.source}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {isPro ? (
                  <button
                    onClick={() => setRemedyCount(c => c + 4)}
                    disabled={loadingMore}
                    style={{ width: '100%', background: '#fff', border: '1.5px solid #e0d8c8', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 500, color: '#2a5c45', cursor: loadingMore ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 16, opacity: loadingMore ? 0.7 : 1 }}
                  >
                    {loadingMore ? 'Loading more remedies...' : 'Show more remedies →'}
                  </button>
                ) : (
                  <div style={{ background: '#1e3d2e', borderRadius: 16, padding: 24, textAlign: 'center', marginTop: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 500, color: '#fff', marginBottom: 8 }}>Want more remedies?</h3>
                    <p style={{ fontSize: 13, color: '#a8d4be', lineHeight: 1.6, marginBottom: 16 }}>
                      Upgrade to Pro for unlimited remedies per search, plus hormone balancing, healing recipes, and more.
                    </p>
                    <button
                      onClick={async () => {
                        const res = await fetch('/api/checkout', { method: 'POST' })
                        const data = await res.json()
                        if (data.url) window.location.href = data.url
                      }}
                      style={{ background: '#3d8c6a', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Upgrade to Pro — $12/mo
                    </button>
                  </div>
                )}
                <MedicalDisclaimer style={{ marginTop: 16 }} />
              </>
            )}
          </div>

          {/* Right panel */}
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!isPro && (
              <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 14, padding: '14px 16px', marginBottom: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a3328', marginBottom: 8 }}>Free searches</div>
                <div style={{ height: 6, background: '#e8f0ea', borderRadius: 10, overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: 6, background: '#3d8c6a', borderRadius: 10, width: `${(searchCount / 3) * 100}%`, transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: 11, color: '#8aad96' }}>{searchCount} of 3 used this month</div>
              </div>
            )}
            <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #e0d8c8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1a3328' }}>Your profile</span>
                <Link href="/onboarding" style={{ fontSize: 11, color: '#3d8c6a', textDecoration: 'none' }}>Edit</Link>
              </div>
              <div style={{ padding: '12px 14px' }}>
                {profile ? (
                  <>
                    {[
                      { key: 'Name', val: profile.name || '—' },
                      { key: 'Age range', val: profile.age_range || '—' },
                      { key: 'Goals', val: profile.goals?.join(', ') || '—' },
                      { key: 'Diet', val: profile.diet || '—' },
                      { key: 'Stress', val: profile.stress_level ? `${profile.stress_level} / 10` : '—' },
                      { key: 'Allergies', val: profile.allergies?.length ? profile.allergies.join(', ') : 'None' },
                      { key: 'Medications', val: profile.medications?.length ? profile.medications.join(', ') : 'None' },
                    ].map(row => (
                      <div key={row.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '0.5px solid #f5f0e8', fontSize: 11 }}>
                        <span style={{ color: '#5a7a6a', fontWeight: 500 }}>{row.key}</span>
                        <span style={{ color: '#1a3328', fontWeight: 500, textAlign: 'right', maxWidth: 120 }}>{row.val}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <p style={{ fontSize: 12, color: '#8aad96', textAlign: 'center', padding: '8px 0' }}>Loading profile...</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}