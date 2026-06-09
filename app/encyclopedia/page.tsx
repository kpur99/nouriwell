'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getUserAccess } from '../../lib/supabase'

const BROWSE = [
  { category: 'Herbs', items: ['Ashwagandha', 'Turmeric', 'Ginger', 'Echinacea', 'Valerian root', 'Milk thistle', 'Rhodiola', 'Holy basil'] },
  { category: 'Supplements', items: ['Magnesium glycinate', 'Vitamin D3', 'Omega-3', 'Zinc', 'B12', 'Iron', 'CoQ10', 'Probiotics'] },
  { category: 'Essential oils', items: ['Peppermint', 'Lavender', 'Frankincense', 'Tea tree', 'Eucalyptus', 'Rosemary', 'Bergamot', 'Clary sage'] },
  { category: 'Practices', items: ['Meditation', 'Dry brushing', 'Oil pulling', 'Earthing', 'Cold therapy', 'Breathwork', 'Tongue scraping', 'Castor oil packs'] },
]

interface EncyclopediaEntry {
  name: string
  also_known_as: string[]
  category: string
  emoji: string
  summary: string
  primary_uses: { use: string; evidence: string }[]
  dosage: { standard: string; forms: string[] }
  safe_for: string[]
  not_safe_for: string[]
  history?: string
  science?: string
  how_to_use?: string
  warnings?: string[]
  interactions?: string[]
  best_brands?: string[]
  related: string[]
}

export default function Encyclopedia() {
  const [isPro, setIsPro] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [entry, setEntry] = useState<EncyclopediaEntry | null>(null)

  useEffect(() => {
    async function checkAccess() {
      const { isPro } = await getUserAccess()
      setIsPro(isPro)
      setCheckingAccess(false)
    }
    checkAccess()
  }, [])

  async function lookup(query: string) {
    if (!query.trim()) return
    setLoading(true)
    setEntry(null)
    try {
      const res = await fetch('/api/encyclopedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, isPro })
      })
      const data = await res.json()
      setEntry(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const evidenceColor = (e: string) => e === 'strong' ? 'bg-[#E1F5EE] text-[#085041]' : e === 'moderate' ? 'bg-[#FAEEDA] text-[#633806]' : 'bg-[#f4faf7] text-[#7aaa94]'

  return (
    <div className="min-h-screen bg-[#f4faf7] font-sans">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
        <Sidebar active="Encyclopedia" isPro={isPro} />
        <div>
      <div className="bg-[#0a2e22] px-6 md:px-12 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-4">
          📖 Holistic encyclopedia
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">Look up <span className="text-[#5DCAA5]">anything</span></h1>
        <p className="text-lg text-[#7aaa94] max-w-xl mx-auto mb-8">Search any supplement, herb, essential oil, or practice for uses, dosage, and safety information.</p>
        <div className="flex max-w-lg mx-auto gap-3">
          <input
            className="flex-1 bg-white border-2 border-transparent rounded-2xl px-6 py-4 text-base font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]"
            placeholder="e.g. ashwagandha, magnesium, dry brushing..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookup(search)}
          />
          <button
            onClick={() => lookup(search)}
            disabled={loading || !search.trim()}
            className="px-6 py-4 bg-[#1D9E75] text-white rounded-2xl border-none cursor-pointer font-medium hover:bg-[#0F6E56] disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '...' : 'Look up →'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Entry result */}
        {entry && (
          <div className="mb-10">
            <div className="bg-white border border-[#d4ede2] rounded-2xl p-8 mb-5">
              <div className="flex items-start gap-5 mb-6">
                <div className="text-5xl">{entry.emoji}</div>
                <div>
                  <h2 className="text-2xl font-medium text-[#0a2e22] mb-1">{entry.name}</h2>
                  {entry.also_known_as?.length > 0 && <p className="text-sm text-[#7aaa94] mb-2">Also known as: {entry.also_known_as.join(', ')}</p>}
                  <span className="text-xs bg-[#E1F5EE] text-[#085041] px-3 py-1 rounded-full">{entry.category}</span>
                </div>
              </div>
              <p className="text-base text-[#4a6b5e] leading-relaxed mb-6">{entry.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-[#0a2e22] mb-3">Primary uses</h3>
                  {entry.primary_uses?.map((u, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#f0f7f3] last:border-b-0">
                      <span className="text-sm text-[#4a6b5e]">{u.use}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${evidenceColor(u.evidence)}`}>{u.evidence}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#0a2e22] mb-3">Dosage</h3>
                  <p className="text-sm text-[#4a6b5e] mb-3">{entry.dosage?.standard}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.dosage?.forms?.map((f, i) => (
                      <span key={i} className="text-xs bg-[#f4faf7] text-[#4a6b5e] px-3 py-1 rounded-full border border-[#d4ede2]">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="bg-[#E1F5EE] border border-[#b5d9c9] rounded-2xl p-5">
                <h3 className="text-sm font-medium text-[#085041] mb-3">✓ Safe for</h3>
                {entry.safe_for?.map((s, i) => <p key={i} className="text-sm text-[#085041] py-1">{s}</p>)}
              </div>
              <div className="bg-[#FAECE7] border border-[#f0c4b0] rounded-2xl p-5">
                <h3 className="text-sm font-medium text-[#712B13] mb-3">✕ Not safe for</h3>
                {entry.not_safe_for?.map((s, i) => <p key={i} className="text-sm text-[#712B13] py-1">{s}</p>)}
              </div>
            </div>

            {/* Pro section */}
            {!isPro ? (
              <div className="bg-[#0a2e22] rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-medium text-white mb-2">Unlock the full deep dive</h3>
                <p className="text-sm text-[#7aaa94] mb-6 max-w-md mx-auto">Get the full history, science, how to use, drug interactions, warnings, and best brand recommendations with Pro.</p>
                <button className="px-8 py-4 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer font-medium hover:bg-[#0F6E56]">
                  Upgrade to Pro — $12/mo
                </button>
              </div>
            ) : (
              <div className="bg-white border border-[#d4ede2] rounded-2xl p-8 space-y-5">
                {entry.history && <div><h3 className="text-sm font-medium text-[#0a2e22] mb-2">History & traditional use</h3><p className="text-sm text-[#4a6b5e] leading-relaxed">{entry.history}</p></div>}
                {entry.science && <div><h3 className="text-sm font-medium text-[#0a2e22] mb-2">What the science says</h3><p className="text-sm text-[#4a6b5e] leading-relaxed">{entry.science}</p></div>}
                {entry.how_to_use && <div><h3 className="text-sm font-medium text-[#0a2e22] mb-2">How to use</h3><p className="text-sm text-[#4a6b5e] leading-relaxed">{entry.how_to_use}</p></div>}
                {entry.best_brands && <div><h3 className="text-sm font-medium text-[#0a2e22] mb-2">Best brands</h3><div className="flex flex-wrap gap-2">{entry.best_brands.map((b, i) => <span key={i} className="text-sm bg-[#E1F5EE] text-[#085041] px-3 py-1 rounded-full">{b}</span>)}</div></div>}
              </div>
            )}

            {entry.related?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-medium text-[#7aaa94] uppercase tracking-widest mb-3">Related</p>
                <div className="flex flex-wrap gap-2">
                  {entry.related.map((r, i) => (
                    <button key={i} onClick={() => { setSearch(r); lookup(r) }} className="text-sm bg-white border border-[#d4ede2] text-[#4a6b5e] px-4 py-2 rounded-full cursor-pointer hover:border-[#1D9E75] hover:text-[#085041] transition-all">
                      {r} →
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Browse section */}
        {!entry && (
          <div>
            <p className="text-xs font-medium text-[#7aaa94] uppercase tracking-widest mb-6">Browse by category</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BROWSE.map(cat => (
                <div key={cat.category} className="bg-white border border-[#d4ede2] rounded-2xl p-6">
                  <h3 className="text-base font-medium text-[#0a2e22] mb-4">{cat.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (
                      <button
                        key={item}
                        onClick={() => { setSearch(item); lookup(item) }}
                        className="text-sm bg-[#f4faf7] border border-[#d4ede2] text-[#4a6b5e] px-3 py-1.5 rounded-full cursor-pointer hover:border-[#1D9E75] hover:bg-[#E1F5EE] hover:text-[#085041] transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  )
}
