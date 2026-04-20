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
    if (text.includes('salam') || text.includes('nec')) return 'Salam 👋 Necəsən? Mən kömək etməyə hazıram. Dashboard barədə nə bilmək istəyirsən?'
    return 'Mən World Dashboard assistantıyəm. Nə demək istədiyini başa düşməyə çalışaram və kömək edərəm.'
  }

  if (lang === 'Russian') {
    if (text.includes('привет')) return 'Привет 👋 Как дела? Чем могу помочь по dashboard?'
    return 'Я assistant для World Dashboard. Постараюсь понять тебя и помочь.'
  }

  if (lang === 'German') {
    if (text.includes('hallo') || text.includes('hi')) return 'Hallo 👋 Wie geht’s? Wie kann ich beim Dashboard helfen?'
    return 'Ich bin der Assistant für World Dashboard und helfe dir gern.'
  }

  if (lang === 'Turkish') {
    if (text.includes('merhaba') || text.includes('selam')) return 'Merhaba 👋 Nasılsın? Dashboard ile ilgili nasıl yardımcı olayım?'
    return 'Ben World Dashboard assistantıyım, yardımcı olmaya hazırım.'
  }

  if (text.includes('hello') || text.includes('hi')) return 'Hey 👋 How’s it going? How can I help you with the dashboard?'

  return 'I’m your World Dashboard assistant. I’ll try to understand what you mean and help you out.'
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = String(body?.message || '')
    const history = (body?.history || []) as Message[]
    const apiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-8b-instruct:free'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://world-dashboard-delta-umber.vercel.app'
    const siteName = 'World Dashboard'
    const detectedLanguage = detectLanguage(message)

    if (!apiKey) {
      return NextResponse.json({ reply: fallbackReply(message) })
    }

    const systemPrompt = `You are an AI assistant for World Dashboard.
Speak like a real human, friendly and natural.
If the user greets you, greet them back warmly.
Do not sound robotic or overly strict.
Still focus on helping users with the dashboard and guide them to sections when needed.
Understand even short or unclear messages.
Answer clearly and helpfully.
Reply in the same language as the user.
The user's language is: ${detectedLanguage}.`

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
        temperature: 0.7,
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
    return NextResponse.json({
      reply: 'The assistant is having trouble responding right now. Please try again shortly.',
    })
  }
}
