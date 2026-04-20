import { NextResponse } from 'next/server'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function detectLanguage(message: string) {
  const text = message.toLowerCase()

  if (/[а-яё]/i.test(message)) return 'Russian'
  if (/[əğşıçöü]/i.test(message) || text.includes('salam') || text.includes('necə') || text.includes('aze') || text.includes('azərbay') || text.includes('bura') || text.includes('neyn')) return 'Azerbaijani'
  if (/[ıİşŞğĞçÇöÖüÜ]/.test(message) || text.includes('merhaba') || text.includes('nasıl')) return 'Turkish'
  if (/[äöüß]/i.test(message) || text.includes('hallo') || text.includes('danke')) return 'German'
  return 'English'
}

function fallbackReply(message: string) {
  const text = message.toLowerCase()
  const lang = detectLanguage(message)

  if (lang === 'Azerbaijani') {
    if (text.includes('salam') || text.includes('nec')) return 'Salam 👋 Necəsən? Nəyə baxırdın dashboardda?'
    return 'Yaza bilərsən 👍 birlikdə baxarıq.'
  }

  if (lang === 'Russian') {
    if (text.includes('привет')) return 'Привет 👋 Как дела? На что смотришь в dashboard?'
    return 'Пиши 👍 разберёмся вместе.'
  }

  if (lang === 'German') {
    if (text.includes('hallo') || text.includes('hi')) return 'Hallo 👋 Wie geht’s? Was schaust du im Dashboard an?'
    return 'Schreib einfach 👍 wir schauen zusammen.'
  }

  if (lang === 'Turkish') {
    if (text.includes('merhaba') || text.includes('selam')) return 'Merhaba 👋 Nasılsın? Dashboardda neye bakıyorsun?'
    return 'Yaz 👍 birlikte bakalım.'
  }

  if (text.includes('hello') || text.includes('hi')) return 'Hey 👋 what are you checking on the dashboard?'

  return 'Just tell me 👍 I’ll help you figure it out.'
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = String(body?.message || '')
    const history = (body?.history || []) as Message[]
    const apiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || 'openrouter/free'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://world-dashboard-delta-umber.vercel.app'
    const siteName = 'World Dashboard'
    const detectedLanguage = detectLanguage(message)

    if (!apiKey) {
      return NextResponse.json({ reply: fallbackReply(message) })
    }

    const systemPrompt = `You are a real AI assistant inside a live dashboard.

Talk like a normal human.
Do NOT sound like a system.
Do NOT introduce yourself.

Be relaxed, friendly, and natural.

Understand short, messy, or incomplete messages.
Continue conversation naturally (like "and?", "what else").

Act like you are inside the dashboard and helping user explore it.

Instead of explaining formally, speak casually:
- suggest what to check
- react to what user says
- guide naturally

Examples:
- "yeah crypto looks interesting today, especially whale activity"
- "you can also check news, it connects to that"
- "wanna look at something else?"

If unrelated → gently redirect (no strict answers)

Keep answers short, natural, and human.

Language: ${detectedLanguage}
`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': siteName,
      },
      body: JSON.stringify({
        model,
        temperature: 0.95,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history.map(item => ({ role: item.role, content: item.content })),
        ],
      }),
    })

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content || fallbackReply(message)

    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ reply: fallbackReply('') })
  }
}
