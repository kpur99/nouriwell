import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { symptom, profile } = await req.json()

    const response = await client.messages.create({
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
  ],
  "resources": [
    {
      "title": "exact real title",
      "author": "author or host name",
      "type": "podcast|article|book|video",
      "description": "one sentence on why this is relevant",
      "url": "real URL if you know it, otherwise empty string"
    }
  ]
}

Return 6 remedies — at least 1 essential oil, 2 herbs, 2 supplements, 1 practice.
Return 4 resources — 1 podcast episode, 1 article, 1 book, 1 video. All must be real, well-known titles directly relevant to the symptom. Never invent titles or authors.
Never recommend anything that interacts with their medications or allergies.`
        }
      ]
    })

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