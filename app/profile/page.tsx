'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase, getUserAccess } from '../../lib/supabase'
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
  is_beta: boolean
}

interface RemedySearch {
  symptom: string
  created_at: string
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return days === 1 ? '1 day ago' : `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`
  const years = Math.floor(months / 12)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [searches, setSearches] = useState<RemedySearch[]>([])
  const [isPro, setIsPro] = useState(true)
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState('')
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Edit states
  const [editName, setEditName] = useState('')
  const [editAgeRange, setEditAgeRange] = useState('')
  const [editGoals, setEditGoals] = useState<string[]>([])
  const [editDiet, setEditDiet] = useState('')
  const [editStress, setEditStress] = useState(5)
  const [editAllergies, setEditAllergies] = useState<string[]>([])
  const [editMedications, setEditMedications] = useState<string[]>([])
  const [editPregnant, setEditPregnant] = useState(false)
  const [allergyInput, setAllergyInput] = useState('')
  const [medInput, setMedInput] = useState('')
  const [editEmail, setEditEmail] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setEmail(user.email || '')
      setEditEmail(user.email || '')

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setEditName(data.name || '')
        setEditAgeRange(data.age_range || '')
        setEditGoals(data.goals || [])
        setEditDiet(data.diet || '')
        setEditStress(data.stress_level || 5)
        setEditAllergies(data.allergies || [])
        setEditMedications(data.medications || [])
        setEditPregnant(data.pregnant || false)
      }

      const { data: searchData } = await supabase
        .from('remedy_searches')
        .select('symptom, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      setSearches(searchData || [])

      const { isPro: proStatus } = await getUserAccess()
      setIsPro(proStatus)
    }
    load()
  }, [])

  async function saveSection(section: string) {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let updates: Partial<Profile> = {}
    if (section === 'name') updates = { name: editName }
    if (section === 'age') updates = { age_range: editAgeRange }
    if (section === 'goals') updates = { goals: editGoals }
    if (section === 'diet') updates = { diet: editDiet }
    if (section === 'stress') updates = { stress_level: editStress }
    if (section === 'allergies') updates = { allergies: editAllergies }
    if (section === 'medications') updates = { medications: editMedications, pregnant: editPregnant }

    await supabase.from('profiles').update(updates).eq('id', user.id)
    setProfile(p => p ? { ...p, ...updates } : p)
    setSaved(section)
    setTimeout(() => { setSaved(''); setOpenSection(null) }, 1500)
    setSaving(false)
  }

  async function saveEmail() {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ email: editEmail })
    if (error) alert(error.message)
    else { setSaved('email'); setTimeout(() => setSaved(''), 2000) }
    setSaving(false)
  }

  async function deleteAccount() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
  }

  const toggleSection = (s: string) => setOpenSection(openSection === s ? null : s)

  const sectionHeader = (key: string, label: string, value: string) => (
    <div
      onClick={() => toggleSection(key)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', background: openSection === key ? '#faf8f3' : '#fff' }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3328' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#8aad96', marginTop: 2 }}>{value}</div>
      </div>
      <div style={{ fontSize: 18, color: '#8aad96', transform: openSection === key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</div>
    </div>
  )

  const saveBtn = (key: string) => (
    <button
      onClick={() => saveSection(key)}
      disabled={saving}
      style={{ background: '#2a5c45', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
    >
      {saved === key ? '✓ Saved!' : saving ? 'Saving...' : 'Save changes'}
    </button>
  )

  const optStyle = (selected: boolean) => ({
    padding: '10px 14px', borderRadius: 10, border: selected ? '1.5px solid #3d8c6a' : '1px solid #e0d8c8',
    background: selected ? '#e8f0ea' : '#fff', color: selected ? '#2a5c45' : '#5a7a6a',
    cursor: 'pointer', fontSize: 13, fontWeight: selected ? 500 : 400, fontFamily: 'inherit'
  })

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
        <Sidebar active="My profile" isPro={isPro} />

        <main style={{ padding: '48px' }}>
          <div style={{ maxWidth: 640 }}>

            <h1 style={{ fontSize: 28, fontWeight: 500, color: '#1a3328', marginBottom: 4 }}>My profile</h1>
            <p style={{ fontSize: 14, color: '#8aad96', marginBottom: 36 }}>Manage your wellness profile and account settings.</p>

            {/* Wellness profile sections */}
            <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Wellness profile</p>

            <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>

              {/* Name */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('name', 'Name', profile?.name || '—')}
                {openSection === 'name' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{ width: '100%', border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a3328', marginBottom: 12, outline: 'none' }}
                      placeholder="Your first name"
                    />
                    {saveBtn('name')}
                  </div>
                )}
              </div>

              {/* Age range */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('age', 'Age range', profile?.age_range || '—')}
                {openSection === 'age' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {['Under 18', '18–29', '30–44', '45–59', '60+'].map(a => (
                        <button key={a} onClick={() => setEditAgeRange(a)} style={optStyle(editAgeRange === a)}>{a}</button>
                      ))}
                    </div>
                    {saveBtn('age')}
                  </div>
                )}
              </div>

              {/* Goals */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('goals', 'Wellness goals', profile?.goals?.join(', ') || '—')}
                {openSection === 'goals' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {['Better sleep', 'Reduce stress', 'More energy', 'Focus & clarity', 'Gut health', 'Pain relief', 'Hormonal balance', 'Immune support', 'Not sure'].map(g => (
                        <button key={g} onClick={() => setEditGoals(gs => gs.includes(g) ? gs.filter(x => x !== g) : [...gs, g])} style={optStyle(editGoals.includes(g))}>{g}</button>
                      ))}
                    </div>
                    {saveBtn('goals')}
                  </div>
                )}
              </div>

              {/* Diet */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('diet', 'Diet', profile?.diet || '—')}
                {openSection === 'diet' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      {['No restrictions', 'Plant-based', 'Paleo / keto', 'Gluten-free', 'Mediterranean', 'Dairy-free', 'Other'].map(d => {
                        const current = editDiet ? editDiet.split(', ').filter(Boolean) : []
                        return (
                          <button key={d} onClick={() => {
                            if (current.includes(d)) setEditDiet(current.filter(x => x !== d).join(', '))
                            else setEditDiet([...current, d].join(', '))
                          }} style={optStyle(current.includes(d))}>{d}</button>
                        )
                      })}
                    </div>
                    {saveBtn('diet')}
                  </div>
                )}
              </div>

              {/* Stress */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('stress', 'Stress level', profile?.stress_level ? `${profile.stress_level} / 10` : '—')}
                {openSection === 'stress' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 500, color: '#3d8c6a', marginBottom: 8 }}>{editStress} <span style={{ fontSize: 16, color: '#8aad96', fontWeight: 400 }}>/ 10</span></div>
                    <input type="range" min={1} max={10} step={1} value={editStress} onChange={e => setEditStress(parseInt(e.target.value))} style={{ width: '100%', marginBottom: 12, accentColor: '#3d8c6a' }} />
                    {saveBtn('stress')}
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('allergies', 'Allergies', editAllergies.length ? editAllergies.join(', ') : 'None')}
                {openSection === 'allergies' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <input
                        value={allergyInput}
                        onChange={e => setAllergyInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && allergyInput.trim()) { setEditAllergies(a => [...a, allergyInput.trim()]); setAllergyInput('') } }}
                        placeholder="Add allergy..."
                        style={{ flex: 1, border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                      />
                      <button onClick={() => { if (allergyInput.trim()) { setEditAllergies(a => [...a, allergyInput.trim()]); setAllergyInput('') } }} style={{ background: '#e8f0ea', color: '#2a5c45', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Add</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {editAllergies.map((a, i) => (
                        <span key={i} style={{ background: '#e8f0ea', color: '#2a5c45', padding: '4px 10px', borderRadius: 20, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {a}
                          <button onClick={() => setEditAllergies(al => al.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a5c45', fontSize: 14, padding: 0 }}>×</button>
                        </span>
                      ))}
                    </div>
                    {saveBtn('allergies')}
                  </div>
                )}
              </div>

              {/* Medications */}
              <div>
                {sectionHeader('medications', 'Medications', editMedications.length ? editMedications.join(', ') : 'None')}
                {openSection === 'medications' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                      <input
                        value={medInput}
                        onChange={e => setMedInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && medInput.trim()) { setEditMedications(m => [...m, medInput.trim()]); setMedInput('') } }}
                        placeholder="Add medication..."
                        style={{ flex: 1, border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                      />
                      <button onClick={() => { if (medInput.trim()) { setEditMedications(m => [...m, medInput.trim()]); setMedInput('') } }} style={{ background: '#e8f0ea', color: '#2a5c45', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Add</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {editMedications.map((m, i) => (
                        <span key={i} style={{ background: '#e8f0ea', color: '#2a5c45', padding: '4px 10px', borderRadius: 20, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {m}
                          <button onClick={() => setEditMedications(ms => ms.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a5c45', fontSize: 14, padding: 0 }}>×</button>
                        </span>
                      ))}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5a7a6a', marginBottom: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={editPregnant} onChange={e => setEditPregnant(e.target.checked)} />
                      Pregnant / nursing
                    </label>
                    {saveBtn('medications')}
                  </div>
                )}
              </div>

            </div>

            {/* Recent searches */}
            <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Recent searches</p>

            <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
              {searches.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: '#8aad96', marginBottom: 12 }}>No remedy searches yet.</p>
                  <Link href="/remedy-finder" style={{ fontSize: 13, color: '#3d8c6a', textDecoration: 'none', fontWeight: 500 }}>Find your first remedy →</Link>
                </div>
              ) : (
                searches.map((search, i) => (
                  <div
                    key={`${search.created_at}-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '16px 20px',
                      borderBottom: i < searches.length - 1 ? '0.5px solid #e0d8c8' : 'none',
                    }}
                  >
                    <p style={{ fontSize: 13, color: '#1a3328', lineHeight: 1.5, margin: 0, flex: 1 }}>{search.symptom}</p>
                    <span style={{ fontSize: 12, color: '#8aad96', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(search.created_at)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Account settings */}
            <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Account settings</p>

            <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>

              {/* Email */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('email', 'Email address', email)}
                {openSection === 'email' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <input
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      type="email"
                      style={{ width: '100%', border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a3328', marginBottom: 12, outline: 'none' }}
                      placeholder="your@email.com"
                    />
                    <p style={{ fontSize: 11, color: '#8aad96', marginBottom: 12 }}>You'll receive a confirmation email to verify the change.</p>
                    <button onClick={saveEmail} disabled={saving} style={{ background: '#2a5c45', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {saved === 'email' ? '✓ Check your email!' : 'Update email'}
                    </button>
                  </div>
                )}
              </div>

              {/* Subscription */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('subscription', 'Subscription', isPro ? 'Root Pro — $12/month' : 'Seed — Free')}
                {openSection === 'subscription' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    {isPro ? (
                      <div>
                        <p style={{ fontSize: 13, color: '#5a7a6a', marginBottom: 12 }}>You're on the Root Pro plan. You can manage your subscription, update your payment method, or cancel at any time.</p>
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/portal', { method: 'POST' })
                            const data = await res.json()
                            if (data.url) window.location.href = data.url
                          }}
                          style={{ background: '#2a5c45', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Manage subscription →
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: 13, color: '#5a7a6a', marginBottom: 12 }}>You're on the free Seed plan. Upgrade to Root Pro for unlimited remedies, hormone balancing, healing recipes, and more.</p>
                        <button
                          onClick={async () => {
                            const res = await fetch('/api/checkout', { method: 'POST' })
                            const data = await res.json()
                            if (data.url) window.location.href = data.url
                          }}
                          style={{ background: '#3d8c6a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Upgrade to Pro — $12/mo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sign out */}
              <div style={{ borderBottom: '0.5px solid #e0d8c8' }}>
                {sectionHeader('signout', 'Sign out', 'Sign out of your account')}
                {openSection === 'signout' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut()
                        window.location.href = '/'
                      }}
                      style={{ background: '#e8f0ea', color: '#2a5c45', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Delete account */}
              <div>
                {sectionHeader('delete', 'Delete account', 'Permanently delete your account and data')}
                {openSection === 'delete' && (
                  <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                    {!deleteConfirm ? (
                      <div>
                        <p style={{ fontSize: 13, color: '#5a7a6a', marginBottom: 12 }}>This will permanently delete your profile, search history, and cancel any active subscription. This cannot be undone.</p>
                        <button onClick={() => setDeleteConfirm(true)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Delete my account
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 500, marginBottom: 12 }}>Are you sure? This cannot be undone.</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={deleteAccount} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Yes, delete everything</button>
                          <button onClick={() => setDeleteConfirm(false)} style={{ background: '#f5f0e8', color: '#5a7a6a', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '0.5px solid #e0d8c8', padding: '16px 20px' }}>
                <Link href="/contact" style={{ fontSize: 13, color: '#3d8c6a', textDecoration: 'none' }}>Contact us →</Link>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  )
}