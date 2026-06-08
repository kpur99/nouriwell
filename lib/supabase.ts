import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getUserAccess() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { user: null, isPro: false, isBeta: false }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_beta')
      .eq('id', user.id)
      .single()

    console.log('getUserAccess — user:', user.id, 'profile:', profile, 'error:', error)

    const isBeta = profile?.is_beta === true
    return { user, isPro: isBeta, isBeta }
  } catch (e) {
    console.error('getUserAccess error:', e)
    return { user: null, isPro: false, isBeta: false }
  }
}