const LANG_MAP: Record<string, string> = {
  zh: 'zh-CN',
  az: 'az-AZ',
}

function mapLang(lang: string) {
  return LANG_MAP[lang] || lang
}

async function translateOne(text: string, target: string): Promise<string> {
  if (!text?.trim()) return text
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=en|${target}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return text
    const data = await res.json()
    const translated = data?.responseData?.translatedText
    return translated && !translated.includes('MYMEMORY WARNING') ? translated : text
  } catch {
    return text
  }
}

export async function translateTexts(texts: string[], lang: string): Promise<string[]> {
  if (!lang || lang === 'en') return texts
  const target = mapLang(lang)
  const results = await Promise.allSettled(texts.map(t => translateOne(t, target)))
  return results.map((r, i) => (r.status === 'fulfilled' ? r.value : texts[i]))
}
