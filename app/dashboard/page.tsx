'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, getUserAccess } from '../../lib/supabase'
import {
  HeadacheIcon, StomachAcheIcon, AnxietyIcon, BrainFogIcon,
  PoorSleepIcon, LowEnergyIcon, MusclePainIcon, BloatingIcon,
  ColdImmunityIcon, InflammationIcon, EssentialOilIcon, HerbIcon,
  SupplementIcon, PracticeIcon
} from '../components/NouriIcons'
import Sidebar from '../components/Sidebar'

interface Profile {
  name: string
  age_range: string
  goals: string[]
  diet: string
  stress_level: number
  allergies: string[]
  medications: string[]
  pregnant: boolean
}

interface Remedy {
  name: string
  emoji: string
  type: string
  how: string
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

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [symptom, setSymptom] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  const [error, setError] = useState('')
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === 'true') {
      // Refresh the page to reload Pro status after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }
  }, [])

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      const { isPro: proStatus } = await getUserAccess()
      setIsPro(proStatus)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) setProfile(data)
      }
    }
    loadProfile()
  }, [])

  function toggleChip(label: string) {
    setSelected(s => s.includes(label) ? s.filter(x => x !== label) : [...s, label])
  }

  async function findRemedies() {
    const query = selected.length
      ? selected.join(', ') + (symptom ? '. ' + symptom : '')
      : symptom
    if (!query.trim()) return
    setLoading(true)
    setResults(null)
    setError('')
    try {
      const res = await fetch('/api/remedies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptom: query + '. Severity: ' + severity, profile: profile || {} })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResults(data)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#faf8f3', minHeight: '100vh' }}>

      {/* Top nav */}
      <nav style={{ height: 64, background: '#fff', borderBottom: '0.5px solid #e0d8c8', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2a5c45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C12 3 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 3 12 3Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 500, color: '#1a3328', letterSpacing: '-0.3px' }}>
            Nouri<span style={{ color: '#3d8c6a' }}>well</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          {profile?.name && (
            <span style={{ fontSize: 13, color: '#8aad96' }}>
              Good morning, <strong style={{ color: '#1a3328', fontWeight: 500 }}>{profile.name}</strong>
            </span>
          )}
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e8f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#2a5c45' }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 64px)' }}>

        <Sidebar active="Remedy finder" isPro={isPro} />

        {/* Main content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', alignItems: 'start' }}>

          {/* Remedy finder */}
          <div style={{ padding: 32, borderRight: '0.5px solid #e0d8c8', minHeight: 'calc(100vh - 64px)' }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 500, color: '#1a3328', marginBottom: 4 }}>What are you experiencing?</h1>
              <p style={{ fontSize: 13, color: '#5a7a6a', fontWeight: 500, lineHeight: 1.5 }}>Select a concern or describe your symptoms — recommendations are tailored to your profile.</p>
            </div>

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

            {error && <p style={{ color: '#E24B4A', fontSize: 13, marginBottom: 16 }}>{error}</p>}

            {/* Skeletons */}
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
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: '#8aad96', marginTop: 16, lineHeight: 1.6 }}>Not medical advice. Always consult a healthcare provider for ongoing or serious symptoms.</p>
              </>
            )}
          </div>

          {/* Right panel */}
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Profile */}
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

            {/* Free features */}
            <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #e0d8c8' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1a3328' }}>Free features</span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                {[
                  { name: 'Supplement tracker', desc: 'Log your daily stack', href: '/tracker', bg: '#e8f0ea', icon: <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><rect x="4" y="3" width="16" height="18" rx="3" stroke="#3d8c6a" strokeWidth="1.8"/><path d="M8 8h8M8 12h5" stroke="#3d8c6a" strokeWidth="1.6" strokeLinecap="round"/><path d="M7 16l1 1 2-2" stroke="#3d8c6a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                  { name: 'Encyclopedia', desc: 'Look up any herb or supplement', href: '/encyclopedia', bg: '#e8f0ea', icon: <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M12 3L4 6v7c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3z" stroke="#3d8c6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4" stroke="#3d8c6a" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="15" r="1" fill="#3d8c6a"/></svg> },
                ].map(f => (
                  <Link key={f.name} href={f.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid #f5f0e8' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#1a3328' }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: '#5a7a6a', fontWeight: 500, marginTop: 1 }}>{f.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: '#8aad96', fontSize: 14 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent searches */}
            <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '0.5px solid #e0d8c8' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1a3328' }}>Recent searches</span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                {results ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 11 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3d8c6a', flexShrink: 0 }} />
                    <span style={{ color: '#1a3328', fontWeight: 500, flex: 1 }}>{selected.length ? selected.join(', ') : symptom.slice(0, 30)}</span>
                    <span style={{ color: '#5a7a6a', fontWeight: 500 }}>Just now</span>
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: '#8aad96', textAlign: 'center', padding: '8px 0' }}>No searches yet</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}