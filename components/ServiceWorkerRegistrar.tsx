'use client'
import { useEffect } from 'react'

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    document.body.classList.add('wd-3d-enabled')
    document.querySelector('body > div')?.classList.add('wd-3d-stage')
    document.querySelector('section')?.classList.add('wd-3d-hero')
    document.querySelector('h1')?.classList.add('wd-3d-title')

    if (!document.getElementById('wd-3d-css')) {
      const link = document.createElement('link')
      link.id = 'wd-3d-css'
      link.rel = 'stylesheet'
      link.href = '/three-d.css'
      document.head.appendChild(link)
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
