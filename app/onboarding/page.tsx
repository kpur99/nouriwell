'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const STEPS = 7

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    name: '',
    age_range: '',
    goals: [] as string[],
    diet: '',
    stress_level: 5,
    allergies: [] as string[],
    medications: [] as string[],
    pregnant: false,
  })
  const [allergyInput, setAllergyInput] = useState('')
  const [medInput, setMedInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkSession()
  }, [])

  const pct = Math.round(((step + 1) / STEPS) * 100)

  function toggleGoal(g: string) {
    setAnswers(a => ({
      ...a,
      goals: a.goals.includes(g) ? a.goals.filter(x => x !== g) : [...a.goals, g]
    }))
  }

  function addAllergy() {
    if (!allergyInput.trim()) return
    setAnswers(a => ({ ...a, allergies: [...a.allergies, allergyInput.trim()] }))
    setAllergyInput('')
  }

  function addMed() {
    if (!medInput.trim()) return
    setAnswers(a => ({ ...a, medications: [...a.medications, medInput.trim()] }))
    setMedInput('')
  }

  async function finish() {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        setLoading(false)
        return
      }
      const user = session.user
      console.log('Saving profile for user:', user.id)
      console.log('Answers:', answers)

      const { data, error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: answers.name,
        age_range: answers.age_range,
        goals: answers.goals,
        diet: answers.diet,
        stress_level: answers.stress_level,
        allergies: answers.allergies,
        medications: answers.medications,
        pregnant: answers.pregnant,
      }, { onConflict: 'id' })

      console.log('Upsert result:', data, 'Error:', error)
      router.push('/dashboard')
    } catch (e) {
      console.error('Finish error:', e)
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const optClass = (selected: boolean) =>
    `flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer text-lg transition-all ${
      selected
        ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#085041] font-medium'
        : 'border-[#d4ede2] bg-white text-[#0a2e22] hover:border-[#1D9E75]'
    }`

  return (
    <div className="min-h-screen bg-[#f4faf7] font-sans flex flex-col">

      {/* Top nav */}
      <nav className="bg-white border-b border-[#d4ede2] px-6 md:px-12 h-16 flex items-center">
        <div className="flex items-center gap-3">
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2a5c45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
              <path d="M17 4C17 4 9 11 9 19a8 8 0 0016 0c0-8-8-15-8-15z" fill="#fff" opacity=".95"/>
              <path d="M17 12C17 12 13 16 13 20a4 4 0 008 0c0-4-4-8-4-8z" fill="#fff" opacity=".4"/>
              <path d="M17 24v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-xl font-medium text-[#0a2e22]">
            Nouri<span className="text-[#1D9E75]">well</span>
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="bg-white border-b border-[#d4ede2] px-6 md:px-12 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-[#7aaa94] mb-2">
            <span>Step {step + 1} of {STEPS}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-[#e8f5ee] rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#1D9E75] rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">

          {/* Step 0 — Name */}
          {step === 0 && (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-3xl mb-6">👋</div>
              <h2 className="text-4xl font-medium text-[#0a2e22] mb-3">What's your first name?</h2>
              <p className="text-lg text-[#4a6b5e] mb-8">We'll use this to personalize your wellness experience.</p>
              <input
                className="w-full border-2 border-[#d4ede2] rounded-2xl px-6 py-5 text-xl font-sans text-[#0a2e22] bg-white focus:outline-none focus:border-[#1D9E75] mb-8"
                placeholder="e.g. Sarah"
                value={answers.name}
                onChange={e => setAnswers(a => ({ ...a, name: e.target.value }))}
              />
              <button
                disabled={answers.name.length < 2}
                onClick={() => setStep(1)}
                className={`w-full py-5 rounded-2xl text-white text-xl font-medium border-none transition-colors ${answers.name.length < 2 ? 'bg-[#7aaa94] cursor-not-allowed' : 'bg-[#1D9E75] hover:bg-[#0F6E56] cursor-pointer'}`}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 1 — Age */}
          {step === 1 && (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-3xl mb-6">🌱</div>
              <h2 className="text-4xl font-medium text-[#0a2e22] mb-3">What's your age range?</h2>
              <p className="text-lg text-[#4a6b5e] mb-8">Holistic remedies can vary by life stage.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Under 18', emoji: '🌱' },
                  { label: '18–29', emoji: '🌿' },
                  { label: '30–44', emoji: '🌳' },
                  { label: '45–59', emoji: '🍂' },
                  { label: '60+', emoji: '🌾' },
                ].map(a => (
                  <div key={a.label} className={optClass(answers.age_range === a.label)} onClick={() => setAnswers(x => ({ ...x, age_range: a.label }))}>
                    <span className="text-2xl">{a.emoji}</span>{a.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(0)} className="px-8 py-5 rounded-2xl border-2 border-[#d4ede2] text-[#4a6b5e] text-xl cursor-pointer bg-white hover:border-[#1D9E75]">←</button>
                <button disabled={!answers.age_range} onClick={() => setStep(2)} className={`flex-1 py-5 rounded-2xl text-white text-xl font-medium border-none transition-colors ${!answers.age_range ? 'bg-[#7aaa94] cursor-not-allowed' : 'bg-[#1D9E75] hover:bg-[#0F6E56] cursor-pointer'}`}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2 — Goals */}
          {step === 2 && (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-3xl mb-6">🎯</div>
              <h2 className="text-4xl font-medium text-[#0a2e22] mb-3">What are your wellness goals?</h2>
              <p className="text-lg text-[#4a6b5e] mb-8">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {['Better sleep', 'Reduce stress', 'More energy', 'Focus & clarity', 'Gut health', 'Pain relief', 'Hormonal balance', 'Immune support', 'Not sure'].map(g => (
                  <div key={g} className={optClass(answers.goals.includes(g))} onClick={() => toggleGoal(g)}>{g}</div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-8 py-5 rounded-2xl border-2 border-[#d4ede2] text-[#4a6b5e] text-xl cursor-pointer bg-white hover:border-[#1D9E75]">←</button>
                <button disabled={answers.goals.length === 0} onClick={() => setStep(3)} className={`flex-1 py-5 rounded-2xl text-white text-xl font-medium border-none transition-colors ${answers.goals.length === 0 ? 'bg-[#7aaa94] cursor-not-allowed' : 'bg-[#1D9E75] hover:bg-[#0F6E56] cursor-pointer'}`}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Diet */}
          {step === 3 && (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-3xl mb-6">🥗</div>
              <h2 className="text-4xl font-medium text-[#0a2e22] mb-3">What's your diet like?</h2>
              <p className="text-lg text-[#4a6b5e] mb-8">Select all that apply — helps us recommend compatible supplements.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {['No restrictions', 'Plant-based', 'Paleo / keto', 'Gluten-free', 'Mediterranean', 'Dairy-free', 'Other'].map(d => {
                  const current = answers.diet ? answers.diet.split(', ').filter(Boolean) : []
                  return (
                    <div
                      key={d}
                      className={optClass(current.includes(d))}
                      onClick={() => {
                        if (current.includes(d)) {
                          setAnswers(a => ({ ...a, diet: current.filter(x => x !== d).join(', ') }))
                        } else {
                          setAnswers(a => ({ ...a, diet: [...current, d].join(', ') }))
                        }
                      }}
                    >
                      {d}
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-4 mt-2">
                <button onClick={() => setStep(2)} className="px-8 py-5 rounded-2xl border-2 border-[#d4ede2] text-[#4a6b5e] text-xl cursor-pointer bg-white hover:border-[#1D9E75]">←</button>
                <button disabled={!answers.diet} onClick={() => setStep(4)} className={`flex-1 py-5 rounded-2xl text-white text-xl font-medium border-none transition-colors ${!answers.diet ? 'bg-[#7aaa94] cursor-not-allowed' : 'bg-[#1D9E75] hover:bg-[#0F6E56] cursor-pointer'}`}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4 — Stress */}
          {step === 4 && (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-3xl mb-6">📊</div>
              <h2 className="text-4xl font-medium text-[#0a2e22] mb-3">Current stress level?</h2>
              <p className="text-lg text-[#4a6b5e] mb-8">Be honest — this calibrates your wellness plan.</p>
              <div className="bg-white border-2 border-[#d4ede2] rounded-2xl p-8 mb-8">
                <div className="text-6xl font-medium text-[#1D9E75] text-center mb-6">{answers.stress_level}<span className="text-3xl text-[#7aaa94]"> / 10</span></div>
                <input
                  type="range" min={1} max={10} step={1}
                  value={answers.stress_level}
                  onChange={e => setAnswers(a => ({ ...a, stress_level: parseInt(e.target.value) }))}
                  className="w-full accent-[#1D9E75]"
                />
                <div className="flex justify-between text-sm text-[#7aaa94] mt-3">
                  <span>Barely stressed</span><span>Extremely stressed</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="px-8 py-5 rounded-2xl border-2 border-[#d4ede2] text-[#4a6b5e] text-xl cursor-pointer bg-white hover:border-[#1D9E75]">←</button>
                <button onClick={() => setStep(5)} className="flex-1 py-5 rounded-2xl text-white text-xl font-medium border-none bg-[#1D9E75] hover:bg-[#0F6E56] cursor-pointer">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 5 — Allergies */}
          {step === 5 && (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-3xl mb-6">🛡️</div>
              <h2 className="text-4xl font-medium text-[#0a2e22] mb-3">Any allergies?</h2>
              <p className="text-lg text-[#4a6b5e] mb-4">We'll exclude these from all recommendations.</p>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
                ⚠️ Not a substitute for medical advice. Always consult your doctor before starting any new supplement.
              </div>
              <div className="flex gap-3 mb-4">
                <input
                  className="flex-1 border-2 border-[#d4ede2] rounded-2xl px-5 py-4 text-lg font-sans text-[#0a2e22] bg-white focus:outline-none focus:border-[#1D9E75]"
                  placeholder="e.g. lavender, tree nuts..."
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addAllergy()}
                />
                <button onClick={addAllergy} className="px-6 py-4 bg-[#E1F5EE] text-[#085041] rounded-2xl text-lg cursor-pointer border-none font-medium hover:bg-[#1D9E75] hover:text-white transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
                {answers.allergies.map((a, i) => (
                  <span key={i} className="bg-[#E1F5EE] text-[#085041] text-base px-4 py-2 rounded-full flex items-center gap-2">
                    {a}
                    <button onClick={() => setAnswers(x => ({ ...x, allergies: x.allergies.filter((_, j) => j !== i) }))} className="text-[#0F6E56] bg-none border-none cursor-pointer text-lg leading-none">×</button>
                  </span>
                ))}
              </div>
              <div className={optClass(answers.allergies.length === 0 && !allergyInput)} onClick={() => setAnswers(a => ({ ...a, allergies: [] }))}>
                ✅ No known allergies
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(4)} className="px-8 py-5 rounded-2xl border-2 border-[#d4ede2] text-[#4a6b5e] text-xl cursor-pointer bg-white hover:border-[#1D9E75]">←</button>
                <button onClick={() => setStep(6)} className="flex-1 py-5 rounded-2xl text-white text-xl font-medium border-none bg-[#1D9E75] hover:bg-[#0F6E56] cursor-pointer">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 6 — Medications */}
          {step === 6 && (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#E1F5EE] flex items-center justify-center text-3xl mb-6">💊</div>
              <h2 className="text-4xl font-medium text-[#0a2e22] mb-3">Any current medications?</h2>
              <p className="text-lg text-[#4a6b5e] mb-6">Some herbs interact with medications — we'll flag these for you.</p>
              <div className="flex gap-3 mb-4">
                <input
                  className="flex-1 border-2 border-[#d4ede2] rounded-2xl px-5 py-4 text-lg font-sans text-[#0a2e22] bg-white focus:outline-none focus:border-[#1D9E75]"
                  placeholder="e.g. metformin, birth control..."
                  value={medInput}
                  onChange={e => setMedInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMed()}
                />
                <button onClick={addMed} className="px-6 py-4 bg-[#E1F5EE] text-[#085041] rounded-2xl text-lg cursor-pointer border-none font-medium hover:bg-[#1D9E75] hover:text-white transition-colors">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
                {answers.medications.map((m, i) => (
                  <span key={i} className="bg-[#E1F5EE] text-[#085041] text-base px-4 py-2 rounded-full flex items-center gap-2">
                    {m}
                    <button onClick={() => setAnswers(x => ({ ...x, medications: x.medications.filter((_, j) => j !== i) }))} className="text-[#0F6E56] bg-none border-none cursor-pointer text-lg leading-none">×</button>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className={optClass(answers.medications.length === 0)} onClick={() => setAnswers(a => ({ ...a, medications: [] }))}>
                  ✅ No medications
                </div>
                <div className={optClass(answers.pregnant)} onClick={() => setAnswers(a => ({ ...a, pregnant: !a.pregnant }))}>
                  🤰 Pregnant / nursing
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(5)} className="px-8 py-5 rounded-2xl border-2 border-[#d4ede2] text-[#4a6b5e] text-xl cursor-pointer bg-white hover:border-[#1D9E75]">←</button>
                <button
                  onClick={finish}
                  disabled={loading}
                  className={`flex-1 py-5 rounded-2xl text-white text-xl font-medium border-none transition-colors ${loading ? 'bg-[#7aaa94] cursor-not-allowed' : 'bg-[#1D9E75] hover:bg-[#0F6E56] cursor-pointer'}`}
                >
                  {loading ? 'Saving...' : '✦ Finish & see my remedies'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}