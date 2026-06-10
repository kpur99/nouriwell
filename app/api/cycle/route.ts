import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { phase, symptoms, profile } = await req.json()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a holistic women's health expert specializing in hormone balancing. 
User profile: ${JSON.stringify(profile)}
Current hormone phase: ${phase}
Current symptoms: ${symptoms || 'none specified'}

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "phase_description": "2-3 sentences describing what's happening hormonally in this phase",
  "energy_level": "low|medium|high",
  "mood_tendency": "one sentence on typical mood patterns",
  "remedies": [
    {
      "name": "exact remedy name",
      "emoji": "single emoji",
      "type": "essential oil|herb|supplement|food|practice",
      "how": "specific usage instructions"
    }
  ],
  "foods": [
    {
      "name": "specific food",
      "emoji": "single emoji",
      "why": "one sentence on why this food supports this phase"
    }
  ],
  "practices": [
    {
      "name": "specific practice",
      "emoji": "single emoji",
      "how": "specific instructions"
    }
  ],
  "avoid": ["thing to avoid 1", "thing to avoid 2", "thing to avoid 3"]
}

Return 4 remedies, 4 foods, 3 practices, 3 things to avoid. Be very specific.`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
