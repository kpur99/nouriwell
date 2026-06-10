import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  console.log('Webhook received')
  
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    console.log('No signature found')
    return new Response('No signature', { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    console.log('Event type:', event.type)
  } catch (err) {
    console.log('Webhook signature error:', err)
    return new Response(`Webhook error: ${err}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    console.log('User ID from metadata:', userId)

    if (!userId) {
      console.log('No user_id in metadata')
      return new Response(JSON.stringify({ received: true }), { status: 200 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('Updating profile for user:', userId)
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_beta: true })
      .eq('id', userId)

    console.log('Update result:', data, 'Error:', error)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
