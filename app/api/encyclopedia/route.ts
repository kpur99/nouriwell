import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { query, isPro } = await req.json()

    const proContent = isPro ? `
      "history": "2-3 sentences on historical/traditional use",
      "science": "2-3 sentences on what research says",
      "how_to_use": "specific instructions — forms available, how to take, timing",
      "warnings": ["warning 1", "warning 2"],
      "interactions": ["drug/condition interaction 1", "interaction 2"],
      "best_brands": ["brand recommendation 1", "brand recommendation 2"],` : ''

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a holistic health encyclopedia. Provide accurate, evidence-informed information.
Query: ${query}

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "name": "official name",
  "also_known_as": ["alternative name 1", "alternative name 2"],
  "category": "herb|supplement|essential oil|practice|food",
  "emoji": "single relevant emoji",
  "summary": "2-3 sentence plain-language overview",
  "primary_uses": [
    { "use": "specific health use", "evidence": "strong|moderate|limited" }
  ],
  "dosage": {
    "standard": "typical dose and frequency",
    "forms": ["capsule", "tea", "tincture etc"]
  },
  "safe_for": ["adults", "pregnant women etc"],
  "not_safe_for": ["condition or group to avoid"],
  ${proContent}
  "related": ["related herb/supplement 1", "related 2", "related 3"]
}
Return 4-5 primary uses. Be accurate and evidence-based.`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
