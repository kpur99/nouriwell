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

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('is_beta')
      .eq('id', user.id)
      .single()

    if (profile?.is_beta !== true) {
      return new Response(JSON.stringify({ error: 'Pro subscription required' }), { status: 403 })
    }

    const { request } = await req.json()
    if (!request?.trim()) {
      return new Response(JSON.stringify({ error: 'Request required' }), { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a natural living expert. Generate a detailed DIY recipe for: ${request}. Include: a name, description, complete ingredients list with measurements, step by step instructions, safety notes, shelf life, and storage tips. Frame everything as for informational purposes only. Return JSON: { "name": string, "description": string, "ingredients": [{ "item": string, "amount": string }], "instructions": [string], "safety_notes": string, "shelf_life": string, "storage": string }

Respond ONLY with valid JSON, no markdown, no backticks.`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
