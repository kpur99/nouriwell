'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '../components/Sidebar'
import MedicalDisclaimer from '../components/MedicalDisclaimer'
import { supabase, getUserAccess } from '../../lib/supabase'

const GOALS = ['Reduce inflammation', 'Better sleep', 'More energy', 'Gut health', 'Hormonal balance', 'Immune support', 'Stress relief', 'Brain clarity']
const DIETS = ['No restrictions', 'Plant-based', 'Gluten-free', 'Paleo / keto', 'Mediterranean']

interface Recipe {
  name: string
  emoji: string
  time: string
  difficulty: string
  why_it_heals: string
  ingredients: { item: string; amount: string; why: string }[]
  instructions: string[]
  pro_tip: string
}

export default function Recipes() {
  const [profile, setProfile] = useState<{ name: string } | null>(null)
  const [isPro, setIsPro] = useState(true)
  const [goal, setGoal] = useState('')
  const [diet, setDiet] = useState('No restrictions')
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

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

  async function getRecipes() {
    if (!goal) return
    setLoading(true)
    setRecipes([])
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, diet, ingredients })
      })
      const data = await res.json()
      setRecipes(data.recipes || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const difficultyColor = (d: string) => d === 'easy' ? 'bg-[#E1F5EE] text-[#085041]' : d === 'medium' ? 'bg-[#FAEEDA] text-[#633806]' : 'bg-[#FAECE7] text-[#712B13]'

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
        <Sidebar active="Healing recipes" isPro={isPro} />
        <div>
        {isPro ? (
          <>
      <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
          🥗 Healing recipes
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Food as <span className="text-[#5DCAA5]">medicine</span></h1>
        <p className="text-lg text-[#7aaa94] max-w-xl mx-auto">AI-generated recipes built around your health goals — every ingredient chosen for a reason.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <MedicalDisclaimer style={{ marginBottom: 24 }} />
        <div className="bg-white border border-[#d4ede2] rounded-2xl p-6 mb-8">
          <p className="text-sm font-medium text-[#7aaa94] uppercase tracking-widest mb-4">What are you eating for?</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {GOALS.map(g => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`text-sm px-4 py-2 rounded-full cursor-pointer border transition-all ${goal === g ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041] font-medium' : 'border-[#d4ede2] bg-white text-[#4a6b5e]'}`}
              >{g}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-[#7aaa94] mb-2 block">Diet preference</label>
              <select className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]" value={diet} onChange={e => setDiet(e.target.value)}>
                {DIETS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#7aaa94] mb-2 block">Ingredients on hand (optional)</label>
              <input className="w-full border border-[#d4ede2] rounded-xl px-4 py-3 text-sm font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]" placeholder="e.g. turmeric, ginger, spinach..." value={ingredients} onChange={e => setIngredients(e.target.value)}/>
            </div>
          </div>

          <button
            onClick={getRecipes}
            disabled={!goal || loading}
            className="w-full py-4 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer text-base font-medium hover:bg-[#0F6E56] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating your recipes...' : '✦ Generate healing recipes'}
          </button>
        </div>

        {recipes.length > 0 && (
          <div className="space-y-4">
            {recipes.map((r, i) => (
              <div key={i} className="bg-white border border-[#d4ede2] rounded-2xl overflow-hidden">
                <div className="p-6 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{r.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-[#0a2e22] mb-1">{r.name}</h3>
                      <p className="text-sm text-[#4a6b5e] mb-3">{r.why_it_heals}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-[#f4faf7] text-[#4a6b5e] px-2 py-1 rounded-full">⏱ {r.time}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor(r.difficulty)}`}>{r.difficulty}</span>
                      </div>
                    </div>
                    <span className="text-[#7aaa94] text-lg">{expanded === i ? '↑' : '↓'}</span>
                  </div>
                </div>

                {expanded === i && (
                  <div className="border-t border-[#f0f7f3] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-[#0a2e22] mb-3">Ingredients</h4>
                        {r.ingredients.map((ing, j) => (
                          <div key={j} className="mb-3 pb-3 border-b border-[#f0f7f3] last:border-b-0">
                            <div className="flex justify-between mb-0.5">
                              <span className="text-sm font-medium text-[#0a2e22]">{ing.item}</span>
                              <span className="text-xs text-[#7aaa94]">{ing.amount}</span>
                            </div>
                            <p className="text-xs text-[#4a6b5e]">{ing.why}</p>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#0a2e22] mb-3">Instructions</h4>
                        {r.instructions.map((step, j) => (
                          <div key={j} className="flex gap-3 mb-3">
                            <span className="w-6 h-6 rounded-full bg-[#E1F5EE] text-[#085041] text-xs flex items-center justify-center flex-shrink-0 font-medium">{j + 1}</span>
                            <p className="text-sm text-[#4a6b5e] leading-relaxed">{step}</p>
                          </div>
                        ))}
                        <div className="bg-[#E1F5EE] rounded-xl p-4 mt-4">
                          <p className="text-xs font-medium text-[#085041] mb-1">💡 Pro tip</p>
                          <p className="text-xs text-[#4a6b5e]">{r.pro_tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
