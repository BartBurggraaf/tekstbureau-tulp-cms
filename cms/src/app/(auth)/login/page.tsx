'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { site } from '../../../../config/site'
import { theme } from '../../../../config/theme'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          {theme.logo ? (
            <img src={theme.logo} alt={site.name} className="h-10 mx-auto mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : null}
          <h1 className="text-2xl font-headline font-bold text-on-surface">{site.name}</h1>
          <p className="text-sm text-outline mt-1">{site.tagline}</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_20px_40px_rgba(43,52,55,0.06)]">
          <h2 className="text-lg font-headline font-bold text-on-surface mb-6">Sign in</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-label font-bold uppercase tracking-widest text-outline">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-label font-bold uppercase tracking-widest text-outline">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-surface-container-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-on-primary py-3 rounded-lg font-bold text-sm transition-opacity disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-outline mt-6">
          {site.name} &mdash; Powered by Burgt CMS
        </p>
      </div>
    </div>
  )
}
