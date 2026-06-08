import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { symptom, profile } = await req.json()

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are a holistic wellness expert. The user has this profile: ${JSON.stringify(profile)}.

They are experiencing: ${symptom}

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "intro": "1-2 warm sentences acknowledging their concern",
  "remedies": [
    {
      "name": "exact product name",
      "emoji": "single emoji",
      "type": "essential oil|herb|supplement|food|practice",
      "how": "specific instructions — how much, how often, how to use"
    }
  ]
}

Return 6 remedies — at least 1 essential oil, 2 herbs, 2 supplements, and 1 practice. Be very specific — name exact products, doses, and application methods. Never recommend anything that interacts with their medications or allergies.`
        }
      ]
    })

    const response = await stream.finalMessage()
    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}