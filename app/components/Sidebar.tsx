'use client'
import Link from 'next/link'

interface SidebarProps {
  active: string
  isPro?: boolean
}

export default function Sidebar({ active, isPro = false }: SidebarProps) {
  const item = (label: string, href: string, icon: React.ReactNode, badge?: string, badgeType?: string) => (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        borderRadius: 12, cursor: 'pointer', fontSize: 14,
        color: active === label ? '#2a5c45' : '#5a7a6a',
        background: active === label ? '#e8f0ea' : 'none',
        fontWeight: active === label ? 500 : 400,
        transition: 'background 0.12s'
      }}>
        <div style={{ width: 18, height: 18, flexShrink: 0 }}>{icon}</div>
        {label}
        {badge && (
          <span style={{
            fontSize: 9, padding: '2px 6px', borderRadius: 8, marginLeft: 'auto', fontWeight: 500,
            background: badgeType === 'pro' ? '#ede8f5' : '#e8f0ea',
            color: badgeType === 'pro' ? '#4a3589' : '#2a5c45'
          }}>{badge}</span>
        )}
      </div>
    </Link>
  )

  const lockedItem = (label: string, href: string, icon: React.ReactNode) => (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        borderRadius: 12, cursor: 'pointer', fontSize: 14,
        color: '#aac9b8', opacity: 0.7,
        transition: 'background 0.12s'
      }}>
        <div style={{ width: 18, height: 18, flexShrink: 0 }}>{icon}</div>
        {label}
        <span style={{ marginLeft: 'auto', fontSize: 11 }}>🔒</span>
      </div>
    </Link>
  )

  return (
    <aside style={{ background: '#fff', borderRight: '0.5px solid #e0d8c8', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 'calc(100vh - 64px)' }}>

      <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px 6px' }}>Free features</p>

      {item('Remedy finder', '/dashboard',
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.8"/><path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M10 13V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M10 10C8 10 7 8.5 7 7C9 7 10 8.5 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 10C12 10 13 8.5 13 7C11 7 10 8.5 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
        'Free', 'free'
      )}

      {item('Supplement tracker', '/tracker',
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M7 16l1 1 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
        'Free', 'free'
      )}

      {item('Encyclopedia', '/encyclopedia',
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 3L4 6v7c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="15" r="1" fill="currentColor"/></svg>,
        'Free', 'free'
      )}

      <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 12px 6px', marginTop: 8 }}>Pro features</p>

      {isPro ? (
        <>
          {item('Cycle syncing', '/cycle',
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 12a8 8 0 01-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/></svg>
          )}
          {item('Healing recipes', '/recipes',
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M5 10C5 14 8 17 12 17C16 17 19 14 19 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 20v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          )}
          {item('Resource library', '/library',
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 19V6a2 2 0 012-2h14v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 002 2h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 012-2h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </>
      ) : (
        <>
          {lockedItem('Cycle syncing', '/cycle',
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 12a8 8 0 01-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/></svg>
          )}
          {lockedItem('Healing recipes', '/recipes',
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M5 10C5 14 8 17 12 17C16 17 19 14 19 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 20v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          )}
          {lockedItem('Resource library', '/library',
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 19V6a2 2 0 012-2h14v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 002 2h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 012-2h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '0.5px solid #e0d8c8' }}>
        {item('My profile', '/onboarding',
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        )}
        <button
          onClick={async () => {
            const { supabase } = await import('../../lib/supabase')
            await supabase.auth.signOut()
            window.location.href = '/'
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', fontSize: 14, color: '#5a7a6a', background: 'none', border: 'none', width: '100%', fontFamily: 'inherit' }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}