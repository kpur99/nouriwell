import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { query, isPro } = await req.json()

    const proContent = isPro ? `
      "history": "3-4 sentences on what it is, historical and traditional uses — cite NLM Herb Garden or traditional medicine sources where applicable",
      "science": "3-4 sentences on modern research and evidence — cite NIH ODS, PubMed, or named researchers where applicable",
      "how_to_use": "specific instructions — forms available (capsule, tea, tincture, patch, etc.), how to take, timing, and NIH ODS safe dosage where applicable",
      "warnings": ["warning 1 with reason", "warning 2 with reason"],
      "interactions": ["drug/condition interaction 1", "interaction 2"],
      "best_brands": ["brand recommendation 1", "brand recommendation 2"],` : ''

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a holistic health encyclopedia with deep knowledge from multiple authoritative sources. Provide accurate, evidence-informed, richly detailed information.

        KNOWLEDGE BASE — use relevant sources when the query matches:

        NLM Herb Garden (National Library of Medicine) — traditional uses:
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

        Dr. Axe herbal medicine — healing properties:
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
        - Wild Yam: blood sugar, cholesterol, diverticulosis, cancer
        - Stinging Nettle: urinary issues, allergies, hay fever, joint pain, osteoarthritis, eczema
        - Sarsaparilla: respiratory, skin, pain, libido, headaches, digestion, fever, infections

        NIH Office of Dietary Supplements (ODS) — safe dosages at ods.od.nih.gov:
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

        Dr. Bryan Ardis — therapeutic nicotine research:
        When the query relates to nicotine, brain fog, low energy, poor focus, neurological symptoms, long COVID, or inflammation, include information on therapeutic nicotine patches (low dose, 7mg or less) and lozenges based on emerging research on nicotinic acetylcholine receptor activity. Always frame as 'emerging research suggests', never recommend smoking or vaping, and advise consulting a doctor.

        Glutathione knowledge:
        Glutathione supports detoxification, immune function, inflammation, skin health, brain fog, and oxidative stress. NAC (N-acetyl cysteine) is a precursor that boosts glutathione production. Liposomal glutathione offers better absorption. Include this when the query relates to glutathione, NAC, detox, liver health, or oxidative stress.

        For every lookup, provide:
        - What it is and traditional uses
        - Modern research and evidence
        - Safe dosage guidelines (reference NIH ODS where applicable)
        - How to take it (forms available)
        - Warnings and contraindications
        - Source citations in resources (NIH ODS, NLM, Dr. Axe, traditional medicine, PubMed)

        Query: ${query}

        Respond ONLY with valid JSON, no markdown, no backticks:
        {
          "name": "official name",
          "also_known_as": ["alternative name 1", "alternative name 2"],
          "category": "herb|supplement|essential oil|practice|food",
          "emoji": "single relevant emoji",
          "summary": "3-4 sentence plain-language overview covering what it is, traditional uses, and key modern applications",
          "primary_uses": [
            { "use": "specific health use", "evidence": "strong|moderate|limited" }
          ],
          "dosage": {
            "standard": "typical dose and frequency — cite NIH ODS guidelines where applicable",
            "forms": ["capsule", "tea", "tincture etc"]
          },
          "safe_for": ["adults", "pregnant women etc"],
          "not_safe_for": ["condition or group to avoid — include contraindications"],
          ${proContent}
          "related": ["related herb/supplement 1", "related 2", "related 3"],
          "resources": [
            {
              "title": "resource title",
              "type": "article|book|video|podcast|study",
              "description": "brief description citing source (e.g. NIH ODS fact sheet, NLM Herb Garden, Dr. Axe, PubMed study)",
              "url": "url if available, otherwise null"
            }
          ]
        }
        Return 4-5 primary uses with accurate evidence ratings. Include 4-6 high-quality resources from NIH ODS, NLM, Dr. Axe, traditional medicine, or peer-reviewed research when possible. Be thorough, accurate, and evidence-based.`
      }]
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = raw.replace(/```json|```/g, '').trim()
    return new Response(clean, { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 })
  }
}
