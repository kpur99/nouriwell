'use client'
import Link from 'next/link'

interface MobileBottomNavProps {
  active: string
}

const items = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    shortLabel: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    label: 'Remedy finder',
    href: '/remedy-finder',
    shortLabel: 'Remedy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M10 13V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M10 10C8 10 7 8.5 7 7C9 7 10 8.5 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 10C12 10 13 8.5 13 7C11 7 10 8.5 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Supplement tracker',
    href: '/tracker',
    shortLabel: 'Tracker',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M7 16l1 1 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Encyclopedia',
    href: '/encyclopedia',
    shortLabel: 'Encyclopedia',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M12 3L4 6v7c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="12" cy="15" r="1" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function MobileBottomNav({ active }: MobileBottomNavProps) {
  return (
    <nav className="mobile-bottom-nav">
      {items.map(item => {
        const isActive = active === item.label
        return (
          <Link
            key={item.label}
            href={item.href}
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              flex: 1,
              padding: '8px 4px',
              color: isActive ? '#2a5c45' : '#8aad96',
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {item.icon}
            <span>{item.shortLabel}</span>
          </Link>
        )
      })}
    </nav>
  )
}
