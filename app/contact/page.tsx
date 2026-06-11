'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!name || !email || !message) {
      setError('Please fill in your name, email, and message.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.error || 'Something went wrong.')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#faf8f3', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ height: 64, background: '#fff', borderBottom: '0.5px solid #e0d8c8', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2a5c45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
              <path d="M17 4C17 4 9 11 9 19a8 8 0 0016 0c0-8-8-15-8-15z" fill="#fff" opacity=".95"/>
              <path d="M17 12C17 12 13 16 13 20a4 4 0 008 0c0-4-4-8-4-8z" fill="#fff" opacity=".4"/>
              <path d="M17 24v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 500, color: '#1a3328', letterSpacing: '-0.3px' }}>
            Nouri<span style={{ color: '#3d8c6a' }}>well</span>
          </span>
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link href="/" style={{ fontSize: 14, color: '#5a7a6a', textDecoration: 'none' }}>← Back to home</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: '#1e3d2e', padding: '64px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 40, fontWeight: 500, color: '#fff', marginBottom: 12 }}>Get in touch</h1>
        <p style={{ fontSize: 16, color: '#8aad96', maxWidth: 480, margin: '0 auto' }}>
          Have a question, feedback, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '48px 24px' }}>
        {sent ? (
          <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
            <h2 style={{ fontSize: 24, fontWeight: 500, color: '#1a3328', marginBottom: 8 }}>Message sent!</h2>
            <p style={{ fontSize: 15, color: '#5a7a6a', marginBottom: 24 }}>Thanks for reaching out. We'll get back to you as soon as possible.</p>
            <Link href="/" style={{ color: '#3d8c6a', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>← Back to home</Link>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 20, padding: '40px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  style={{ width: '100%', border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a3328', outline: 'none', background: '#faf8f3' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email *</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  style={{ width: '100%', border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a3328', outline: 'none', background: '#faf8f3' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="What's this about?"
                style={{ width: '100%', border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a3328', outline: 'none', background: '#faf8f3' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#2a5c45', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={6}
                style={{ width: '100%', border: '1.5px solid #e0d8c8', borderRadius: 10, padding: '12px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a3328', outline: 'none', background: '#faf8f3', resize: 'vertical' }}
              />
            </div>

            {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', background: loading ? '#7aaa94' : '#2a5c45', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
            >
              {loading ? 'Sending...' : 'Send message →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}