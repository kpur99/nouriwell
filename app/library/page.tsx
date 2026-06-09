'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { getUserAccess } from '../../lib/supabase'

const RESOURCES = [
  // ── PODCASTS ──────────────────────────────────────────
  {
    title: 'Culture Apothecary',
    author: 'Alex Clark',
    type: 'podcast',
    topic: 'General wellness',
    description: 'Honest conversations about holistic health, natural living, and taking back control of your wellness.',
    url: 'https://podcasts.apple.com/us/podcast/culture-apothecary-with-alex-clark/id1564895519',
  },
  {
    title: 'Green Smoothie Girl Podcast',
    author: 'Robyn Openshaw',
    type: 'podcast',
    topic: 'Nutrition & detox',
    description: 'Plant-based nutrition, detox protocols, and natural healing with Green Smoothie Girl Robyn Openshaw.',
    url: 'https://greensmoothiegirl.com/your-high-vibration-life-podcast/',
  },
  {
    title: 'doTERRA Wellness Podcast',
    author: 'doTERRA',
    type: 'podcast',
    topic: 'Essential oils',
    description: 'Expert guidance on using essential oils for health, wellness, and natural living.',
    url: 'https://www.doterra.com/US/en/blog/wellness-podcast',
  },
  {
    title: 'The Cycle Kitchen Podcast',
    author: 'Nevia Victoria',
    type: 'podcast',
    topic: 'Hormonal health',
    description: 'Cycle syncing, hormonal balance, and nourishing your body through every phase of your cycle.',
    url: 'https://podcasts.apple.com/us/podcast/the-cycle-kitchen/id1641930614',
  },
  {
    title: 'The Preconception Revolution',
    author: 'Ann Shippy, MD',
    type: 'podcast',
    topic: 'Hormonal health',
    description: 'Functional medicine approaches to fertility, preconception health, and hormonal optimization.',
    url: 'https://annshippy.com/podcast/',
  },
  {
    title: 'The Wellness Way Podcast',
    author: 'Dr. Patrick Flynn',
    type: 'podcast',
    topic: 'General wellness',
    description: 'A different perspective on healthcare — addressing the root cause of dysfunction rather than masking symptoms.',
    url: 'https://thewellnessway.com/podcast/',
  },
  {
    title: 'Barbara O\'Neil Health Talks',
    author: 'Barbara O\'Neil',
    type: 'podcast',
    topic: 'Natural healing',
    description: 'Natural health education covering nutrition, herbal medicine, and self-healing principles.',
    url: 'https://www.youtube.com/@barbaraoneill',
  },
  {
    title: 'Huberman Lab',
    author: 'Dr. Andrew Huberman',
    type: 'podcast',
    topic: 'Sleep & stress',
    description: 'Science-backed protocols for sleep, stress, focus, and mental performance from a Stanford neuroscientist.',
    url: 'https://hubermanlab.com/podcast/',
  },
  {
    title: 'The Model Health Show',
    author: 'Shawn Stevenson',
    type: 'podcast',
    topic: 'Sleep & nutrition',
    description: 'Evidence-based nutrition, sleep science, and fitness strategies for optimal health.',
    url: 'https://themodelhealthshow.com',
  },
  {
    title: 'Essentially You',
    author: 'Dr. Mariza Snyder',
    type: 'podcast',
    topic: 'Hormonal health',
    description: 'Essential oils, hormonal balance, and functional medicine strategies for women.',
    url: 'https://drmariza.com/essentially-you-podcast/',
  },
  {
    title: 'The Natural MD Radio',
    author: 'Dr. Aviva Romm',
    type: 'podcast',
    topic: 'Herbal medicine',
    description: 'Integrative medicine, herbal remedies, and women\'s health from a Yale-trained MD and herbalist.',
    url: 'https://avivaromm.com/natural-md-radio/',
  },
  {
    title: 'The Doctor\'s Farmacy',
    author: 'Dr. Mark Hyman',
    type: 'podcast',
    topic: 'Gut health',
    description: 'Functional medicine deep-dives into gut health, food as medicine, and chronic disease prevention.',
    url: 'https://drhyman.com/blog/category/podcasts/',
  },

  // ── BOOKS ──────────────────────────────────────────────
  {
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    type: 'book',
    topic: 'Sleep',
    description: 'The definitive science of sleep — why it matters and exactly how to get more of it naturally.',
    url: 'https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316',
  },
  {
    title: 'Grain Brain',
    author: 'Dr. David Perlmutter',
    type: 'book',
    topic: 'Brain fog & gut health',
    description: 'How wheat, carbs, and sugar are destroying your brain — and the natural dietary interventions that help.',
    url: 'https://www.amazon.com/Grain-Brain-Surprising-Sugar-Your-Killers/dp/031623480X',
  },
  {
    title: 'The Adrenal Thyroid Revolution',
    author: 'Dr. Aviva Romm',
    type: 'book',
    topic: 'Stress & hormonal health',
    description: 'A proven 4-week plan to rescue your metabolism, hormones, mind, and mood using natural approaches.',
    url: 'https://www.amazon.com/Adrenal-Thyroid-Revolution-Rescue-Metabolism/dp/0062476246',
  },
  {
    title: 'Healing with Whole Foods',
    author: 'Paul Pitchford',
    type: 'book',
    topic: 'Nutrition & healing',
    description: 'A comprehensive guide to Asian traditions and modern nutrition for healing the whole body.',
    url: 'https://www.amazon.com/Healing-Whole-Foods-Asian-Traditions/dp/1556434308',
  },
  {
    title: 'The Inflammation Spectrum',
    author: 'Dr. Will Cole',
    type: 'book',
    topic: 'Inflammation',
    description: 'Find your food triggers and reset your system with a customized anti-inflammation plan.',
    url: 'https://www.amazon.com/Inflammation-Spectrum-Discover-Triggers-Restore/dp/0735220271',
  },
  {
    title: 'Medical Medium',
    author: 'Anthony William',
    type: 'book',
    topic: 'General wellness',
    description: 'Life-changing foods and protocols for healing chronic illness and mystery symptoms naturally.',
    url: 'https://www.amazon.com/Medical-Medium-Secrets-Chronic-Mystery/dp/1401944876',
  },
  {
    title: 'The Magnesium Miracle',
    author: 'Dr. Carolyn Dean',
    type: 'book',
    topic: 'Sleep & muscle pain',
    description: 'How magnesium deficiency causes dozens of health problems — and how to fix them naturally.',
    url: 'https://www.amazon.com/Magnesium-Miracle-Second-Carolyn-Dean/dp/0399594450',
  },
  {
    title: 'Herbal Healing for Women',
    author: 'Rosemary Gladstar',
    type: 'book',
    topic: 'Herbal medicine',
    description: 'Simple, effective herbal remedies for all stages of a woman\'s life from a master herbalist.',
    url: 'https://www.amazon.com/Herbal-Healing-Women-Rosemary-Gladstar/dp/0671767674',
  },
  {
    title: 'The Gut-Brain Connection',
    author: 'Dr. Emeran Mayer',
    type: 'book',
    topic: 'Gut health',
    description: 'How your gut microbiome controls your mood, decisions, and overall health.',
    url: 'https://www.amazon.com/Mind-Gut-Connection-Conversation-Impacts/dp/0062376578',
  },
  {
    title: 'Essential Oils Ancient Medicine',
    author: 'Dr. Josh Axe',
    type: 'book',
    topic: 'Essential oils',
    description: 'A complete guide to using essential oils for healing — covering over 100 conditions and remedies.',
    url: 'https://www.amazon.com/Essential-Oils-Ancient-Medicine-Josh/dp/0736969837',
  },

  // ── ARTICLES ───────────────────────────────────────────
  {
    title: 'How to Use Essential Oils Safely',
    author: 'Healthline',
    type: 'article',
    topic: 'Essential oils',
    description: 'Complete guide to dilution ratios, carrier oils, safe application methods, and what to avoid.',
    url: 'https://www.healthline.com/health/how-to-use-essential-oils',
  },
  {
    title: 'Top 10 Adaptogenic Herbs for Stress',
    author: 'Dr. Josh Axe',
    type: 'article',
    topic: 'Stress & anxiety',
    description: 'Ashwagandha, rhodiola, ginseng, and more — how adaptogens work and exactly how to use them.',
    url: 'https://draxe.com/nutrition/adaptogen/',
  },
  {
    title: 'Magnesium & Sleep — What the Research Says',
    author: 'Sleep Foundation',
    type: 'article',
    topic: 'Sleep',
    description: 'Evidence-based overview of how magnesium glycinate improves sleep quality, latency, and duration.',
    url: 'https://www.sleepfoundation.org/nutrition/magnesium-and-sleep',
  },
  {
    title: 'The Best Herbs for Headache Relief',
    author: 'Verywell Health',
    type: 'article',
    topic: 'Headaches',
    description: 'Feverfew, butterbur, peppermint oil, and ginger — the evidence behind each herbal headache remedy.',
    url: 'https://www.verywellhealth.com/herbal-remedies-for-headaches-88755',
  },
  {
    title: 'Gut Health 101 — Your Complete Guide',
    author: 'Healthline',
    type: 'article',
    topic: 'Gut health',
    description: 'Everything you need to know about your microbiome, leaky gut, and how to heal your digestion naturally.',
    url: 'https://www.healthline.com/nutrition/gut-microbiome-and-health',
  },
  {
    title: 'Natural Remedies for Anxiety That Actually Work',
    author: 'Dr. Axe',
    type: 'article',
    topic: 'Stress & anxiety',
    description: 'Herbs, supplements, and lifestyle practices backed by research for reducing anxiety naturally.',
    url: 'https://draxe.com/health/natural-remedies-for-anxiety/',
  },
  {
    title: 'Cycle Syncing — How to Eat for Your Hormones',
    author: 'Healthline',
    type: 'article',
    topic: 'Hormonal health',
    description: 'What to eat in each phase of your cycle to balance hormones, reduce PMS, and boost energy.',
    url: 'https://www.healthline.com/health/womens-health/guide-to-cycle-syncing-method',
  },
  {
    title: 'The Anti-Inflammatory Diet — A Beginner\'s Guide',
    author: 'Healthline',
    type: 'article',
    topic: 'Inflammation',
    description: 'What to eat and avoid to reduce chronic inflammation — the root cause of most modern disease.',
    url: 'https://www.healthline.com/nutrition/anti-inflammatory-diet-101',
  },
  {
    title: 'doTERRA Essential Oil Usage Guide',
    author: 'doTERRA',
    type: 'article',
    topic: 'Essential oils',
    description: 'Official doTERRA guide to safe topical, aromatic, and internal use of essential oils.',
    url: 'https://www.doterra.com/US/en/essentail-oil-usage',
  },
  {
    title: 'Best Supplements for Energy — What Works',
    author: 'Examine.com',
    type: 'article',
    topic: 'Low energy',
    description: 'Evidence-based breakdown of B12, CoQ10, iron, and adaptogens for boosting natural energy levels.',
    url: 'https://examine.com/topics/energy/',
  },

  // ── VIDEOS ─────────────────────────────────────────────
  {
    title: 'Barbara O\'Neil — Natural Remedies Masterclass',
    author: 'Barbara O\'Neil',
    type: 'video',
    topic: 'Natural healing',
    description: 'Comprehensive natural health education covering herbs, nutrition, and self-healing from Barbara O\'Neil.',
    url: 'https://www.youtube.com/@barbaraoneill',
  },
  {
    title: 'Yoga for Stress & Anxiety Relief',
    author: 'Yoga with Adriene',
    type: 'video',
    topic: 'Stress & anxiety',
    description: '30-minute yoga flow specifically designed to calm the nervous system and reduce anxiety.',
    url: 'https://www.youtube.com/watch?v=hJbRpHZr_d0',
  },
  {
    title: 'How to Heal Your Gut Naturally',
    author: 'Dr. Mark Hyman',
    type: 'video',
    topic: 'Gut health',
    description: 'Functional medicine approach to healing leaky gut, bloating, and digestive issues naturally.',
    url: 'https://www.youtube.com/@drmarkhyman',
  },
  {
    title: 'Essential Oils for Beginners — Complete Guide',
    author: 'doTERRA',
    type: 'video',
    topic: 'Essential oils',
    description: 'Everything you need to know to start using essential oils safely and effectively at home.',
    url: 'https://www.youtube.com/@doTERRA',
  },
  {
    title: 'How to Balance Your Hormones Naturally',
    author: 'Dr. Josh Axe',
    type: 'video',
    topic: 'Hormonal health',
    description: 'Diet, supplements, and lifestyle changes to naturally balance estrogen, cortisol, and thyroid hormones.',
    url: 'https://www.youtube.com/watch?v=cFAF4jSHFCQ',
  },
  {
    title: 'Anti-Inflammatory Foods — What to Eat',
    author: 'Dr. Andrew Weil',
    type: 'video',
    topic: 'Inflammation',
    description: 'Dr. Weil\'s anti-inflammatory diet explained — the foods that heal and the ones that harm.',
    url: 'https://www.youtube.com/@DrAndrewWeil',
  },
  {
    title: 'Sleep Better Tonight — Natural Sleep Tips',
    author: 'Matthew Walker',
    type: 'video',
    topic: 'Sleep',
    description: 'The world\'s leading sleep scientist shares his top evidence-based tips for deeper, longer sleep.',
    url: 'https://www.youtube.com/watch?v=5MuIMqhT8oM',
  },
  {
    title: 'Magnesium — The Master Mineral',
    author: 'Thomas DeLauer',
    type: 'video',
    topic: 'Sleep & muscle pain',
    description: 'Which form of magnesium to take, when, and how much — glycinate vs citrate vs malate explained.',
    url: 'https://www.youtube.com/watch?v=nQLKuJUJVMo',
  },
  {
    title: 'Cycle Syncing with Food',
    author: 'Nevia Victoria — The Cycle Kitchen',
    type: 'video',
    topic: 'Hormonal health',
    description: 'How to eat for each phase of your menstrual cycle to reduce PMS and optimize energy and mood.',
    url: 'https://www.youtube.com/@thecyclekitchen',
  },
  {
    title: 'Headache Relief — Natural & Fast',
    author: 'Barbara O\'Neil',
    type: 'video',
    topic: 'Headaches',
    description: 'Natural approaches to relieving tension headaches and migraines without medication.',
    url: 'https://www.youtube.com/@barbaraoneill',
  },
]

const TYPE_CONFIG: Record<string, { emoji: string; bg: string; color: string }> = {
  podcast: { emoji: '🎙️', bg: '#FAEEDA', color: '#633806' },
  article: { emoji: '📄', bg: '#E1F5EE', color: '#085041' },
  book:    { emoji: '📚', bg: '#EEEDFE', color: '#3C3489' },
  video:   { emoji: '🎥', bg: '#FAECE7', color: '#712B13' },
}

const TOPICS = ['All topics', 'Sleep', 'Stress & anxiety', 'Gut health', 'Hormonal health', 'Essential oils', 'Inflammation', 'Natural healing', 'Herbal medicine', 'Nutrition & healing', 'Brain fog & gut health', 'Headaches', 'Low energy', 'Muscle pain']
const FILTERS = ['All', 'Podcast', 'Article', 'Book', 'Video']

export default function Library() {
  const [filter, setFilter] = useState('All')
  const [isPro, setIsPro] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      const { isPro } = await getUserAccess()
      setIsPro(isPro)
      setCheckingAccess(false)
    }
    checkAccess()
  }, [])
  const [topic, setTopic] = useState('All topics')
  const [search, setSearch] = useState('')

  const filtered = RESOURCES.filter(r => {
    const matchType = filter === 'All' || r.type === filter.toLowerCase()
    const matchTopic = topic === 'All topics' || r.topic === topic
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.topic.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase())
    return matchType && matchTopic && matchSearch
  })

  return (
    <div className="min-h-screen bg-[#f4faf7] font-sans">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
        <Sidebar active="Resource library" isPro={isPro} />
        <div>

      {checkingAccess ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#8aad96' }}>Checking access...</div>
      ) : isPro ? (
        <>
      {/* Hero */}
      <div className="bg-[#0a2e22] px-6 md:px-12 pt-14 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#1D9E7540] text-[#5DCAA5] text-sm px-4 py-2 rounded-full mb-5">
          📚 Curated wellness resources
        </div>
        <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight mb-4">
          Go deeper with your <span className="text-[#5DCAA5]">healing</span>
        </h1>
        <p className="text-lg text-[#7aaa94] max-w-xl mx-auto mb-8 leading-relaxed">
          Handpicked podcasts, articles, books, and videos from trusted holistic health experts — including your favorites.
        </p>
        <input
          className="w-full max-w-lg bg-white border-2 border-transparent rounded-2xl px-6 py-4 text-base font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]"
          placeholder="Search by topic, title, or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap gap-3">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm cursor-pointer border transition-all ${filter === f ? 'bg-[#0a2e22] text-white border-[#0a2e22]' : 'bg-white text-[#4a6b5e] border-[#d4ede2] hover:border-[#1D9E75]'}`}
              >
                {f === 'Podcast' ? '🎙️ ' : f === 'Article' ? '📄 ' : f === 'Book' ? '📚 ' : f === 'Video' ? '🎥 ' : '✦ '}{f}
              </button>
            ))}
            <span className="ml-auto text-sm text-[#7aaa94] self-center">{filtered.length} resources</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(t => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-4 py-1.5 rounded-full text-xs cursor-pointer border transition-all ${topic === t ? 'bg-[#1D9E75] text-white border-[#1D9E75]' : 'bg-white text-[#4a6b5e] border-[#d4ede2] hover:border-[#1D9E75]'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r, i) => {
            const config = TYPE_CONFIG[r.type]
            return (
              <div key={i} className="bg-white border border-[#d4ede2] rounded-2xl p-6 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: config.bg }}>
                    {config.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: config.bg, color: config.color }}>{r.type}</span>
                      <span className="text-xs text-[#7aaa94]">{r.topic}</span>
                    </div>
                    <p className="text-base font-medium text-[#0a2e22] leading-snug">{r.title}</p>
                    <p className="text-sm text-[#7aaa94] mt-1">by {r.author}</p>
                  </div>
                </div>
                <p className="text-sm text-[#4a6b5e] leading-relaxed flex-1 mb-4">{r.description}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1D9E75] font-medium no-underline hover:underline">
                  View resource →
                </a>
              </div>
            )
          })}
        </div>
      </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 32px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h3 style={{ fontSize: 22, fontWeight: 500, color: '#1a3328', marginBottom: 8 }}>Pro feature</h3>
          <p style={{ fontSize: 14, color: '#5a7a6a', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
            Upgrade to Root Pro to unlock the full resource library — curated podcasts, books, articles, and videos.
          </p>
          <button style={{ background: '#3d8c6a', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
            Upgrade to Pro — $12/mo
          </button>
        </div>
      )}
        </div>
      </div>
    </div>
  )
}