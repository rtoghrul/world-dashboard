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

function findGermanyDropdown() {
  const candidates = Array.from(document.querySelectorAll('div, nav, section, aside')) as HTMLElement[]

  return candidates.find(element => {
    const text = element.innerText || ''
    if (text.length > 1200) return false
    return text.includes('Government') && text.includes('Housing') && text.includes('German Language')
  })
}

function cloneOrStyleLink(link: HTMLAnchorElement, firstLink: HTMLAnchorElement | null) {
  if (firstLink?.className) {
    link.className = firstLink.className
  } else {
    link.style.display = 'block'
    link.style.padding = '10px 14px'
    link.style.borderRadius = '10px'
    link.style.color = '#c7c7d8'
    link.style.textDecoration = 'none'
    link.style.fontSize = '14px'
  }
  link.style.cursor = 'pointer'
}

function appendLink(dropdown: HTMLElement, link: HTMLAnchorElement, firstLink: HTMLAnchorElement | null) {
  if (firstLink?.parentElement && dropdown.contains(firstLink.parentElement)) {
    firstLink.parentElement.appendChild(link)
  } else {
    dropdown.appendChild(link)
  }
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
  cloneOrStyleLink(factsLink, firstLink)
  appendLink(dropdown, factsLink, firstLink)
}

function addSavingsToGermanyDropdown() {
  const dropdown = findGermanyDropdown()
  if (!dropdown) return
  if (dropdown.querySelector('[data-germany-savings-link="true"]')) return

  const firstLink = dropdown.querySelector('a') as HTMLAnchorElement | null
  const savingsLink = document.createElement('a')
  savingsLink.href = '/section/germany/savings'
  savingsLink.setAttribute('data-germany-savings-link', 'true')
  savingsLink.textContent = 'Savings Apps 💶'
  cloneOrStyleLink(savingsLink, firstLink)

  const autoLink = Array.from(dropdown.querySelectorAll('a')).find(link => (link.textContent || '').includes('Auto')) as HTMLAnchorElement | undefined
  if (autoLink?.parentElement && dropdown.contains(autoLink.parentElement)) {
    autoLink.parentElement.insertBefore(savingsLink, autoLink)
  } else {
    appendLink(dropdown, savingsLink, firstLink)
  }
}

export default function MainMenuDropdown() {
  useEffect(() => {
    const run = () => {
      addFactsToViralDropdown()
      addSavingsToGermanyDropdown()
    }

    run()

    const observer = new MutationObserver(run)

    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
