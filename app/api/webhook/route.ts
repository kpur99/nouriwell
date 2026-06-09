import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response(`Webhook error: ${err}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id

    if (userId) {
      await supabase
        .from('profiles')
        .update({ is_beta: true })
        .eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
    const email = customer.email

    if (email) {
      await supabase
        .from('profiles')
        .update({ is_beta: false })
        .eq('id', (await supabase.from('profiles').select('id').eq('name', email).single()).data?.id)
    }
  }

  return new Response(JSON.stringify({ received: true }))
}