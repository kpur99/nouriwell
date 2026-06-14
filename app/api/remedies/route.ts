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

        You have knowledge of the following herbs and their traditional uses from the National Library of Medicine:
        - Chamomile: inflammation, joint cramps, migraines, menstrual regulation
        - Feverfew: migraine headaches, fevers, arthritis
        - Lavender: stress, nausea, blood pressure, skin conditions like eczema and psoriasis
        - Rosemary: headaches, poor circulation, memory, fever, dandruff
        - Sage: head pains, sore throat, laryngitis, tonsillitis, hoarseness
        - Yarrow: wounds, cuts, bruising, hay fever, allergic mucus problems
        - Golden Rod: painful menstruation, arthritis, eczema, skin ulcers
        - Pennyroyal: headaches, abdominal cramps, fever
        - Primrose: headaches, insomnia, tension, gout, rheumatism
        - Vervain: coughs, colds, shortness of breath
        - Woodruff: insomnia, stomach issues, colon health
        - Wintergreen: wounds, kidney and bladder ulcers, antiseptic
        - Lovage: digestive aid, abdominal pain
        - Sorrel: fever, diuretic, thirst
        When recommending these herbs, note they are recognized by the National Library of Medicine.

        Additional herbs and their healing properties to recommend when relevant:
        - Ashwagandha: stress, cortisol, thyroid, adrenal fatigue, mood, stamina
        - Turmeric: inflammation, depression, arthritis, cholesterol, cancer, digestive issues
        - Echinacea: immune boost, colds, inflammation, skin problems
        - Ginger Root: inflammation, digestion, nausea, pain, cholesterol, arthritis
        - Ginkgo Biloba: brain fog, memory, dementia, anxiety, depression, ADHD, headaches
        - Ginseng: stress, brain function, inflammation, blood sugar, immune system
        - Valerian Root: sleep, anxiety, stress, blood pressure, menstrual cramps
        - Milk Thistle: liver detox, cholesterol, diabetes, aging
        - Maca Root: hormones, fertility, energy, stamina, libido
        - Rhodiola: energy, stress, depression, cortisol, brain function, fat burning
        - St. John's Wort: depression, anxiety, insomnia, ADHD, mood
        - Licorice Root: acid reflux, cortisol, immunity, sore throat, PMS, menopause
        - Holy Basil: anxiety, hypothyroidism, adrenal fatigue, acne, blood sugar
        - Berberine: diabetes, cholesterol, heart disease, obesity, Alzheimer's, infections
        - Black Cohosh: menopause, hot flashes, PCOS, uterine fibroids, bone loss
        - Boswellia: inflammation, arthritis, immunity, healing, autoimmune
        - Oregano Oil: bacterial infections, fungal infections, inflammation, allergies, cancer
        - Skullcap: anxiety, insomnia, inflammation, muscle spasms, menstruation
        - Passion Flower: anxiety, sleep, blood pressure, blood sugar, ADHD, menopause
        - Lemon Balm: digestion, thyroid, PMS, sleep, mood, heart health
        - Kava Root: anxiety, stress, insomnia, headaches, migraines
        - Moringa: diabetes, anemia, allergies, arthritis, high blood pressure, low libido
        - Fennel: digestion, gas, bloating, heartburn, respiratory, eye health, menopause
        - Astragalus: immune system, cardiovascular, respiratory, wound healing, anti-aging
        - Mullein: ear infections, bacteria, inflammation, respiratory mucus
        - Slippery Elm: digestion, IBS, bloating, constipation, skin conditions, anxiety
        - Marshmallow Root: stomach inflammation, dry cough, bacterial infections, joint pain
        - Calendula: inflammation, wound healing, muscle spasms, oral health, antimicrobial
        - Cat's Claw: arthritis, digestion, immunity, blood pressure, cancer
        - Burdock Root: detox, circulation, lymphatic system, diabetes, skin conditions
        - Goldenseal: digestion, immunity, mouth health, eye health, heart health, cancer
        - Devil's Claw: arthritis, inflammation, pain relief, digestion, kidney health
        - Vitex (Chasteberry): PMS, uterine fibroids, female fertility, endometriosis, menopause
        - Red Clover: cardiovascular, menopause, bone health, eczema, psoriasis, cancer
        - Feverfew: migraines, fevers, skin issues, arthritis, blood clots, infertility
        - Wild Yam: blood sugar, cholesterol, diverticulosis, cancer
        - Stinging Nettle: urinary issues, allergies, hay fever, joint pain, osteoarthritis, eczema
        - Sarsaparilla: respiratory, skin, pain, libido, headaches, digestion, fever, infections
        - Maca Root: hormones, fertility, energy, libido, stamina
        When recommending these herbs always note they are from Dr. Axe's research and traditional herbal medicine. Always include proper usage instructions and note any warnings.

        You have access to knowledge from the NIH Office of Dietary Supplements (ODS) fact sheets at ods.od.nih.gov. When recommending vitamins and minerals, reference NIH ODS guidelines for safe dosages including:
        - Vitamin D: 600-800 IU daily, up to 4000 IU safely, for bone health, immunity, mood
        - Vitamin C: 65-90mg daily, up to 2000mg safely, for immunity, skin, antioxidant
        - Magnesium: 310-420mg daily, for sleep, muscle cramps, stress, blood sugar
        - Zinc: 8-11mg daily, for immunity, wound healing, taste and smell
        - Vitamin B12: 2.4mcg daily, for energy, nerve function, brain health
        - Iron: 8-18mg daily, for energy, anemia, fatigue
        - Omega-3 fatty acids: 1.1-1.6g daily, for heart, brain, inflammation
        - Vitamin K: 90-120mcg daily, for blood clotting, bone health
        - Folate: 400mcg daily, for cell growth, pregnancy, heart health
        - Biotin: 30mcg daily, for hair, skin, nails, metabolism
        - Calcium: 1000-1200mg daily, for bones, muscle function, nerve signaling
        - Vitamin A: 700-900mcg daily, for vision, immunity, skin
        - Vitamin E: 15mg daily, for antioxidant protection, immunity
        - Melatonin: 0.5-5mg for sleep, circadian rhythm, jet lag
        - Elderberry: for immune support, colds, flu
        - Probiotics/Lactobacillus: for gut health, immunity, digestion
        - NAC (N-acetylcysteine): for glutathione production, liver, respiratory health
        - Coenzyme Q10: for heart health, energy, migraines
        - Glucosamine/Chondroitin: for joint pain, osteoarthritis
        Always recommend safe dosages from NIH ODS guidelines and note when to consult a doctor.

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