'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import MedicalDisclaimer from '../components/MedicalDisclaimer'
import { supabase, getUserAccess } from '../../lib/supabase'

interface Ingredient {
  item: string
  amount: string
}

interface Recipe {
  name: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  safety_notes: string
  shelf_life: string
  storage: string
}

const QUICK_PICKS = [
  'Sunscreen',
  'Bug spray',
  'Cleaning products',
  'Face cream',
  'Deodorant',
  'Toothpaste',
  'Hand sanitizer',
  'Lip balm',
  'Body butter',
  'Baby formula',
]

const homeIcon = (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12h6v10" stroke="#5DCAA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function NaturalLiving() {
  const [profile, setProfile] = useState<{ name: string } | null>(null)
  const [isPro, setIsPro] = useState(true)
  const [request, setRequest] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
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

  async function generateRecipe() {
    if (!request.trim()) return
    setLoading(true)
    setRecipe(null)
    setError('')
    try {
      const res = await fetch('/api/natural-living', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setRecipe(data)
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
        <Sidebar active="Natural Living" isPro={isPro} />
        <div>
        {isPro ? (
          <>
            <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
              <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
                {homeIcon}
                Natural Living
              </div>
              <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Natural <span className="text-[#5DCAA5]">Living</span></h1>
              <p className="text-lg text-[#7aaa94] max-w-xl mx-auto">DIY natural recipes for sunscreen, cleaners, body care, and more</p>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">
              <MedicalDisclaimer style={{ marginBottom: 24 }} />

              <div className="bg-white border border-[#d4ede2] rounded-2xl p-6 mb-8">
                <p className="text-sm font-medium text-[#7aaa94] uppercase tracking-widest mb-4">What would you like to make?</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {QUICK_PICKS.map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setRequest(q)}
                      className={`text-sm px-4 py-2 rounded-full cursor-pointer border transition-all ${request === q ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041] font-medium' : 'border-[#d4ede2] bg-white text-[#4a6b5e]'}`}
                    >{q}</button>
                  ))}
                </div>

                <input
                  className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75] mb-4"
                  placeholder="Or describe your own DIY recipe request..."
                  value={request}
                  onChange={e => setRequest(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateRecipe()}
                />

                <button
                  onClick={generateRecipe}
                  disabled={!request.trim() || loading}
                  className="w-full py-4 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer text-base font-medium hover:bg-[#0F6E56] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating recipe...' : '✦ Generate recipe'}
                </button>

                {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
              </div>

              {loading && (
                <div className="bg-white border border-[#d4ede2] rounded-2xl p-8 animate-pulse">
                  <div className="h-6 bg-[#e8f0ea] rounded-lg w-2/3 mb-4" />
                  <div className="h-4 bg-[#e8f0ea] rounded-lg w-full mb-2" />
                  <div className="h-4 bg-[#e8f0ea] rounded-lg w-5/6 mb-6" />
                  <div className="h-32 bg-[#e8f0ea] rounded-lg" />
                </div>
              )}

              {recipe && (
                <div className="bg-white border border-[#d4ede2] rounded-2xl p-8">
                  <h2 className="text-2xl font-medium text-[#0a2e22] mb-3">{recipe.name}</h2>
                  <p className="text-sm text-[#4a6b5e] leading-relaxed mb-6">{recipe.description}</p>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[#0a2e22] mb-3">Ingredients</h3>
                    <div className="space-y-2">
                      {recipe.ingredients?.map((ing, i) => (
                        <div key={i} className="flex justify-between gap-4 py-2 border-b border-[#f0f7f3] last:border-b-0">
                          <span className="text-sm text-[#4a6b5e]">{ing.item}</span>
                          <span className="text-sm text-[#085041] font-medium whitespace-nowrap">{ing.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[#0a2e22] mb-3">Instructions</h3>
                    {recipe.instructions?.map((step, i) => (
                      <div key={i} className="flex gap-3 mb-3">
                        <span className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#085041] text-xs flex items-center justify-center flex-shrink-0 font-medium">{i + 1}</span>
                        <p className="text-sm text-[#4a6b5e] leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#FAECE7] border border-[#f0c4b0] rounded-xl p-4">
                      <p className="text-xs font-medium text-[#712B13] mb-1">Safety notes</p>
                      <p className="text-xs text-[#712B13] leading-relaxed">{recipe.safety_notes}</p>
                    </div>
                    <div className="bg-[#E1F5EE] border border-[#b5d9c9] rounded-xl p-4">
                      <p className="text-xs font-medium text-[#085041] mb-1">Shelf life & storage</p>
                      <p className="text-xs text-[#4a6b5e] leading-relaxed mb-2"><strong>Shelf life:</strong> {recipe.shelf_life}</p>
                      <p className="text-xs text-[#4a6b5e] leading-relaxed"><strong>Storage:</strong> {recipe.storage}</p>
                    </div>
                  </div>

                  <MedicalDisclaimer />
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '0 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#e8f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#2a5c45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="#2a5c45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 500, color: '#1a3328', marginBottom: 12 }}>This is a Pro feature</h2>
            <p style={{ fontSize: 15, color: '#5a7a6a', maxWidth: 420, lineHeight: 1.7, marginBottom: 32 }}>
              Upgrade to Nouriwell Root Pro to unlock Natural Living, hormone balancing, healing recipes, and more.
            </p>
            <div style={{ background: '#faf8f3', border: '0.5px solid #e0d8c8', borderRadius: 20, padding: '24px 32px', marginBottom: 32, maxWidth: 320, width: '100%' }}>
              <div style={{ fontSize: 13, color: '#8aad96', marginBottom: 4 }}>Root Pro</div>
              <div style={{ fontSize: 36, fontWeight: 500, color: '#1a3328', marginBottom: 16 }}>$12 <span style={{ fontSize: 14, fontWeight: 400, color: '#8aad96' }}>/ month</span></div>
              {['Unlimited AI remedies', 'Natural Living', 'Hormone balancing', 'Healing recipes', 'Resource library'].map(f => (
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
