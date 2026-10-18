'use client'
import { useCallback, useEffect, useState } from 'react'

/** A small localStorage-backed list, synced across tabs. Never throws (private mode, quota). */
export function useStoredList<T>(key: string, max: number) {
  const [list, setList] = useState<T[]>([])
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(key)
        const parsed = raw ? JSON.parse(raw) : []
        setList(Array.isArray(parsed) ? parsed : [])
      } catch { setList([]) }
    }
    load()
    const onStorage = (e: StorageEvent) => { if (e.key === key) load() }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])
  const update = useCallback((fn: (prev: T[]) => T[]) => {
    setList(prev => {
      const next = fn(prev).slice(0, max)
      try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
      return next
    })
  }, [key, max])
  return [list, update] as const
}
