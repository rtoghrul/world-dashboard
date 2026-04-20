import { NextResponse } from 'next/server'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function detectLanguage(message: string) {
  const text = message.toLowerCase()

  if (/[а-яё]/i.test(message)) return 'Russian'
  if (/[əğşıçöü]/i.test(message) || text.includes('salam') || text.includes('necə') || text.includes('aze') || text.includes('azərbayc')) return 'Azerbaijani'
  if (/[ıİşŞğĞçÇöÖüÜ]/.test(message) || text.includes('merhaba') || text.includes('nasıl')) return 'Turkish'
  if (/[äöüß]/i.test(message) || text.includes('hallo') || text.includes('danke')) return 'German'
  return 'English'
}

function fallbackReply(message: string) {
  const text = message.toLowerCase()
  const lang = detectLanguage(message)

  if (lang === 'Azerbaijani') {
    if (text.includes('dashboard') || text.includes('site') || text.includes('sayt')) {
      return 'World Dashboard kripto, xəbərlər, səyahət, səhmlər, viral məzmun və gündəlik xülasə kimi əsas bölmələri bir yerdə toplayır.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('hardan') || text.includes('başla')) {
      return 'Başlamaq üçün əvvəl Today Brief, sonra News və Crypto bölmələrinə bax. Daha sonra məqsədinə uyğun olaraq Stocks, Flights və ya Viral hissələrinə keç.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('necə')) {
      return 'Yuxarı menyudan bölmələr arasında keç, axtarışdan mövzu tap, Customize hissəsi ilə bölmələri gizlət və ya önə çək. Ən vacib dəyişikliklərə və trendlərə fokuslan.'
    }
    if (text.includes('news') || text.includes('xəb')) {
      return 'News bölməsi əsas hadisələri tez görmək üçündür. Daha yaxşı nəticə üçün onu Today Brief ilə birlikdə yoxla.'
    }
    if (text.includes('crypto') || text.includes('kripto')) {
      return 'Crypto bölməsi bazar hərəkətlərini, əlaqəli siqnalları və whale aktivliyini izləməyə kömək edir. Onu Brief və News ilə birlikdə istifadə etmək daha faydalıdır.'
    }
    return 'Mən bu dashboardu izah edə, hansı bölmələrə fokuslanmağın daha yaxşı olduğunu deyə və saytdan daha effektiv istifadə etməyə kömək edə bilərəm.'
  }

  if (lang === 'Russian') {
    if (text.includes('dashboard') || text.includes('site') || text.includes('сайт')) {
      return 'World Dashboard собирает в одном месте несколько полезных блоков: крипто, новости, путешествия, акции, вирусный контент и ежедневную сводку.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('с чего') || text.includes('нач')) {
      return 'Лучше начать с Today Brief, потом посмотреть News и Crypto, а затем перейти к разделам, которые важны именно тебе: Stocks, Flights или Viral.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('как')) {
      return 'Используй верхнюю навигацию для перехода между разделами, поиск для быстрого нахождения темы, а Customize — чтобы скрывать или закреплять блоки. Смотри прежде всего на изменения и тренды.'
    }
    if (text.includes('news') || text.includes('новост')) {
      return 'Раздел News подходит для быстрого обзора главных событий. Лучше использовать его вместе с Today Brief для контекста.'
    }
    if (text.includes('crypto') || text.includes('крип')) {
      return 'Раздел Crypto помогает отслеживать движения рынка, связанные сигналы и активность крупных кошельков. Лучше смотреть его вместе с Brief и News.'
    }
    return 'Я могу объяснить этот dashboard, подсказать, на какие разделы смотреть в первую очередь, и помочь использовать сайт эффективнее.'
  }

  if (lang === 'German') {
    if (text.includes('dashboard') || text.includes('site') || text.includes('seite')) {
      return 'World Dashboard bündelt mehrere wichtige Bereiche an einem Ort, darunter Krypto, Nachrichten, Reisen, Aktien, virale Inhalte und eine tägliche Zusammenfassung.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('wo anfangen')) {
      return 'Am besten beginnst du mit Today Brief, danach mit News und Crypto, und gehst dann zu den Bereichen, die für dein Ziel am wichtigsten sind, wie Stocks, Flights oder Viral.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('wie')) {
      return 'Nutze die obere Navigation für die Bereiche, die Suche zum Finden von Themen und Customize zum Anpinnen oder Ausblenden von Sektionen. Achte vor allem auf Änderungen und Trends.'
    }
    if (text.includes('news') || text.includes('nachricht')) {
      return 'Der News-Bereich eignet sich für einen schnellen Überblick über wichtige Entwicklungen. In Kombination mit Today Brief ist er noch hilfreicher.'
    }
    if (text.includes('crypto') || text.includes('krypto')) {
      return 'Der Crypto-Bereich hilft dir dabei, Marktbewegungen, verbundene Signale und Whale-Aktivität zu verfolgen. Zusammen mit Brief und News ist er am nützlichsten.'
    }
    return 'Ich kann dieses Dashboard erklären, passende Bereiche empfehlen und zeigen, wie du die Seite effektiver nutzt.'
  }

  if (lang === 'Turkish') {
    if (text.includes('dashboard') || text.includes('site') || text.includes('site') || text.includes('sitenin')) {
      return 'World Dashboard; kripto, haberler, seyahat, hisseler, viral içerikler ve günlük özet gibi önemli bölümleri tek yerde toplar.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('nereden') || text.includes('başla')) {
      return 'Başlamak için önce Today Brief, sonra News ve Crypto bölümlerine bak. Sonra ihtiyacına göre Stocks, Flights veya Viral kısmına geç.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('nasıl')) {
      return 'Üst menü ile bölümler arasında geçiş yap, arama ile konu bul, Customize ile bölümleri gizle veya öne çıkar. En çok değişimlere ve trendlere odaklan.'
    }
    if (text.includes('news') || text.includes('haber')) {
      return 'News bölümü önemli gelişmeleri hızlı görmek için iyidir. Daha iyi bağlam için Today Brief ile birlikte kullan.'
    }
    if (text.includes('crypto') || text.includes('kripto')) {
      return 'Crypto bölümü piyasa hareketlerini, ilgili sinyalleri ve büyük cüzdan aktivitelerini takip etmene yardımcı olur. Brief ve News ile birlikte daha faydalıdır.'
    }
    return 'Bu dashboardu açıklayabilir, önce hangi bölümlere bakman gerektiğini söyleyebilir ve siteyi daha verimli kullanmana yardımcı olabilirim.'
  }

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
    const detectedLanguage = detectLanguage(message)

    if (!apiKey) {
      return NextResponse.json({ reply: fallbackReply(message) })
    }

    const systemPrompt = `You are an AI assistant for World Dashboard.
Your job is to help users understand the dashboard, what each section is for, and how to interpret it.
Always reply in the same language as the user's latest message.
If the user asks, you may also provide a short translation or alternative version in Azerbaijani, Russian, English, German, or Turkish.
Be concise, practical, clear, and honest.
Do not invent facts not present in the user's message or visible dashboard context.
Prefer short helpful answers over long generic explanations.
For simple questions, answer briefly.
For more complex or technical questions, answer step by step with practical guidance.
The user's latest message language is: ${detectedLanguage}.`

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
