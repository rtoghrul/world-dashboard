'use client'
import { useEffect } from 'react'

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    // In dev, webpack chunk URLs are stable but their content changes on every
    // rebuild — a caching SW then serves stale JS against fresh SSR HTML and
    // hydration dies silently. Only register in production, and actively
    // unregister anything left over from previous sessions in dev.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations()
        .then(regs => regs.forEach(reg => reg.unregister()))
        .catch(() => {})
      if ('caches' in window) {
        caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {})
      }
      return
    }
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])
  return null
}
