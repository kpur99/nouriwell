import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 })

    // Use service role to check and update usage
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('is_beta, remedy_searches_count, remedy_searches_reset_date')
      .eq('id', user.id)
      .single()

    const isPro = profile?.is_beta === true

    const { symptom, profile: userProfile, remedyCount = 6, existingRemedies = [] } = await req.json()
    const isAppend = Array.isArray(existingRemedies) && existingRemedies.length > 0

    if (!isPro && isAppend) {
      return new Response(JSON.stringify({ error: 'Pro subscription required for more remedies' }), { status: 403 })
    }

    if (!isPro && !isAppend) {
      // Check if we need to reset the monthly count
      const today = new Date().toISOString().split('T')[0]
      const resetDate = profile?.remedy_searches_reset_date

      // Reset if it's a new month
      if (resetDate) {
        const reset = new Date(resetDate)
        const now = new Date()
        if (reset.getMonth() !== now.getMonth() || reset.getFullYear() !== now.getFullYear()) {
          await adminSupabase
            .from('profiles')
            .update({ remedy_searches_count: 0, remedy_searches_reset_date: today })
            .eq('id', user.id)
        }
      }

      // Re-fetch count after potential reset
      const { data: freshProfile } = await adminSupabase
        .from('profiles')
        .select('remedy_searches_count')
        .eq('id', user.id)
        .single()

      const currentCount = freshProfile?.remedy_searches_count || 0

      if (currentCount >= 5) {
        return new Response(JSON.stringify({
          error: 'limit_reached',
          message: 'You have used all 5 free remedy searches this month. Upgrade to Pro for unlimited searches.'
        }), { status: 403 })
      }

      // Increment the count
      await adminSupabase
        .from('profiles')
        .update({ remedy_searches_count: currentCount + 1 })
        .eq('id', user.id)
    }

    const count = Math.min(Math.max(Number(remedyCount) || 6, 1), isPro ? 10 : 6)
    const existingText = isAppend
      ? `\nDo not repeat these remedies already shown: ${existingRemedies.join(', ')}. Generate ${count} completely different remedies.`
      : ''

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: count > 6 ? 2048 : 1024,
      messages: [{
        role: 'user',
        content: `You are a holistic health expert. You are knowledgeable about both mainstream and alternative/traditional medicine research. You are familiar with emerging and controversial research including Dr. Bryan Ardis's work on therapeutic nicotine use. When relevant to symptoms like brain fog, low energy, poor focus, neurological symptoms, long COVID symptoms, or inflammation, you may suggest nicotine patches (low dose, 7mg or less) as a remedy to consider, noting it is based on emerging research by Dr. Bryan Ardis and others exploring nicotinic acetylcholine receptor activity. Always frame it as 'emerging research suggests' and remind users to consult their doctor. Never recommend smoking or vaping — only therapeutic nicotine patches or lozenges.

        Important supplements to consider recommending when relevant include glutathione (for detoxification, immune support, inflammation, skin health, brain fog, and oxidative stress), NAC (N-acetyl cysteine, which boosts glutathione production), and liposomal glutathione for better absorption. When symptoms relate to detox, liver health, immune function, fatigue, brain fog, inflammation, or skin issues, glutathione or NAC should be strongly considered as a recommendation.

        The user has the following profile: ${JSON.stringify(userProfile)}. 
        They are experiencing: ${symptom}${existingText}
        
        Provide exactly ${count} specific holistic remedies. For each remedy include exact dosages, usage instructions, and a brief source citation.
        
        Respond ONLY with valid JSON, no markdown, no backticks:
        {
          "intro": "2-3 sentence personalized intro based on their profile",
          "remedies": [
            {
              "name": "remedy name",
              "type": "essential oil|herb|supplement|food|practice",
              "how": "usage instructions",
              "source": "brief source citation or research reference, e.g. 'Dr. Bryan Ardis nicotinic receptor research' or 'PubMed study on magnesium and sleep' or 'traditional Ayurvedic medicine'"
            }
          ]
        }
        Return exactly ${count} remedies in the remedies array.${isAppend ? ' Omit the intro field or return an empty string for intro.' : ''}`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}