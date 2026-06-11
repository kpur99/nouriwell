import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return new Response('No signature', { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.log('Webhook error:', err)
    return new Response(`Webhook error: ${err}`, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    console.log('checkout.session.completed — userId:', userId)

    if (userId) {
      const { error } = await supabase
        .from('profiles')
        .update({ is_beta: true })
        .eq('id', userId)
      console.log('Update error:', error)
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = invoice.customer as string
    console.log('invoice.payment_succeeded — customerId:', customerId)

    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
    const email = customer.email
    console.log('Customer email:', email)

    if (email) {
      const { data: users, error: userError } = await supabase.auth.admin.listUsers()
      console.log('List users error:', userError)
      const user = users?.users?.find(u => u.email === email)
      console.log('Found user:', user?.id)

      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_beta: true })
          .eq('id', user.id)
        console.log('Update error:', error)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
    const email = customer.email
    console.log('Subscription cancelled for:', email)

    if (email) {
      const { data: users } = await supabase.auth.admin.listUsers()
      const user = users?.users?.find(u => u.email === email)
      if (user?.id) {
        await supabase.from('profiles').update({ is_beta: false }).eq('id', user.id)
        console.log('Pro access removed for:', user.id)
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}