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
    if (text.includes('bitcoin') || text.includes('btc') || text.includes('eth') || text.includes('crypto') || text.includes('kripto')) {
      return 'Kripto ilə bağlı baxmaq üçün əvvəl Crypto bölməsinə, sonra Whale Activity hissəsinə keç. Qısa ümumi fon üçün Today Brief və News da faydalıdır.'
    }
    if (text.includes('stock') || text.includes('səhm') || text.includes('sehmler') || text.includes('market')) {
      return 'Səhmlər və bazar üçün əvvəl Stocks bölməsinə bax. Sonra Today Brief və News ilə əsas səbəbləri və gündəmi yoxla.'
    }
    if (text.includes('flight') || text.includes('hotel') || text.includes('travel') || text.includes('uç') || text.includes('ucus') || text.includes('səyah')) {
      return 'Səyahət üçün Flights və Hotels bölmələri əsas hissələrdir. Ən rahat yol əvvəl flights, sonra hotels hissəsini yoxlamaqdır.'
    }
    if (text.includes('viral') || text.includes('youtube') || text.includes('instagram') || text.includes('tiktok') || text.includes('social')) {
      return 'Trend və kontent üçün əvvəl Viral, sonra Social bölməsinə bax. Beləliklə həm sürətlə yayılan mövzuları, həm də platforma istiqamətini görə bilərsən.'
    }
    if (text.includes('dashboard') || text.includes('site') || text.includes('sayt')) {
      return 'World Dashboard kripto, xəbərlər, səyahət, səhmlər, viral məzmun və gündəlik xülasə kimi əsas bölmələri bir yerdə toplayır.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('hardan') || text.includes('başla')) {
      return 'Başlamaq üçün əvvəl Today Brief, sonra News və Crypto bölmələrinə bax. Daha sonra məqsədinə uyğun olaraq Stocks, Flights, Hotels, Viral və ya Social hissələrinə keç.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('necə')) {
      return 'Yuxarı menyudan bölmələr arasında keç, axtarışdan mövzu tap, Customize hissəsi ilə bölmələri gizlət və ya önə çək. Ən vacib dəyişikliklərə və trendlərə fokuslan.'
    }
    if (text.includes('news') || text.includes('xəb')) {
      return 'News bölməsi əsas hadisələri tez görmək üçündür. Daha yaxşı nəticə üçün onu Today Brief ilə birlikdə yoxla.'
    }
    return 'Bu assistant əsasən World Dashboard üçündür. Mövzuya uyğun bölməni tapmağa, dashboardu izah etməyə və hansı hissəyə baxmalı olduğunu deməyə kömək edə bilərəm.'
  }

  if (lang === 'Russian') {
    if (text.includes('bitcoin') || text.includes('btc') || text.includes('eth') || text.includes('crypto') || text.includes('крип')) {
      return 'Для крипто сначала открой раздел Crypto, затем Whale Activity. Для общего контекста также полезно посмотреть Today Brief и News.'
    }
    if (text.includes('stock') || text.includes('акци') || text.includes('market') || text.includes('рын')) {
      return 'Для акций и рынка сначала смотри раздел Stocks, затем Today Brief и News, чтобы понять фон и причины движений.'
    }
    if (text.includes('flight') || text.includes('hotel') || text.includes('travel') || text.includes('отел') || text.includes('полет') || text.includes('поезд')) {
      return 'Для поездок главные разделы — Flights и Hotels. Сначала удобно проверить Flights, потом Hotels.'
    }
    if (text.includes('viral') || text.includes('youtube') || text.includes('instagram') || text.includes('tiktok') || text.includes('social')) {
      return 'Для трендов и контента сначала смотри Viral, затем Social. Так ты увидишь и быстрорастущие темы, и активность по платформам.'
    }
    if (text.includes('dashboard') || text.includes('site') || text.includes('сайт')) {
      return 'World Dashboard собирает в одном месте несколько полезных блоков: крипто, новости, путешествия, акции, вирусный контент и ежедневную сводку.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('с чего') || text.includes('нач')) {
      return 'Лучше начать с Today Brief, потом посмотреть News и Crypto, а затем перейти к нужным тебе разделам: Stocks, Flights, Hotels, Viral или Social.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('как')) {
      return 'Используй верхнюю навигацию для перехода между разделами, поиск для быстрого нахождения темы, а Customize — чтобы скрывать или закреплять блоки. Смотри прежде всего на изменения и тренды.'
    }
    if (text.includes('news') || text.includes('новост')) {
      return 'Раздел News подходит для быстрого обзора главных событий. Лучше использовать его вместе с Today Brief для контекста.'
    }
    return 'Этот assistant работает в основном для World Dashboard. Я могу подсказать нужный раздел, объяснить части dashboard и помочь понять, куда смотреть сначала.'
  }

  if (lang === 'German') {
    if (text.includes('bitcoin') || text.includes('btc') || text.includes('eth') || text.includes('crypto') || text.includes('krypto')) {
      return 'Für Krypto solltest du zuerst den Bereich Crypto und danach Whale Activity prüfen. Für den Gesamtkontext sind Today Brief und News ebenfalls hilfreich.'
    }
    if (text.includes('stock') || text.includes('akt') || text.includes('market') || text.includes('börse')) {
      return 'Für Aktien und Marktbewegungen solltest du zuerst Stocks und danach Today Brief sowie News prüfen.'
    }
    if (text.includes('flight') || text.includes('hotel') || text.includes('travel') || text.includes('reise') || text.includes('flug')) {
      return 'Für Reisen sind Flights und Hotels die wichtigsten Bereiche. Am besten prüfst du zuerst Flights und danach Hotels.'
    }
    if (text.includes('viral') || text.includes('youtube') || text.includes('instagram') || text.includes('tiktok') || text.includes('social')) {
      return 'Für Trends und Content solltest du zuerst Viral und danach Social ansehen. So erkennst du sowohl aufkommende Themen als auch Plattformtrends.'
    }
    if (text.includes('dashboard') || text.includes('site') || text.includes('seite')) {
      return 'World Dashboard bündelt mehrere wichtige Bereiche an einem Ort, darunter Krypto, Nachrichten, Reisen, Aktien, virale Inhalte und eine tägliche Zusammenfassung.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('wo anfangen')) {
      return 'Am besten beginnst du mit Today Brief, danach mit News und Crypto, und gehst dann zu Stocks, Flights, Hotels, Viral oder Social weiter.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('wie')) {
      return 'Nutze die obere Navigation für die Bereiche, die Suche zum Finden von Themen und Customize zum Anpinnen oder Ausblenden von Sektionen. Achte vor allem auf Änderungen und Trends.'
    }
    if (text.includes('news') || text.includes('nachricht')) {
      return 'Der News-Bereich eignet sich für einen schnellen Überblick über wichtige Entwicklungen. In Kombination mit Today Brief ist er noch hilfreicher.'
    }
    return 'Dieser Assistant ist hauptsächlich für World Dashboard gedacht. Ich kann passende Bereiche empfehlen, das Dashboard erklären und sagen, wo du zuerst schauen solltest.'
  }

  if (lang === 'Turkish') {
    if (text.includes('bitcoin') || text.includes('btc') || text.includes('eth') || text.includes('crypto') || text.includes('kripto')) {
      return 'Kripto için önce Crypto, sonra Whale Activity bölümüne bak. Genel bağlam için Today Brief ve News de faydalıdır.'
    }
    if (text.includes('stock') || text.includes('hisse') || text.includes('market') || text.includes('borsa')) {
      return 'Hisse ve piyasa için önce Stocks bölümüne, sonra Today Brief ve News kısmına bak.'
    }
    if (text.includes('flight') || text.includes('hotel') || text.includes('travel') || text.includes('uç') || text.includes('otel') || text.includes('seyahat')) {
      return 'Seyahat için ana bölümler Flights ve Hotels kısmıdır. Önce Flights, sonra Hotels bakmak en uygunudur.'
    }
    if (text.includes('viral') || text.includes('youtube') || text.includes('instagram') || text.includes('tiktok') || text.includes('social')) {
      return 'Trend ve içerik için önce Viral, sonra Social bölümüne bak. Böylece hem yükselen konuları hem de platform yönünü görebilirsin.'
    }
    if (text.includes('dashboard') || text.includes('site') || text.includes('sitenin')) {
      return 'World Dashboard; kripto, haberler, seyahat, hisseler, viral içerikler ve günlük özet gibi önemli bölümleri tek yerde toplar.'
    }
    if (text.includes('first') || text.includes('start') || text.includes('check') || text.includes('nereden') || text.includes('başla')) {
      return 'Başlamak için önce Today Brief, sonra News ve Crypto bölümlerine bak. Sonra ihtiyacına göre Stocks, Flights, Hotels, Viral veya Social kısmına geç.'
    }
    if (text.includes('use') || text.includes('how') || text.includes('nasıl')) {
      return 'Üst menü ile bölümler arasında geçiş yap, arama ile konu bul, Customize ile bölümleri gizle veya öne çıkar. En çok değişimlere ve trendlere odaklan.'
    }
    if (text.includes('news') || text.includes('haber')) {
      return 'News bölümü önemli gelişmeleri hızlı görmek için iyidir. Daha iyi bağlam için Today Brief ile birlikte kullan.'
    }
    return 'Bu assistant esas olarak World Dashboard içindir. Uygun bölümü bulmana, dashboardu anlamana ve önce nereye bakman gerektiğini söylemeye yardımcı olurum.'
  }

  if (text.includes('bitcoin') || text.includes('btc') || text.includes('eth') || text.includes('crypto')) {
    return 'For crypto topics, check Crypto first and then Whale Activity. Today Brief and News are useful for broader context.'
  }

  if (text.includes('stock') || text.includes('market') || text.includes('shares')) {
    return 'For stocks and market context, start with Stocks, then use Today Brief and News to understand the bigger picture.'
  }

  if (text.includes('flight') || text.includes('hotel') || text.includes('travel')) {
    return 'For travel-related questions, the most relevant sections are Flights and Hotels. Start with Flights, then compare with Hotels.'
  }

  if (text.includes('viral') || text.includes('youtube') || text.includes('instagram') || text.includes('tiktok') || text.includes('social')) {
    return 'For trends and content ideas, start with Viral and then check Social. That gives you both fast-moving topics and platform-specific direction.'
  }

  if (text.includes('dashboard') || text.includes('site')) {
    return 'World Dashboard brings several high-signal feeds together in one place, including crypto, news, travel, stocks, viral content, and a daily brief.'
  }

  if (text.includes('first') || text.includes('start') || text.includes('check')) {
    return 'A good starting order is Today Brief first, then News and Crypto, and then the sections most relevant to your goals such as Stocks, Flights, Hotels, Viral, or Social.'
  }

  if (text.includes('use') || text.includes('how')) {
    return 'Use the top navigation to jump between sections, search to find a topic, and customize to pin or hide sections. Focus on changes, trends, and standout items rather than reading every card equally.'
  }

  if (text.includes('news')) {
    return 'The News section is useful for a fast scan of major developments. Pair it with Today Brief for context and then check other sections that may be affected.'
  }

  return 'This assistant is mainly for World Dashboard. I can explain the dashboard, point you to the right section, and help you understand where to look first.'
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
Your job is to help users understand the dashboard, what each section is for, and how to interpret it.
Only answer questions related to this site, its sections, and how to use the information shown here.
If a user asks about crypto, guide them mainly to Crypto and Whale Activity.
If a user asks about stocks or markets, guide them mainly to Stocks, Today Brief, and News.
If a user asks about travel, guide them mainly to Flights and Hotels.
If a user asks about viral topics, content ideas, YouTube, Instagram, TikTok, or trends, guide them mainly to Viral and Social.
If a user asks where to start, recommend Today Brief first, then News and Crypto, then the most relevant section for their goal.
If a user asks something unrelated to the dashboard, politely say that this assistant is limited to World Dashboard topics.
Always reply in the same language as the user's latest message.
If the user asks, you may also provide a short translation or alternative version in Azerbaijani, Russian, English, German, or Turkish.
Be concise, practical, clear, and honest.
Do not invent facts not present in the user's message or visible dashboard context.
Prefer short helpful answers over long generic explanations.
For simple questions, answer briefly.
For more complex or technical questions, answer step by step with practical guidance.
The user's latest message language is: ${detectedLanguage}.`

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
        temperature: 0.3,
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
