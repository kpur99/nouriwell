interface IconProps {
    size?: number
    color?: string
    className?: string
  }
  
  const defaultColor = '#1D9E75'
  
  export function HeadacheIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M13 3L7 13H12L11 21L17 11H12L13 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function StomachAcheIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M8 8C8 5 12 5 12 8C12 11 16 11 16 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 16C16 19 12 19 12 16C12 13 8 13 8 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function AnxietyIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M12 12 m-1 0 a1 1 0 1 1 2 0 a3 3 0 1 1 -6 0 a5 5 0 1 1 10 0 a7 7 0 1 1 -14 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function BrainFogIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M8 17H16C18.2 17 20 15.2 20 13C20 10.8 18.2 9 16 9C15.5 6.5 13.5 5 11 5C8.5 5 6.5 6.8 6 9C3.8 9 2 10.8 2 13C2 15.2 3.8 17 6 17H8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function PoorSleepIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M15.5 19C11.4 19 8 15.6 8 11.5C8 8.7 9.5 6.2 11.8 4.8C8 5.1 5 8.3 5 12.1C5 16.5 8.5 20 12.9 20C15 20 16.9 19.2 18.3 17.8C17.5 18.6 16.6 19 15.5 19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 5L18.5 6.5L20 7L18.5 7.5L18 9L17.5 7.5L16 7L17.5 6.5L18 5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function LowEnergyIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <rect x="4" y="8" width="14" height="8" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 10H20V14H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 12H10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
  
  export function MusclePainIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M4 12H9L11 8L13 16L15 10H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function BloatingIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function ColdImmunityIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M12 3L18 5V11C18 15 15.5 18 12 20C8.5 18 6 15 6 11V5L12 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.5 11.5L11 13L14.5 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function InflammationIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M12 2C12 2 7 8 7 13C7 17 10 20 14 20C18 20 21 17 21 13C21 8 17 5 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 8C14 8 11 11 11 14C11 16 12.5 18 15 18C17 18 18.5 16.5 18.5 14C18.5 11.5 16.5 9.5 14 8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function EssentialOilIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M12 3C12 3 6 10 6 14C6 17.314 8.686 20 12 20C15.314 20 18 17.314 18 14C18 10 12 3 12 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function FoodIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M8 4C7 5 7 6 8 7C9 8 9 9 8 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 4C11 5 11 6 12 7C13 8 13 9 12 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 4C15 5 15 6 16 7C17 8 17 9 16 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 12C5 16 8 19 12 19C16 19 19 16 19 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function HerbIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <path d="M12 20V5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M12 10C8 10 6 7 6 4C10 4 12 7 12 10Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M12 14C16 14 18 11 18 8C14 8 12 11 12 14Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    )
  }
  
  export function SupplementIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <rect x="5" y="9" width="14" height="6" rx="3" stroke={color} strokeWidth="1.8"/>
        <path d="M12 9V15" stroke={color} strokeWidth="1.8"/>
      </svg>
    )
  }
  
  export function PracticeIcon({ size = 24, color = defaultColor, className }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
        <circle cx="12" cy="7" r="2" stroke={color} strokeWidth="1.8"/>
        <path d="M7 18C8.5 15 10 14 12 14C14 14 15.5 15 17 18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M9 12L6 15M15 12L18 15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  }

export function RemedyFinderIcon({ size = 24, color = defaultColor, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
      <circle cx="10" cy="10" r="6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 14.5L20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 13V8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M10 10C8 10 7 8.5 7 7C9 7 10 8.5 10 10Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M10 10C12 10 13 8.5 13 7C11 7 10 8.5 10 10Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

export function SupplementTrackerIcon({ size = 24, color = defaultColor, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
      <rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 8h8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 12h5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M15 13.5h-1a1.5 1.5 0 000 3h1a1.5 1.5 0 000-3z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 15h1" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 16l1 1 2-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function ResourceLibraryIcon({ size = 24, color = defaultColor, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
      <path d="M4 19V6a2 2 0 012-2h14v13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 19a2 2 0 002 2h14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 19a2 2 0 012-2h14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 4v7l-2-1.5L11 11V4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function CycleSyncingIcon({ size = 24, color = defaultColor, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
      <path d="M4 12a8 8 0 018-8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 12a8 8 0 01-8 8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 12a8 8 0 0016 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" opacity="0.4"/>
      <path d="M12 4V2M12 4L10 6M12 4L14 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 12h2M20 12l-2-2M20 12l-2 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.6"/>
      <path d="M12 10v-1M12 15v-1M10 12H9M15 12h-1" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
    </svg>
  )
}

export function HealingRecipesIcon({ size = 24, color = defaultColor, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
      <path d="M5 10C5 14 8 17 12 17C16 17 19 14 19 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 20h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 20v-3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 7V5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 5C10 5 9 3.5 9 2C11 2 12 3.5 12 5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M12 5C14 5 15 3.5 15 2C13 2 12 3.5 12 5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  )
}

export function EncyclopediaIcon({ size = 24, color = defaultColor, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
      <path d="M12 3L4 6v7c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6l-8-3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="15" r="1" fill={color}/>
    </svg>
  )
}

export function ChatBubbleIcon({ size = 24, color = defaultColor, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} className={className}>
      <path d="M4 4h16a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10h8M8 13h5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}