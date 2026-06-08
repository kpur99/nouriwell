'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getUserAccess } from '../../lib/supabase'

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
  const [isPro, setIsPro] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [goal, setGoal] = useState('')
  const [diet, setDiet] = useState('No restrictions')
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    async function checkAccess() {
      const { isPro } = await getUserAccess()
      setIsPro(isPro)
      setCheckingAccess(false)
    }
    checkAccess()
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
    <div className="min-h-screen bg-[#f4faf7] font-sans">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
        <Sidebar active="Healing recipes" />
        <div>
      <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
          🥗 Healing recipes
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Food as <span className="text-[#5DCAA5]">medicine</span></h1>
        <p className="text-lg text-[#7aaa94] max-w-xl mx-auto">AI-generated recipes built around your health goals — every ingredient chosen for a reason.</p>
        {!isPro && <div className="inline-flex items-center gap-2 bg-[#EEEDFE] text-[#3C3489] text-xs px-3 py-1.5 rounded-full mt-4">🔒 Pro feature</div>}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
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
        </div>
      </div>
    </div>
  )
}
