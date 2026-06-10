import Link from 'next/link'
import {
  ColdImmunityIcon, HerbIcon, PracticeIcon,
  EssentialOilIcon, SupplementIcon,
  RemedyFinderIcon, SupplementTrackerIcon, ResourceLibraryIcon,
  CycleSyncingIcon, HealingRecipesIcon, EncyclopediaIcon, ChatBubbleIcon
} from './components/NouriIcons'

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#faf8f3', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 48px', height: 72, background: 'rgba(250,248,243,0.95)', backdropFilter: 'blur(8px)', borderBottom: '0.5px solid #e0d8c8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2a5c45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C12 3 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 3 12 3Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 24, fontWeight: 500, color: '#1a3328', letterSpacing: '-0.5px' }}>
            Nouri<span style={{ color: '#3d8c6a' }}>well</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto', marginRight: 20 }}>
          {['Features', 'How it works', 'Pricing'].map(n => (
            <button key={n} style={{ fontSize: 14, color: '#5a7a6a', padding: '7px 16px', borderRadius: 20, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>{n}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login">
            <button style={{ fontSize: 14, color: '#5a7a6a', padding: '7px 16px', borderRadius: 20, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>Sign in</button>
          </Link>
          <Link href="/signup">
            <button style={{ background: '#2a5c45', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 22px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Start free</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: '#1e3d2e', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 48px 100px', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 20 }}>
          Nouriwell
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(61,140,106,0.2)', color: '#7dc9a3', fontSize: 13, padding: '7px 18px', borderRadius: 20, marginBottom: 36, border: '0.5px solid rgba(125,201,163,0.3)' }}>
          <HerbIcon size={14} color="#7dc9a3" /> Holistic health, powered by AI
        </div>
        <h1 style={{ fontSize: 80, fontWeight: 500, color: '#fff', lineHeight: 1.05, marginBottom: 28, letterSpacing: '-1px', maxWidth: 820 }}>
          Natural remedies,<br />
          <span style={{ color: '#7dc9a3', fontStyle: 'italic' }}>made for your body</span>
        </h1>
        <p style={{ fontSize: 20, color: '#8aad96', lineHeight: 1.7, maxWidth: 540, margin: '0 auto 48px', fontWeight: 300 }}>
          Describe your symptoms and get specific essential oils, herbs, and supplements — tailored to your diet, lifestyle, and goals.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <Link href="/signup">
            <button style={{ background: '#3d8c6a', color: '#fff', WebkitTextFillColor: '#fff', border: 'none', borderRadius: 14, padding: '17px 38px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Get started free
            </button>
          </Link>
          <Link href="/dashboard">
            <button style={{ background: 'transparent', color: '#fff', WebkitTextFillColor: '#fff', border: '2px solid #fff', borderRadius: 14, padding: '15px 38px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              See how it works
            </button>
          </Link>
        </div>
        <p style={{ fontSize: 13, color: '#4a8a6a' }}>No credit card required · 5 free remedies / month</p>
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#4a8a6a', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>scroll</span>
          <div style={{ width: 18, height: 18, borderRight: '1.5px solid #4a8a6a', borderBottom: '1.5px solid #4a8a6a', transform: 'rotate(45deg)' }} />
        </div>
      </div>

      {/* Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: '#fff', borderBottom: '0.5px solid #e0d8c8' }}>
        {[
          { icon: <HerbIcon size={24} color="#3d8c6a" />, title: 'Specific, not vague', desc: 'Exact doses and application methods — not generic suggestions like "try aromatherapy."' },
          { icon: <ColdImmunityIcon size={24} color="#3d8c6a" />, title: 'Safety first', desc: 'Your profile flags allergies and medication interactions before every recommendation.' },
          { icon: <PracticeIcon size={24} color="#3d8c6a" />, title: 'Built around you', desc: 'Your diet, stress level, and health goals shape every single recommendation we make.' },
        ].map((f, i) => (
          <div key={f.title} style={{ padding: '32px 28px', borderRight: i < 2 ? '0.5px solid #e0d8c8' : 'none' }}>
            <div style={{ marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#1a3328', marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: '#5a7a6a', lineHeight: 1.65 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ background: '#faf8f3', padding: '72px 48px' }} id="features">
        <p style={{ fontSize: 12, color: '#3d8c6a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Everything in one place</p>
        <h2 style={{ fontSize: 36, fontWeight: 500, color: '#1a3328', marginBottom: 36, letterSpacing: '-0.3px' }}>Your complete holistic toolkit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: <RemedyFinderIcon size={22} color="#a8d4be" />, title: 'AI remedy finder', badge: 'Free', desc: 'Specific oils, herbs, and supplements with exact doses for what ails you.', href: '/dashboard' },
            { icon: <SupplementTrackerIcon size={22} color="#a8d4be" />, title: 'Supplement tracker', badge: 'Free', desc: 'Log your stack, track your streak, and check for interactions with AI.', href: '/tracker' },
            { icon: <CycleSyncingIcon size={22} color="#a8d4be" />, title: 'Hormone balancing', badge: 'Pro', desc: 'Phase-specific remedies, foods, and practices for every stage of hormone balancing.', href: '/cycle' },
            { icon: <HealingRecipesIcon size={22} color="#a8d4be" />, title: 'Healing recipes', badge: 'Pro', desc: 'Anti-inflammatory meals built around your health goals and diet preferences.', href: '/recipes' },
            { icon: <EncyclopediaIcon size={22} color="#a8d4be" />, title: 'Holistic encyclopedia', badge: 'Free + Pro', desc: 'Look up any supplement, herb, or oil for uses, dosage, and safety info.', href: '/encyclopedia' },
            { icon: <ResourceLibraryIcon size={22} color="#a8d4be" />, title: 'Resource library', badge: 'Pro', desc: 'Curated podcasts, books, and videos from holistic health experts we recommend.', href: '/library' },
          ].map(f => (
            <Link key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#2a5c45', border: 'none', borderRadius: 18, padding: 24, cursor: 'pointer', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  {f.icon}
                  <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 10, fontWeight: 500, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{f.badge}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 5 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#a8d4be', lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#2a5c45', padding: '72px 48px', textAlign: 'center' }} id="how">
        <p style={{ fontSize: 12, color: '#7dc9a3', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>How it works</p>
        <h2 style={{ fontSize: 36, fontWeight: 500, color: '#fff', marginBottom: 48, letterSpacing: '-0.3px' }}>Up and running in minutes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {[
            { num: '01', title: 'Build your profile', desc: 'Complete a quick 7-step quiz covering your age, goals, diet, stress level, allergies, and medications.' },
            { num: '02', title: 'Describe what you feel', desc: 'Type your symptoms or tap a quick-select chip. The AI cross-references your profile to personalize every recommendation.' },
            { num: '03', title: 'Get specific answers', desc: 'Receive exact remedies with doses, timing, and usage instructions — actionable steps, not vague suggestions.' },
          ].map(s => (
            <div key={s.num}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#fff', margin: '0 auto 16px' }}>{s.num}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#a8d4be', lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo */}
      <div style={{ background: '#faf8f3', padding: '72px 48px', borderBottom: '0.5px solid #e0d8c8', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#3d8c6a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>See it in action</p>
        <h2 style={{ fontSize: 36, fontWeight: 500, color: '#1a3328', marginBottom: 28, letterSpacing: '-0.3px' }}>Real answers, not generic advice</h2>
        <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 22, padding: 32, maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 22, borderBottom: '0.5px solid #e0d8c8', marginBottom: 24 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e8f0ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ChatBubbleIcon size={17} color="#3d8c6a" />
            </div>
            <p style={{ fontSize: 15, color: '#5a7a6a', fontStyle: 'italic' }}>"I've had a tension headache since this morning and my shoulders feel really tight..."</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { icon: <EssentialOilIcon size={20} color="#a8d4be" />, iconBg: 'rgba(255,255,255,0.1)', name: 'Peppermint essential oil', type: 'essential oil', typeBg: 'rgba(250,238,218,0.25)', typeColor: '#f0c4a8', desc: 'Apply 1–2 drops diluted in jojoba oil to temples and base of skull. Repeat every 2 hours.' },
              { icon: <SupplementIcon size={20} color="#a8d4be" />, iconBg: 'rgba(255,255,255,0.1)', name: 'Magnesium glycinate 300mg', type: 'supplement', typeBg: 'rgba(238,237,254,0.2)', typeColor: '#d4c8f5', desc: 'Take before bed nightly. Magnesium deficiency is one of the leading causes of tension headaches.' },
              { icon: <HerbIcon size={20} color="#a8d4be" />, iconBg: 'rgba(255,255,255,0.1)', name: 'Willow bark + ginger tea', type: 'herb', typeBg: 'rgba(232,240,234,0.2)', typeColor: '#a8d4be', desc: 'Steep 1 tsp dried willow bark and ½ tsp grated ginger for 10 minutes. Natural COX-2 inhibitor.' },
            ].map(r => (
              <div key={r.name} style={{ background: '#2a5c45', border: 'none', borderRadius: 14, padding: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: r.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  {r.icon}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{r.name}</div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, display: 'inline-block', marginBottom: 8, background: r.typeBg, color: r.typeColor }}>{r.type}</span>
                <div style={{ fontSize: 12, color: '#a8d4be', lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div style={{ background: '#fff', padding: '48px', borderBottom: '0.5px solid #e0d8c8', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#3d8c6a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>Resources we recommend</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
          {['Culture Apothecary', 'Huberman Lab', 'Green Smoothie Girl', "Barbara O'Neil", 'doTERRA', 'The Cycle Kitchen', 'Dr. Mark Hyman', 'Ann Shippy MD', 'The Wellness Way'].map(name => (
            <span key={name} style={{ fontSize: 13, background: '#faf8f3', border: '0.5px solid #e0d8c8', color: '#5a7a6a', padding: '7px 16px', borderRadius: 20 }}>{name}</span>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ background: '#faf8f3', padding: '72px 48px', textAlign: 'center' }} id="pricing">
        <p style={{ fontSize: 12, color: '#3d8c6a', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Simple pricing</p>
        <h2 style={{ fontSize: 36, fontWeight: 500, color: '#1a3328', marginBottom: 48, letterSpacing: '-0.3px' }}>Start free, upgrade when ready</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 580, margin: '0 auto', textAlign: 'left' }}>
          {[
            {
              name: 'Seed', badge: 'Free', badgeBg: '#e8f0ea', badgeColor: '#2a5c45',
              price: '$0', period: '/ month', featured: false,
              features: ['5 AI remedies / month', 'Symptom checker', 'Supplement tracker', 'Basic encyclopedia'],
              cta: 'Get started free', ctaBg: '#e8f0ea', ctaColor: '#1a3328', href: '/signup'
            },
            {
              name: 'Root', badge: 'Pro', badgeBg: '#ede8f5', badgeColor: '#4a3589',
              price: '$12', period: '/ month', featured: true,
              features: ['Unlimited AI remedies', 'Hormone balancing', 'Healing recipes', 'Full encyclopedia', 'Resource library', 'Weekly AI check-ins'],
              cta: 'Start free trial', ctaBg: '#3d8c6a', ctaColor: '#fff', href: '/signup'
            },
          ].map(p => (
            <div key={p.name} style={{ border: p.featured ? '2px solid #3d8c6a' : '0.5px solid #e0d8c8', borderRadius: 18, padding: 26, background: '#fff' }}>
              <span style={{ fontSize: 11, padding: '3px 11px', borderRadius: 20, display: 'inline-block', marginBottom: 12, fontWeight: 500, background: p.badgeBg, color: p.badgeColor }}>{p.badge}</span>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#1a3328', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 32, fontWeight: 500, color: '#1a3328', marginBottom: 16 }}>
                {p.price} <span style={{ fontSize: 14, fontWeight: 400, color: '#8aad96' }}>{p.period}</span>
              </div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize: 13, color: '#5a7a6a', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="#3d8c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </div>
              ))}
              <Link href={p.href}>
                <button style={{ width: '100%', marginTop: 16, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', background: p.ctaBg, color: p.ctaColor, fontFamily: 'inherit' }}>
                  {p.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1e3d2e', padding: '24px 48px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#3d8c6a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 3C12 3 6 9 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9 12 3 12 3Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#fff' }}>Nouri<span style={{ color: '#7dc9a3' }}>well</span></span>
        <span style={{ fontSize: 12, color: '#4a6a5a', marginLeft: 'auto' }}>Holistic health, naturally guided · © 2026 · Not medical advice · Always consult a healthcare provider</span>
      </div>

    </div>
  )
}