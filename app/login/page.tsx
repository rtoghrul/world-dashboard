'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Globe2, LockKeyhole, Mail, PlayCircle, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email və ya şifrə yanlışdır. Məlumatları yoxlayıb yenidən cəhd et.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gray-950 text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex items-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.28),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.16),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.9),rgba(3,7,18,1))]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
          <div className="relative max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-sm font-medium text-indigo-200">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              World Dashboard
            </div>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Qlobal bazarları, xəbərləri və trendləri bir paneldə izlə.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-gray-300">
              Kripto, səhm bazarı, dünya xəbərləri, uçuşlar, təhsil və YouTube trendləri hər gün daha sürətli qərar vermək üçün bir yerdə.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: TrendingUp, label: 'Canlı bazarlar' },
                { icon: BarChart3, label: 'Qısa icmal' },
                { icon: PlayCircle, label: 'Trend videolar' },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <item.icon className="mb-2 h-5 w-5 text-indigo-300" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-100">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <p className="text-sm font-medium text-indigo-300">Xoş gəlmisən</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Daxil ol</h2>
              <p className="mt-1 text-sm text-gray-400">Dashboard-u açmaq üçün hesabına daxil ol.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900/80 p-6 shadow-2xl shadow-black/30">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-gray-300">Email</label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    spellCheck={false}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-gray-300">Şifrə</label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30">
                  <LockKeyhole className="h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300" aria-live="polite">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {loading ? 'Yüklənir…' : 'Daxil ol'}
              </button>
              <p className="text-center text-xs text-gray-500">
                Hesabın yoxdur?{' '}
                <Link href="/register" className="font-medium text-indigo-300 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">Qeydiyyat</Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
