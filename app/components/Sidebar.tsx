import Link from 'next/link'

interface SidebarProps {
  active: string
}

export default function Sidebar({ active }: SidebarProps) {
  const item = (label: string, href: string, icon: React.ReactNode, badge?: string, badgeType?: string, locked?: boolean) => (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        borderRadius: 12, cursor: 'pointer', fontSize: 14,
        color: active === label ? '#2a5c45' : locked ? '#aac9b8' : '#5a7a6a',
        background: active === label ? '#e8f0ea' : 'none',
        fontWeight: active === label ? 500 : 400,
        opacity: locked ? 0.6 : 1,
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

  return (
    <aside style={{ background: '#fff', borderRight: '0.5px solid #e0d8c8', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 'calc(100vh - 64px)' }}>

      {/* Dashboard home */}
      {item('Dashboard', '/dashboard',
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/></svg>
      )}

      <p style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 12px 6px' }}>Wellness tools</p>

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

      {item('Cycle syncing', '/cycle',
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M20 12a8 8 0 01-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/></svg>,
        'Pro', 'pro', true
      )}

      {item('Healing recipes', '/recipes',
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M5 10C5 14 8 17 12 17C16 17 19 14 19 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 20v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
        'Pro', 'pro', true
      )}

      {item('Resource library', '/library',
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 19V6a2 2 0 012-2h14v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 002 2h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 19a2 2 0 012-2h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
        'Pro', 'pro', true
      )}

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '0.5px solid #e0d8c8' }}>
        {item('My profile', '/onboarding',
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        )}
        <div style={{ background: '#1e3d2e', borderRadius: 14, padding: 16, margin: '8px 4px 0' }}>
          <h4 style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 4 }}>Unlock Pro</h4>
          <p style={{ fontSize: 11, color: '#8aad96', lineHeight: 1.5, marginBottom: 12 }}>Cycle syncing, healing recipes, resource library and more.</p>
          <button style={{ width: '100%', background: '#3d8c6a', color: '#fff', border: 'none', borderRadius: 20, padding: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Upgrade — $12/mo
          </button>
        </div>
      </div>
    </aside>
  )
}
