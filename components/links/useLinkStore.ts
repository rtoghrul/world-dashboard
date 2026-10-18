'use client'
import { useEffect, useState } from 'react'
import { useStoredList } from '@/components/horizon/useStoredList'
import { DEFAULT_PINS, type LinkItem } from '@/lib/links'

const PIN_INIT = 'wd-links-pins-init'

/** Pinned URLs (shown on home) and the user's own links; localStorage only. */
export function useLinkStore() {
  const [pins, updatePins] = useStoredList<string>('wd-links-pins', 24)
  const [mine, updateMine] = useStoredList<LinkItem>('wd-links-mine', 60)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try {
      if (!localStorage.getItem(PIN_INIT)) {
        localStorage.setItem(PIN_INIT, '1')
        updatePins(() => DEFAULT_PINS)
      }
    } catch {}
    setReady(true)
  }, [updatePins])
  const togglePin = (url: string) => updatePins(prev => prev.includes(url) ? prev.filter(p => p !== url) : [...prev, url])
  const addMine = (item: LinkItem) => updateMine(prev => [item, ...prev.filter(p => p.url !== item.url)])
  const removeMine = (url: string) => { updateMine(prev => prev.filter(p => p.url !== url)); updatePins(prev => prev.filter(p => p !== url)) }
  return { pins, mine, ready, togglePin, addMine, removeMine }
}
