'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, getUserAccess } from '../../lib/supabase'
import { HerbIcon } from '../components/NouriIcons'
import Sidebar from '../components/Sidebar'
import MedicalDisclaimer from '../components/MedicalDisclaimer'

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

const lockIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M18 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11V7a4 4 0 018 0v4" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [searchCount, setSearchCount] = useState(0)
  const [isPro, setIsPro] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) {
          setProfile(data)
          setSearchCount(data?.remedy_searches_count || 0)
        }
      }
      const { isPro: proStatus } = await getUserAccess()
      setIsPro(proStatus)
    }
    load()
  }, [])

  const freeTools = [
    {
      href: '/remedy-finder',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="10" r="6" stroke="#2a5c45" strokeWidth="2"/><path d="M14.5 14.5L20 20" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round"/><path d="M10 13V8" stroke="#2a5c45" strokeWidth="1.8" strokeLinecap="round"/><path d="M10 10C8 10 7 8.5 7 7C9 7 10 8.5 10 10Z" stroke="#2a5c45" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 10C12 10 13 8.5 13 7C11 7 10 8.5 10 10Z" stroke="#2a5c45" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
      iconBg: '#e8f0ea',
      title: 'Find a remedy',
      desc: 'Describe your symptoms and get personalized oils, herbs, and supplements'
    },
    {
      href: '/tracker',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="3" stroke="#2a5c45" strokeWidth="2"/><path d="M8 8h8M8 12h5" stroke="#2a5c45" strokeWidth="1.8" strokeLinecap="round"/><path d="M7 16l1 1 2-2" stroke="#2a5c45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      iconBg: '#e8f0ea',
      title: 'Log supplements',
      desc: 'Track today\'s supplements and check for interactions'
    },
    {
      href: '/encyclopedia',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 6v7c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3z" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4" stroke="#2a5c45" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="15" r="1" fill="#2a5c45"/></svg>,
      iconBg: '#e8f0ea',
      title: 'Look something up',
      desc: 'Search the holistic encyclopedia for any herb or supplement'
    },
  ]

  const proTools = [
    {
      href: '/cycle',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 018-8" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round"/><path d="M20 12a8 8 0 01-8 8" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round"/><path d="M12 4V2M12 4L10 6M12 4L14 6" stroke="#a8d4be" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="2" stroke="#a8d4be" strokeWidth="1.6"/></svg>,
      iconBg: 'rgba(255,255,255,0.1)',
      title: 'Hormone balancing',
      desc: 'Phase-specific remedies, foods, and practices'
    },
    {
      href: '/recipes',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 10C5 14 8 17 12 17C16 17 19 14 19 10" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 10h18" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round"/><path d="M9 20h6" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round"/><path d="M12 20v-3" stroke="#a8d4be" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 7V5" stroke="#a8d4be" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 5C10 5 9 3.5 9 2C11 2 12 3.5 12 5Z" stroke="#a8d4be" strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 5C14 5 15 3.5 15 2C13 2 12 3.5 12 5Z" stroke="#a8d4be" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
      iconBg: 'rgba(255,255,255,0.1)',
      title: 'Healing recipes',
      desc: 'Anti-inflammatory meals built around your goals'
    },
    {
      href: '/alternatives',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 16V8M7 8L4 11M7 8L10 11" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 8v8M17 16L14 13M17 16L20 13" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      iconBg: 'rgba(255,255,255,0.1)',
      title: 'Natural Alternatives',
      desc: 'Swap conventional treatments for holistic options'
    },
    {
      href: '/library',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19V6a2 2 0 012-2h14v13" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 002 2h14" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 012-2h14" stroke="#a8d4be" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 4v7l-2-1.5L11 11V4" stroke="#a8d4be" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      iconBg: 'rgba(255,255,255,0.1)',
      title: 'Resource library',
      desc: 'Curated podcasts, books, and videos'
    },
  ]

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
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
          {isPro && (
            <button
              onClick={async () => {
                const res = await fetch('/api/portal', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
              }}
              style={{ fontSize: 13, color: '#5a7a6a', padding: '7px 16px', borderRadius: 20, cursor: 'pointer', background: 'none', border: '0.5px solid #e0d8c8', fontFamily: 'inherit' }}
            >
              Manage subscription
            </button>
          )}
          {profile?.name && (
            <span style={{ fontSize: 13, color: '#8aad96' }}>
              {greeting()}, <strong style={{ color: '#1a3328', fontWeight: 500 }}>{profile.name}</strong>
            </span>
          )}
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#e8f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#2a5c45' }}>
            {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </nav>

      <div className="layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar active="Dashboard" isPro={isPro} />

        <main style={{ padding: '48px 48px' }}>

          {/* Welcome */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 36, fontWeight: 400, color: '#1a3328', marginBottom: 8, letterSpacing: '-0.3px', fontStyle: 'italic' }}>
              {greeting()}, <span style={{ color: '#3d8c6a' }}>{profile?.name || 'there'}</span>
            </h1>
            <p style={{ fontSize: 15, color: '#5a7a6a' }}>Your personalized holistic wellness hub. What would you like to work on today?</p>
          </div>

          {/* Usage bar — only for free users */}
          {!isPro && (
            <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 14, padding: '16px 20px', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a3328', marginBottom: 2 }}>Free remedy searches</div>
                <div style={{ fontSize: 11, color: '#8aad96' }}>{searchCount} of 3 used this month</div>
                <div style={{ marginTop: 8, height: 6, background: '#e8f0ea', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: 6, background: '#3d8c6a', borderRadius: 10, width: `${(searchCount / 3) * 100}%` }} />
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#1a3328', whiteSpace: 'nowrap' }}>{searchCount} <span style={{ fontSize: 12, fontWeight: 400, color: '#8aad96' }}>/ 3</span></div>
              <button
                onClick={async () => {
                  const res = await fetch('/api/checkout', { method: 'POST' })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }}
                style={{ background: '#2a5c45', color: '#fff', border: 'none', borderRadius: 20, padding: '7px 14px', fontSize: 11, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                Upgrade for unlimited →
              </button>
            </div>
          )}

          {/* Free tools */}
          <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Where would you like to start?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {freeTools.map(t => (
              <Link key={t.title} href={t.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#2a5c45', borderRadius: 16, padding: 22, cursor: 'pointer', height: '100%', transition: 'background 0.15s' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    {t.icon}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: '#a8d4be', lineHeight: 1.5 }}>{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pro tools */}
          <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Pro features</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
            {proTools.map(t => (
              <Link key={t.title} href={t.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: isPro ? '#2a5c45' : '#1e3d2e', borderRadius: 16, padding: 22, cursor: isPro ? 'pointer' : 'default', height: '100%', opacity: isPro ? 1 : 0.6, position: 'relative' }}>
                  {!isPro && (
                    <div style={{ position: 'absolute', top: 14, right: 14 }}>{lockIcon}</div>
                  )}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    {t.icon}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: '#a8d4be', lineHeight: 1.5 }}>{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Profile summary */}
          {profile && (
            <>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Your wellness profile</p>
              <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a3328' }}>Personalized to you</span>
                  <Link href="/onboarding" style={{ fontSize: 11, color: '#3d8c6a', textDecoration: 'none' }}>Edit profile →</Link>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {profile.age_range && <span style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>Age {profile.age_range}</span>}
                  {profile.stress_level && <span style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>Stress level {profile.stress_level}/10</span>}
                  {profile.diet && <span style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>{profile.diet}</span>}
                  {profile.goals?.map(g => <span key={g} style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>Goal: {g}</span>)}
                  {profile.allergies?.length ? profile.allergies.map(a => <span key={a} style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>Allergy: {a}</span>) : <span style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>No allergies</span>}
                  {profile.medications?.length ? profile.medications.map(m => <span key={m} style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>Medication: {m}</span>) : <span style={{ fontSize: 12, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '5px 12px', borderRadius: 20 }}>No medications</span>}
                </div>
              </div>
            </>
          )}

          <MedicalDisclaimer compact style={{ marginTop: 40 }} />
        </main>
      </div>
    </div>
  )
}