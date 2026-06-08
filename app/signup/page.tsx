'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup() {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-[#f4faf7] font-sans flex flex-col">
      <nav className="bg-white border-b border-[#d4ede2] px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#1D9E75] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 34 34" fill="none">
              <path d="M17 4C17 4 9 11 9 19a8 8 0 0016 0c0-8-8-15-8-15z" fill="#fff" opacity=".95"/>
              <path d="M17 12C17 12 13 16 13 20a4 4 0 008 0c0-4-4-8-4-8z" fill="#0F6E56" opacity=".4"/>
              <path d="M17 24v5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-xl font-medium text-[#0a2e22]">Nouri<span className="text-[#1D9E75]">well</span></span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#d4ede2] rounded-2xl p-10">
            <h1 className="text-3xl font-medium text-[#0a2e22] mb-2">Create your account</h1>
            <p className="text-sm text-[#7aaa94] mb-8">Start your holistic wellness journey — free forever</p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-6">
                {error}
              </div>
            )}

            <div className="mb-5">
              <label className="text-sm text-[#4a6b5e] mb-2 block">Email</label>
              <input
                type="email"
                className="w-full border-2 border-[#d4ede2] rounded-xl px-4 py-3 text-base font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label className="text-sm text-[#4a6b5e] mb-2 block">Password</label>
              <input
                type="password"
                className="w-full border-2 border-[#d4ede2] rounded-xl px-4 py-3 text-base font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <label className="text-sm text-[#4a6b5e] mb-2 block">Confirm password</label>
              <input
                type="password"
                className="w-full border-2 border-[#d4ede2] rounded-xl px-4 py-3 text-base font-sans text-[#0a2e22] focus:outline-none focus:border-[#1D9E75]"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading || !email || !password || !confirmPassword}
              className="w-full py-4 bg-[#1D9E75] text-white rounded-xl border-none cursor-pointer text-base font-medium hover:bg-[#0F6E56] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-xs text-center text-[#7aaa94] mb-4">
              By signing up you agree to our terms of service and privacy policy.
            </p>

            <p className="text-sm text-center text-[#7aaa94]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#1D9E75] font-medium no-underline hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
