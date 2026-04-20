import { NextResponse } from 'next/server'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function fallbackReply(message: string) {
  const text = message.toLowerCase()

  if (text.includes('dashboard') || text.includes('site')) {
    return 'World Dashboard brings several high-signal feeds together in one place, including crypto, news, travel, stocks, viral content, and a daily brief.'
  }

  if (text.includes('first') || text.includes('start') || text.includes('check')) {
    return 'A good starting order is Today Brief first, then News and Crypto, and then the sections most relevant to your goals such as Stocks, Flights, or Viral.'
  }

  if (text.includes('use') || text.includes('how')) {
    return 'Use the top navigation to jump between sections, search to find a topic, and customize to pin or hide sections. Focus on changes, trends, and standout items rather than reading every card equally.'
  }

  if (text.includes('news')) {
    return 'The News section is useful for a fast scan of major developments. Pair it with Today Brief for context and then check other sections that may be affected.'
  }

  if (text.includes('crypto')) {
    return 'The Crypto area helps you track market moves, related market signals, and whale activity. It is best used together with the brief and news sections.'
  }

  return 'I can help explain this dashboard, suggest which sections to focus on, and show how to use the site more effectively.'
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const message = String(body?.message || '')
    const history = (body?.history || []) as Message[]
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ reply: fallbackReply(message) })
    }

    const systemPrompt = `You are an AI assistant for World Dashboard.
Your job is to help users understand the dashboard, what each section is for, and how to interpret it.
Be concise, practical, and honest.
Do not invent facts not present in the user's message.
Prefer short helpful answers over long generic explanations.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
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
