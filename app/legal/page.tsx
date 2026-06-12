'use client'
import { useState } from 'react'
import Link from 'next/link'

const SECTIONS = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: 'May 25, 2026',
    content: [
      { heading: 'Information we collect', body: 'When you create a Nouriwell account, we collect your name, email address, and the wellness profile information you provide during onboarding — including age range, health goals, diet preferences, stress level, allergies, and medications. We also collect usage data such as remedy search history and subscription status.' },
      { heading: 'How we use your information', body: 'Your profile data is used to personalize AI-generated remedy recommendations, recipes, and wellness content. We do not sell your personal information to third parties. We use your email to send account-related communications and, if you opt in, occasional product updates.' },
      { heading: 'AI and data processing', body: 'When you use features like the Remedy Finder, your symptom descriptions and profile data are sent to our AI provider (Anthropic) to generate personalized responses. This data is processed in accordance with our providers\' privacy policies and is not used to train public AI models.' },
      { heading: 'Data storage and security', body: 'Your data is stored securely using Supabase, with encryption in transit and at rest. Payment information is handled entirely by Stripe — we never store your credit card details on our servers.' },
      { heading: 'Your rights', body: 'You can view, update, or delete your profile at any time from your account settings. To request a full data export or deletion, contact us at hello@nouriwell.co. We will respond within 30 days.' },
      { heading: 'Cookies', body: 'We use essential cookies to maintain your login session. We do not use advertising or third-party tracking cookies.' },
      { heading: 'Changes to this policy', body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice.' },
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    lastUpdated: 'May 25, 2026',
    content: [
      { heading: 'Acceptance of terms', body: 'By creating an account or using Nouriwell, you agree to these Terms of Service. If you do not agree, please do not use the service.' },
      { heading: 'Description of service', body: 'Nouriwell is a holistic wellness platform that provides AI-powered remedy recommendations, supplement tracking, an encyclopedia of natural health information, and related wellness tools. Some features require a paid Pro subscription.' },
      { heading: 'Account responsibilities', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate profile information, especially regarding allergies and medications, as this directly affects the safety of recommendations you receive.' },
      { heading: 'Acceptable use', body: 'You may not use Nouriwell to seek advice for medical emergencies, distribute harmful content, attempt to reverse-engineer our AI systems, or use automated tools to scrape or overload our services.' },
      { heading: 'Subscriptions and billing', body: 'Pro subscriptions are billed monthly at the rate displayed at checkout. Subscriptions renew automatically unless cancelled. You can manage or cancel your subscription at any time through your account settings or the Stripe customer portal.' },
      { heading: 'Intellectual property', body: 'All content, design, and technology on Nouriwell is owned by Nouriwell or its licensors. You may not reproduce, distribute, or create derivative works without our written permission.' },
      { heading: 'Limitation of liability', body: 'Nouriwell is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service.' },
      { heading: 'Termination', body: 'We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from your profile settings.' },
    ],
  },
  {
    id: 'medical',
    title: 'Medical Disclaimer',
    lastUpdated: 'May 25, 2026',
    content: [
      { heading: 'Not medical advice', body: 'Nouriwell is a wellness information platform. Nothing on this site — including AI-generated remedy recommendations, encyclopedia entries, recipes, or hormone balancing guides — constitutes medical advice, diagnosis, or treatment.' },
      { heading: 'Consult a healthcare provider', body: 'Always consult a qualified healthcare provider before starting any new supplement, herb, essential oil, diet change, or wellness practice — especially if you are pregnant, nursing, taking medications, or have a chronic health condition.' },
      { heading: 'AI-generated content', body: 'Our AI recommendations are generated based on general holistic health knowledge and your profile information. They are not reviewed by medical professionals and may not be appropriate for your specific situation. Use your own judgment and verify information with trusted sources.' },
      { heading: 'Drug interactions and allergies', body: 'While we ask about allergies and medications in your profile, our system cannot guarantee it will identify every potential interaction. Never rely solely on Nouriwell to screen for drug-herb or drug-supplement interactions.' },
      { heading: 'Emergencies', body: 'Nouriwell is not designed for medical emergencies. If you are experiencing a medical emergency, call your local emergency number immediately.' },
      { heading: 'No doctor-patient relationship', body: 'Using Nouriwell does not create a doctor-patient or provider-patient relationship between you and Nouriwell or any of its team members.' },
    ],
  },
  {
    id: 'refund',
    title: 'Refund Policy',
    lastUpdated: 'May 25, 2026',
    content: [
      { heading: 'Free plan', body: 'The Seed (free) plan requires no payment and has no refund implications.' },
      { heading: 'Pro subscription refunds', body: 'Root Pro subscriptions are billed monthly. If you are unsatisfied with your Pro subscription, you may request a refund within 7 days of your initial purchase or most recent renewal. Contact us at hello@nouriwell.co with your account email and reason for the request.' },
      { heading: 'How to cancel', body: 'You can cancel your Pro subscription at any time from your profile settings by clicking "Manage subscription." Cancellation takes effect at the end of your current billing period — you will retain Pro access until then.' },
      { heading: 'Partial refunds', body: 'We do not offer prorated refunds for partial months. If you cancel mid-cycle, you keep access until the period ends but will not be charged again.' },
      { heading: 'Chargebacks', body: 'If you have a billing issue, please contact us before initiating a chargeback with your bank. We are happy to resolve issues directly and promptly.' },
      { heading: 'Processing time', body: 'Approved refunds are processed within 5–10 business days and will appear on your original payment method.' },
    ],
  },
]

export default function Legal() {
  const [openSection, setOpenSection] = useState<string | null>('privacy')

  function toggle(id: string) {
    setOpenSection(openSection === id ? null : id)
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
        <h1 style={{ fontSize: 40, fontWeight: 500, color: '#fff', marginBottom: 12 }}>Legal</h1>
        <p style={{ fontSize: 16, color: '#8aad96', maxWidth: 520, margin: '0 auto' }}>
          Privacy policy, terms of service, medical disclaimer, and refund policy for Nouriwell.
        </p>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ background: '#fff', border: '0.5px solid #e0d8c8', borderRadius: 16, overflow: 'hidden' }}>
          {SECTIONS.map((section, i) => {
            const isOpen = openSection === section.id
            return (
              <div key={section.id} style={{ borderBottom: i < SECTIONS.length - 1 ? '0.5px solid #e0d8c8' : 'none' }}>
                <button
                  onClick={() => toggle(section.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    background: isOpen ? '#faf8f3' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#1a3328' }}>{section.title}</div>
                    <div style={{ fontSize: 11, color: '#8aad96', marginTop: 2 }}>Last updated {section.lastUpdated}</div>
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  >
                    <path d="M6 9l6 6 6-6" stroke="#5a7a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {isOpen && (
                  <div style={{ padding: '20px 20px 24px', borderTop: '0.5px solid #e0d8c8', background: '#faf8f3' }}>
                    {section.content.map(block => (
                      <div key={block.heading} style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#2a5c45', marginBottom: 6, letterSpacing: '0.02em' }}>{block.heading}</h3>
                        <p style={{ fontSize: 14, color: '#5a7a6a', lineHeight: 1.7, margin: 0 }}>{block.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: 13, color: '#8aad96', textAlign: 'center', marginTop: 32 }}>
          Questions about our policies?{' '}
          <Link href="/contact" style={{ color: '#3d8c6a', textDecoration: 'none', fontWeight: 500 }}>Contact us</Link>
        </p>
      </div>
    </div>
  )
}
