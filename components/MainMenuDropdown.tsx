'use client'

import { useEffect } from 'react'

function findViralDropdown() {
  const candidates = Array.from(document.querySelectorAll('div, nav, section, aside')) as HTMLElement[]

  return candidates.find(element => {
    const text = element.innerText || ''
    if (text.length > 800) return false
    return text.includes('YouTube') && text.includes('TikTok') && text.includes('Instagram')
  })
}

function addFactsToViralDropdown() {
  const dropdown = findViralDropdown()
  if (!dropdown) return
  if (dropdown.querySelector('[data-viral-facts-link="true"]')) return

  const firstLink = dropdown.querySelector('a') as HTMLAnchorElement | null
  const factsLink = document.createElement('a')
  factsLink.href = '/facts'
  factsLink.setAttribute('data-viral-facts-link', 'true')
  factsLink.textContent = 'Facts'

  if (firstLink?.className) {
    factsLink.className = firstLink.className
  } else {
    factsLink.style.display = 'block'
    factsLink.style.padding = '10px 14px'
    factsLink.style.borderRadius = '10px'
    factsLink.style.color = '#c7c7d8'
    factsLink.style.textDecoration = 'none'
    factsLink.style.fontSize = '14px'
  }

  factsLink.style.cursor = 'pointer'

  if (firstLink?.parentElement && dropdown.contains(firstLink.parentElement)) {
    firstLink.parentElement.appendChild(factsLink)
  } else {
    dropdown.appendChild(factsLink)
  }
}

export default function MainMenuDropdown() {
  useEffect(() => {
    addFactsToViralDropdown()

    const observer = new MutationObserver(() => {
      addFactsToViralDropdown()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
