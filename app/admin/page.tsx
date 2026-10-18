'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

interface Profile { id: string; email: string; created_at: string }

export default function AdminPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isAdminEmail(user.email)) {
        router.push('/')
        return
      }

      const [{ data: p }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
      ])

      setProfiles(p || [])
      setTotalViews(count || 0)
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <p className="text-ink-3">Yüklənir...</p>
    </div>
  )

  return (
    <main id="main-content" className="min-h-screen bg-surface-0 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink-1">Admin Panel</h1>
            <p className="text-ink-3 text-sm mt-1">World Dashboard idarəetməsi</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 bg-surface-2 text-ink-2 rounded-lg text-sm hover:bg-surface-3 transition">
              Dashboarda qayıt
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition">
              Çıxış
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-1 rounded-xl p-5 border border-line">
            <p className="text-ink-3 text-sm">Ümumi baxış</p>
            <p className="text-3xl font-bold text-indigo-400 mt-1">{totalViews}</p>
          </div>
          <div className="bg-surface-1 rounded-xl p-5 border border-line">
            <p className="text-ink-3 text-sm">Qeydiyyatlı istifadəçi</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{profiles.length}</p>
          </div>
        </div>

        {/* Users */}
        <div className="bg-surface-1 rounded-xl border border-line overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="text-ink-1 font-medium">İstifadəçilər</h2>
          </div>
          {profiles.length === 0 ? (
            <p className="text-ink-3 text-sm p-5">Hələ ki istifadəçi yoxdur.</p>
          ) : (
            <div className="divide-y divide-line">
              {profiles.map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-ink-1 text-sm">{p.email}</p>
                    <p className="text-ink-3 text-xs mt-0.5">
                      {new Date(p.created_at).toLocaleDateString('az-AZ')}
                    </p>
                  </div>
                  {isAdminEmail(p.email) && (
                    <span className="text-xs bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full">Admin</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
