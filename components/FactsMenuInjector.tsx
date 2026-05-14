'use client'

import { useEffect } from 'react'

function getFactsLabel() {
  const text = document.body.innerText || ''
  if (text.includes('Xəbərlər')) return 'Faktlar'
  if (text.includes('Новости')) return 'Факты'
  if (text.includes('Nachrichten')) return 'Fakten'
  return 'Facts'
}

function isMenuOpen() {
  const text = document.body.innerText || ''
  return text.includes('Menu') && (text.includes('Xəbərlər') || text.includes('News') || text.includes('Bazarlar') || text.includes('Markets'))
}

function upsertFactsMenuItem() {
  const existing = document.querySelector('[data-facts-menu-item="true"]') as HTMLAnchorElement | null

  if (!isMenuOpen()) {
    existing?.remove()
    return
  }

  if (existing) {
    existing.textContent = `${getFactsLabel()}  ›`
    return
  }

  const item = document.createElement('a')
  item.href = '/section/facts'
  item.setAttribute('data-facts-menu-item', 'true')
  item.textContent = `${getFactsLabel()}  ›`
  item.style.position = 'fixed'
  item.style.zIndex = '2147483647'
  item.style.left = '160px'
  item.style.right = '0'
  item.style.top = '276px'
  item.style.height = '58px'
  item.style.display = 'flex'
  item.style.alignItems = 'center'
  item.style.justifyContent = 'space-between'
  item.style.padding = '0 46px 0 36px'
  item.style.boxSizing = 'border-box'
  item.style.textDecoration = 'none'
  item.style.color = 'rgb(226, 232, 240)'
  item.style.background = 'rgb(10, 10, 16)'
  item.style.borderTop = '1px solid rgba(255,255,255,0.04)'
  item.style.borderBottom = '1px solid rgba(255,255,255,0.04)'
  item.style.fontSize = '20px'
  item.style.fontWeight = '600'
  item.style.letterSpacing = '0.01em'

  document.body.appendChild(item)
}

export default function FactsMenuInjector() {
  useEffect(() => {
    upsertFactsMenuItem()

    const observer = new MutationObserver(upsertFactsMenuItem)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })

    window.addEventListener('click', upsertFactsMenuItem, true)
    window.addEventListener('keydown', upsertFactsMenuItem, true)

    const interval = window.setInterval(upsertFactsMenuItem, 300)

    return () => {
      observer.disconnect()
      window.removeEventListener('click', upsertFactsMenuItem, true)
      window.removeEventListener('keydown', upsertFactsMenuItem, true)
      window.clearInterval(interval)
    }
  }, [])

  return null
}
