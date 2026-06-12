'use client'
import { useState } from 'react'
import Link from 'next/link'

function LegalBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#2a5c45', marginBottom: 8, letterSpacing: '0.02em' }}>{heading}</h3>
      <div style={{ fontSize: 14, color: '#5a7a6a', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

function LegalList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
      {items.map(item => (
        <li key={item} style={{ marginBottom: 6 }}>{item}</li>
      ))}
    </ul>
  )
}

function PrivacyContent() {
  return (
    <>
      <LegalBlock heading="1. Who We Are">
        Nouriwell (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a holistic wellness platform operated as a sole proprietorship. You can contact us at hello@nouriwell.co.
      </LegalBlock>
      <LegalBlock heading="2. What Information We Collect">
        We collect information you provide directly:
        <LegalList items={[
          'Name and email address when you create an account',
          'Wellness profile data including age range, health goals, dietary preferences, stress level, allergies, and current medications',
          'Symptoms and health concerns you enter when using the remedy finder',
          'Payment information (processed securely by Stripe — we never store your card details)',
        ]} />
        We automatically collect:
        <LegalList items={[
          'Usage data such as features accessed and search history',
          'Device and browser information',
        ]} />
      </LegalBlock>
      <LegalBlock heading="3. How We Use Your Information">
        We use your information to:
        <LegalList items={[
          'Provide personalized holistic remedy recommendations',
          'Operate and improve the Nouriwell platform',
          'Process your subscription payments',
          'Send you account-related emails',
          'Respond to your support requests',
        ]} />
      </LegalBlock>
      <LegalBlock heading="4. Health Information">
        You may choose to share sensitive health information including symptoms, medications, and allergies. This information is used solely to personalize your experience on Nouriwell. We do not sell, share, or disclose your health information to third parties except as described in this policy.
      </LegalBlock>
      <LegalBlock heading="5. Who We Share Your Information With">
        We share your data only with:
        <LegalList items={[
          'Supabase — our database provider (data storage)',
          'Stripe — our payment processor (billing only)',
          'Anthropic — AI provider that powers remedy recommendations (your symptom queries are processed to generate responses)',
          'Resend — email delivery service',
        ]} />
        We do not sell your personal information to anyone, ever.
      </LegalBlock>
      <LegalBlock heading="6. Data Retention">
        We retain your data for as long as your account is active. You can delete your account at any time from your profile page, which permanently deletes all your data.
      </LegalBlock>
      <LegalBlock heading="7. Your Rights">
        You have the right to:
        <LegalList items={[
          'Access the data we hold about you',
          'Correct inaccurate data',
          'Delete your account and all associated data',
          'Export your data by contacting us',
        ]} />
      </LegalBlock>
      <LegalBlock heading="8. Children's Privacy">
        Nouriwell is not intended for children under 13. We do not knowingly collect data from children under 13.
      </LegalBlock>
      <LegalBlock heading="9. Changes to This Policy">
        We may update this policy from time to time. We&apos;ll notify you of significant changes by email.
      </LegalBlock>
      <LegalBlock heading="10. Contact Us">
        Questions about this privacy policy? Email us at hello@nouriwell.co
      </LegalBlock>
    </>
  )
}

function TermsContent() {
  return (
    <>
      <LegalBlock heading="1. Acceptance of Terms">
        By creating an account or using Nouriwell, you agree to these Terms of Service. If you do not agree, please do not use our service.
      </LegalBlock>
      <LegalBlock heading="2. Description of Service">
        Nouriwell is an AI-powered holistic wellness platform that provides general wellness information, remedy suggestions, and health resources. Nouriwell is NOT a medical provider, healthcare service, or pharmacy.
      </LegalBlock>
      <LegalBlock heading="3. Medical Disclaimer">
        <p style={{ fontWeight: 600, color: '#1a3328', margin: '0 0 8px' }}>
          THE INFORMATION PROVIDED BY NOURIWELL IS FOR GENERAL WELLNESS AND INFORMATIONAL PURPOSES ONLY. IT IS NOT INTENDED TO BE A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. ALWAYS SEEK THE ADVICE OF YOUR PHYSICIAN OR OTHER QUALIFIED HEALTH PROVIDER WITH ANY QUESTIONS YOU MAY HAVE REGARDING A MEDICAL CONDITION. NEVER DISREGARD PROFESSIONAL MEDICAL ADVICE OR DELAY SEEKING IT BECAUSE OF SOMETHING YOU HAVE READ OR RECEIVED FROM NOURIWELL.
        </p>
      </LegalBlock>
      <LegalBlock heading="4. Subscription and Billing">
        <LegalList items={[
          'The free Seed plan includes 3 remedy searches per month',
          'The Root Pro plan is $12/month and includes unlimited searches and all Pro features',
          'Subscriptions automatically renew monthly until cancelled',
          'You may cancel at any time — your Pro access continues until the end of your current billing period',
          'We do not offer refunds for partial months',
        ]} />
      </LegalBlock>
      <LegalBlock heading="5. Account Responsibilities">
        You are responsible for:
        <LegalList items={[
          'Maintaining the security of your account password',
          'All activity that occurs under your account',
          'Providing accurate information',
        ]} />
      </LegalBlock>
      <LegalBlock heading="6. Prohibited Uses">
        You may not:
        <LegalList items={[
          'Use Nouriwell for any unlawful purpose',
          'Attempt to gain unauthorized access to any part of the service',
          'Share your account with others',
          'Use the service to harm yourself or others',
        ]} />
      </LegalBlock>
      <LegalBlock heading="7. Intellectual Property">
        All content, features, and functionality of Nouriwell are owned by Nouriwell and protected by copyright law. You may not copy, modify, or distribute any part of our service without written permission.
      </LegalBlock>
      <LegalBlock heading="8. Limitation of Liability">
        <p style={{ fontWeight: 600, color: '#1a3328', margin: 0 }}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOURIWELL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS.
        </p>
      </LegalBlock>
      <LegalBlock heading="9. Indemnification">
        You agree to indemnify and hold Nouriwell harmless from any claims, damages, or expenses arising from your use of the service or violation of these terms.
      </LegalBlock>
      <LegalBlock heading="10. Termination">
        We reserve the right to terminate or suspend your account at any time for violation of these terms.
      </LegalBlock>
      <LegalBlock heading="11. Governing Law">
        These terms are governed by the laws of the State of Tennessee.
      </LegalBlock>
      <LegalBlock heading="12. Changes to Terms">
        We may update these terms at any time. Continued use of Nouriwell after changes constitutes acceptance of the new terms.
      </LegalBlock>
      <LegalBlock heading="13. Contact">
        Questions? Email us at hello@nouriwell.co
      </LegalBlock>
    </>
  )
}

function MedicalContent() {
  return (
    <>
      <p style={{ fontSize: 14, color: '#5a7a6a', lineHeight: 1.7, margin: '0 0 20px' }}>
        The content provided by Nouriwell, including but not limited to remedy suggestions, supplement recommendations, herbal guidance, and wellness information, is intended for general informational purposes only.
      </p>
      <LegalBlock heading="Nouriwell is not:">
        <LegalList items={[
          'A licensed medical provider',
          'A substitute for professional medical advice',
          'A diagnostic tool',
          'A treatment service',
        ]} />
      </LegalBlock>
      <LegalBlock heading="Always consult a qualified healthcare provider before:">
        <LegalList items={[
          'Starting any new supplement, herb, or essential oil regimen',
          'Making changes to existing medications or treatments',
          'Using any remedy if you are pregnant, nursing, or trying to conceive',
          'Treating any medical condition or symptom',
          'Giving supplements to children',
        ]} />
      </LegalBlock>
      <LegalBlock heading="Do not use Nouriwell to:">
        <LegalList items={[
          'Diagnose or treat any medical condition',
          'Replace prescribed medications without consulting your doctor',
          'Address emergency medical situations (call 911 for emergencies)',
        ]} />
      </LegalBlock>
      <p style={{ fontSize: 14, color: '#5a7a6a', lineHeight: 1.7, margin: '0 0 20px' }}>
        Individual responses to herbs, supplements, and essential oils vary. What works for one person may not work for another and may cause adverse reactions in some individuals. Always start with the lowest recommended dose and monitor your response.
      </p>
      <p style={{ fontSize: 14, color: '#5a7a6a', lineHeight: 1.7, margin: 0 }}>
        The AI-generated recommendations on Nouriwell are based on general wellness research and your self-reported profile. They do not account for your complete medical history and should not be treated as personalized medical advice.
      </p>
    </>
  )
}

function RefundContent() {
  return (
    <>
      <LegalBlock heading="Subscriptions">
        Nouriwell Root Pro is billed monthly at $12/month.
        <LegalList items={[
          'You may cancel your subscription at any time from your profile page',
          'Upon cancellation, you retain Pro access until the end of your current billing period',
          'We do not offer prorated refunds for unused portions of a billing period',
        ]} />
      </LegalBlock>
      <LegalBlock heading="Exceptions">
        We will issue a full refund in the following cases:
        <LegalList items={[
          'You were charged after cancelling due to a technical error on our part',
          'You were charged twice for the same billing period',
          'You contact us within 48 hours of your first charge and have not used any Pro features',
        ]} />
        To request a refund under these exceptions, email hello@nouriwell.co with your account email and reason for the request.
      </LegalBlock>
      <LegalBlock heading="Free Plan">
        The free Seed plan does not involve any charges and therefore no refund policy applies.
      </LegalBlock>
    </>
  )
}

const SECTIONS = [
  { id: 'privacy', title: 'Privacy Policy', subtitle: 'Nouriwell Privacy Policy · Last updated: June 2026', content: <PrivacyContent /> },
  { id: 'terms', title: 'Terms of Service', subtitle: 'Nouriwell Terms of Service · Last updated: June 2026', content: <TermsContent /> },
  { id: 'medical', title: 'Medical Disclaimer', subtitle: 'Nouriwell Medical Disclaimer · Last updated: June 2026', content: <MedicalContent /> },
  { id: 'refund', title: 'Refund Policy', subtitle: 'Nouriwell Refund Policy · Last updated: June 2026', content: <RefundContent /> },
]

export default function Legal() {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (s: string) => setOpenSection(openSection === s ? null : s)

  const sectionHeader = (key: string, label: string, value: string) => (
    <div
      onClick={() => toggleSection(key)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', background: openSection === key ? '#faf8f3' : '#fff' }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3328' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#8aad96', marginTop: 2 }}>{value}</div>
      </div>
      <div style={{ fontSize: 18, color: '#8aad96', transform: openSection === key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</div>
    </div>
  )

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
          {SECTIONS.map((section, i) => (
            <div key={section.id} style={{ borderBottom: i < SECTIONS.length - 1 ? '0.5px solid #e0d8c8' : 'none' }}>
              {sectionHeader(section.id, section.title, section.subtitle)}
              {openSection === section.id && (
                <div style={{ padding: '16px 20px', borderTop: '0.5px solid #f0ede8', background: '#faf8f3' }}>
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#8aad96', textAlign: 'center', marginTop: 32 }}>
          Questions about our policies?{' '}
          <Link href="/contact" style={{ color: '#3d8c6a', textDecoration: 'none', fontWeight: 500 }}>Contact us</Link>
        </p>
      </div>
    </div>
  )
}
