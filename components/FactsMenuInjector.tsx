'use client'

import { useEffect } from 'react'

const knownFirstMenuItems = ['Xəbərlər', 'News', 'Новости', 'Haberler', 'Nachrichten']

function getFactsLabel() {
  const text = document.body.innerText || ''
  if (text.includes('Xəbərlər')) return 'Faktlar'
  if (text.includes('Новости')) return 'Факты'
  if (text.includes('Nachrichten')) return 'Fakten'
  return 'Facts'
}

function findFirstMenuItem() {
  const elements = Array.from(document.querySelectorAll('button, a, div')) as HTMLElement[]
  return elements.find(element => {
    const text = element.innerText?.trim()
    if (!text || text.length > 40) return false
    return knownFirstMenuItems.some(label => text === label || text.startsWith(label))
  })
}

function injectFactsMenuItem() {
  if (document.querySelector('[data-facts-menu-item="true"]')) return

  const firstItem = findFirstMenuItem()
  const parent = firstItem?.parentElement
  if (!firstItem || !parent) return

  const item = document.createElement('a')
  item.href = '/section/facts'
  item.setAttribute('data-facts-menu-item', 'true')
  item.className = firstItem.className
  item.style.display = 'flex'
  item.style.alignItems = 'center'
  item.style.justifyContent = 'space-between'
  item.style.width = '100%'
  item.style.textDecoration = 'none'
  item.style.color = 'rgb(139, 139, 158)'
  item.style.fontSize = window.innerWidth < 768 ? '20px' : '14px'
  item.style.fontWeight = '500'
  item.style.padding = '14px 36px'

  const label = document.createElement('span')
  label.textContent = getFactsLabel()

  const arrow = document.createElement('span')
  arrow.textContent = '›'
  arrow.style.fontSize = '22px'
  arrow.style.opacity = '0.75'

  item.appendChild(label)
  item.appendChild(arrow)
  parent.insertBefore(item, firstItem)
}

export default function FactsMenuInjector() {
  useEffect(() => {
    injectFactsMenuItem()
    const observer = new MutationObserver(injectFactsMenuItem)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
