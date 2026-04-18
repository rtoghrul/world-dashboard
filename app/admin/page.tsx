'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

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
      if (!user || user.email !== 'eagleeye385@gmail.com') {
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Yüklənir...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">World Dashboard idarəetməsi</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition">
              Dashboarda qayıt
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition">
              Çıxış
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Ümumi baxış</p>
            <p className="text-3xl font-bold text-indigo-400 mt-1">{totalViews}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">Qeydiyyatlı istifadəçi</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{profiles.length}</p>
          </div>
        </div>

        {/* Users */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-white font-medium">İstifadəçilər</h2>
          </div>
          {profiles.length === 0 ? (
            <p className="text-gray-500 text-sm p-5">Hələ ki istifadəçi yoxdur.</p>
          ) : (
            <div className="divide-y divide-gray-800">
              {profiles.map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm">{p.email}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(p.created_at).toLocaleDateString('az-AZ')}
                    </p>
                  </div>
                  {p.email === 'eagleeye385@gmail.com' && (
                    <span className="text-xs bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full">Admin</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
