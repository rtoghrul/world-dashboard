'use client'

import { useEffect } from 'react'

const labels: Record<string, string> = {
  en: 'Learn more',
  az: 'Daha ətraflı',
  ru: 'Подробнее',
  de: 'Mehr erfahren',
  tr: 'Daha fazla bilgi',
  fr: 'En savoir plus',
  es: 'Más información',
  zh: '了解更多',
  ar: 'اعرف المزيد',
  ja: '詳しく見る',
  it: 'Scopri di più',
  pt: 'Saiba mais',
}

function getLang() {
  const raw = localStorage.getItem('dashboard-lang') || 'en'
  return raw.toLowerCase().split('-')[0]
}

function buildDetailsUrl(title: string, category: string) {
  const cleanTitle = title.replace(/#[0-9]+/g, '').trim()
  const query = `${cleanTitle} ${category} fact explanation source`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

function addLinks() {
  const lang = getLang()
  const label = labels[lang] || labels.en
  const cards = Array.from(document.querySelectorAll('article')) as HTMLElement[]

  cards.forEach(card => {
    if (card.querySelector('[data-facts-learn-more="true"]')) return

    const title = card.querySelector('h2')?.textContent?.trim()
    if (!title) return

    const chip = card.querySelector('div')?.textContent?.trim() || 'facts'
    const link = document.createElement('a')
    link.href = buildDetailsUrl(title, chip)
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.dataset.factsLearnMore = 'true'
    link.textContent = `${label} ↗`
    link.className = 'inline-flex items-center gap-1 mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition'

    card.appendChild(link)
  })
}

export default function FactsLearnMoreInjector() {
  useEffect(() => {
    addLinks()
    const observer = new MutationObserver(addLinks)
    observer.observe(document.body, { childList: true, subtree: true })
    const interval = window.setInterval(addLinks, 500)

    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [])

  return null
}
