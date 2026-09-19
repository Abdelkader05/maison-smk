'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Identifiants incorrects.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-parchment)] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[var(--color-card)] p-8"
      >
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl text-[var(--color-ink)]">
          Administration
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink)]/60">SMK Market</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-[var(--color-ink)]/80">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--color-ink)]/80">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-[var(--color-bottle)] px-4 py-3 text-sm text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-ink)] disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}