import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { goal, dietFilters, customRequest, ingredients, recipeCount = 3, existingRecipes = [] } = await req.json()
    const dietText = Array.isArray(dietFilters) && dietFilters.length > 0
      ? dietFilters.join(', ')
      : 'No restrictions'
    const count = Math.min(Math.max(Number(recipeCount) || 3, 1), 6)
    const existingText = Array.isArray(existingRecipes) && existingRecipes.length > 0
      ? `\nDo not repeat these recipes already shown: ${existingRecipes.join(', ')}. Generate ${count} completely different recipes.`
      : ''

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a holistic nutritionist specializing in healing foods and anti-inflammatory cooking.

        You are inspired by The Wellness Way's approach to healthy eating (thewellnessway.com). When generating healing recipes follow these principles:
        - Anti-inflammatory ingredients — avoid seed oils, refined sugar, processed foods
        - Gluten-free and dairy-free options whenever possible
        - Whole food based — real ingredients, nothing artificial
        - High protein focus — prioritize quality proteins like turkey, chicken, salmon, eggs
        - No sugar or low sugar alternatives
        - Use healing spices and herbs like turmeric, ginger, garlic, cinnamon
        - Include categories like: breakfast, main dish, soups, salads, snacks, desserts, beverages, condiments
        - Desserts should use natural sweeteners like honey, maple syrup, or dates
        - Recommend gluten-free flours like almond flour, coconut flour, buckwheat
        - Emphasize gut-healing foods like bone broth, fermented foods, fiber-rich vegetables
        - Include DIY wellness recipes like natural face creams, deodorant, toothpaste when relevant

        Recipe categories to draw inspiration from:
        - Breakfast: smoothies, oatmeal, pancakes, muffins, skillets, casseroles
        - Main dish: chicken, turkey, salmon, zucchini boats, lettuce wraps, tacos, burgers
        - Soups: bone broth based, lentil, sweet potato chili, butternut squash, carrot ginger
        - Salads: quinoa, chickpea, brussels sprouts, cucumber, tomato avocado
        - Snacks: energy bites, protein balls, chia pudding, kale chips, fruit rollups
        - Desserts: gluten-free cookies, avocado mousse, apple crisp, pumpkin pie
        - Beverages: matcha lattes, collagen lattes, infused waters, protein smoothies
        - Condiments: dairy-free ranch, homemade ketchup, enchilada sauce, BBQ sauce

        Always generate original recipes inspired by these principles, not copies of any specific recipe.

        Health goal: ${goal}
        Dietary restrictions: ${dietText}
        Additional requests: ${customRequest || 'none'}
        Available ingredients: ${ingredients || 'anything'}${existingText}

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
Return ${count} recipes. Be very specific with ingredients and amounts. Each recipe should have 5-8 ingredients.`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
