import { NextRequest } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Please fill in all required fields.' }), { status: 400 })
    }

    await resend.emails.send({
      from: 'Nouriwell Contact <onboarding@resend.dev>',
      to: 'katielynnmrp@gmail.com',
      subject: `Nouriwell: ${subject || 'New message from ' + name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e3d2e; padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">New message from Nouriwell</h2>
          </div>
          <div style="background: #faf8f3; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e0d8c8;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'General inquiry'}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e0d8c8;">${message}</p>
            <p style="color: #8aad96; font-size: 12px; margin-top: 24px;">Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      reply_to: email,
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Contact email error:', error)
    return new Response(JSON.stringify({ error: 'Failed to send message.' }), { status: 500 })
  }
}