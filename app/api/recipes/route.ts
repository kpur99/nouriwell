import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { goal, dietFilters, customRequest, ingredients } = await req.json()
    const dietText = Array.isArray(dietFilters) && dietFilters.length > 0
      ? dietFilters.join(', ')
      : 'No restrictions'

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a holistic nutritionist specializing in healing foods and anti-inflammatory cooking.
Health goal: ${goal}
Dietary restrictions: ${dietText}
Additional requests: ${customRequest || 'none'}
Available ingredients: ${ingredients || 'anything'}

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "recipes": [
    {
      "name": "recipe name",
      "emoji": "single emoji",
      "time": "prep + cook time e.g. 20 mins",
      "difficulty": "easy|medium|hard",
      "why_it_heals": "one sentence on the healing benefits",
      "ingredients": [
        { "item": "ingredient name", "amount": "specific amount", "why": "why this ingredient helps" }
      ],
      "instructions": ["step 1", "step 2", "step 3"],
      "pro_tip": "one specific tip to maximize healing benefit"
    }
  ]
}
Return 3 recipes. Be very specific with ingredients and amounts. Each recipe should have 5-8 ingredients.`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
