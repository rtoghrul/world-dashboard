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

function isCrypto(text: string) {
  return ['bitcoin', 'btc', 'eth', 'ethereum', 'crypto', 'kripto', 'whale', 'wallet', 'coin', 'token', 'altcoin'].some(k => text.includes(k))
}

function isStocks(text: string) {
  return ['stock', 'stocks', 'share', 'shares', 'səhm', 'sehmler', 'market', 'markets', 'nasdaq', 's&p', 'dow', 'equity', 'börse', 'бирж', 'акци'].some(k => text.includes(k))
}

function isTravel(text: string) {
  return ['flight', 'flights', 'hotel', 'hotels', 'travel', 'trip', 'uç', 'ucus', 'səyah', 'reise', 'flug', 'otel', 'booking'].some(k => text.includes(k))
}

function isViral(text: string) {
  return ['viral', 'youtube', 'instagram', 'tiktok', 'social', 'trend', 'trending', 'content', 'reel', 'shorts'].some(k => text.includes(k))
}

function isNews(text: string) {
  return ['news', 'xəb', 'xeber', 'новост', 'nachricht', 'haber', 'headline', 'media'].some(k => text.includes(k))
}

function isStartIntent(text: string) {
  return ['first', 'start', 'check', 'hardan', 'başla', 'basla', 'haradan', 'where to start', 'begin', 'с чего', 'нач', 'nereden', 'wo anfangen'].some(k => text.includes(k))
}

function isUsageIntent(text: string) {
  return ['use', 'how', 'necə', 'nece', 'istifadə', 'istifade', 'как', 'wie', 'nasıl', 'guide'].some(k => text.includes(k))
}

function fallbackReply(message: string) {
  const text = message.toLowerCase()
  const lang = detectLanguage(message)

  if (lang === 'Azerbaijani') {
    if (isCrypto(text)) return 'Kripto ilə bağlı baxmaq üçün əvvəl Crypto bölməsinə, sonra Whale Activity hissəsinə keç. Qısa ümumi fon üçün Today Brief və News da faydalıdır.'
    if (isStocks(text)) return 'Səhmlər və bazar üçün əvvəl Stocks bölməsinə bax. Sonra Today Brief və News ilə əsas səbəbləri və gündəmi yoxla.'
    if (isTravel(text)) return 'Səyahət üçün Flights və Hotels bölmələri əsas hissələrdir. Ən rahat yol əvvəl Flights, sonra Hotels hissəsini yoxlamaqdır.'
    if (isViral(text)) return 'Trend və kontent üçün əvvəl Viral, sonra Social bölməsinə bax. Beləliklə həm sürətlə yayılan mövzuları, həm də platforma istiqamətini görə bilərsən.'
    if (isNews(text)) return 'News bölməsi əsas hadisələri tez görmək üçündür. Daha yaxşı nəticə üçün onu Today Brief ilə birlikdə yoxla.'
    if (text.includes('dashboard') || text.includes('site') || text.includes('sayt') || text.includes('bura') || text.includes('burda')) return 'World Dashboard kripto, xəbərlər, səyahət, səhmlər, viral məzmun və gündəlik xülasə kimi əsas bölmələri bir yerdə toplayır.'
    if (isStartIntent(text)) return 'Başlamaq üçün əvvəl Today Brief, sonra News və Crypto bölmələrinə bax. Daha sonra məqsədinə uyğun olaraq Stocks, Flights, Hotels, Viral və ya Social hissələrinə keç.'
    if (isUsageIntent(text)) return 'Yuxarı menyudan bölmələr arasında keç, axtarışdan mövzu tap, Customize hissəsi ilə bölmələri gizlət və ya önə çək. Ən vacib dəyişikliklərə və trendlərə fokuslan.'
    return 'Mən World Dashboard assistantıyəm. Yazın tam olmasa da mövzuya uyğun bölməni tapmağa, dashboardu izah etməyə və hara baxmalı olduğunu deməyə çalışaram.'
  }

  if (lang === 'Russian') {
    if (isCrypto(text)) return 'Для крипто сначала открой раздел Crypto, затем Whale Activity. Для общего контекста также полезно посмотреть Today Brief и News.'
    if (isStocks(text)) return 'Для акций и рынка сначала смотри раздел Stocks, затем Today Brief и News, чтобы понять фон и причины движений.'
    if (isTravel(text)) return 'Для поездок главные разделы — Flights и Hotels. Сначала удобно проверить Flights, потом Hotels.'
    if (isViral(text)) return 'Для трендов и контента сначала смотри Viral, затем Social. Так ты увидишь и быстрорастущие темы, и активность по платформам.'
    if (isNews(text)) return 'Раздел News подходит для быстрого обзора главных событий. Лучше использовать его вместе с Today Brief для контекста.'
    if (text.includes('dashboard') || text.includes('site') || text.includes('сайт')) return 'World Dashboard собирает в одном месте несколько полезных блоков: крипто, новости, путешествия, акции, вирусный контент и ежедневную сводку.'
    if (isStartIntent(text)) return 'Лучше начать с Today Brief, потом посмотреть News и Crypto, а затем перейти к нужным тебе разделам: Stocks, Flights, Hotels, Viral или Social.'
    if (isUsageIntent(text)) return 'Используй верхнюю навигацию для перехода между разделами, поиск для быстрого нахождения темы, а Customize — чтобы скрывать или закреплять блоки. Смотри прежде всего на изменения и тренды.'
    return 'Я assistant для World Dashboard. Даже если сообщение короткое или неполное, я постараюсь понять намерение и подсказать нужный раздел.'
  }

  if (lang === 'German') {
    if (isCrypto(text)) return 'Für Krypto solltest du zuerst den Bereich Crypto und danach Whale Activity prüfen. Für den Gesamtkontext sind Today Brief und News ebenfalls hilfreich.'
    if (isStocks(text)) return 'Für Aktien und Marktbewegungen solltest du zuerst Stocks und danach Today Brief sowie News prüfen.'
    if (isTravel(text)) return 'Für Reisen sind Flights und Hotels die wichtigsten Bereiche. Am besten prüfst du zuerst Flights und danach Hotels.'
    if (isViral(text)) return 'Für Trends und Content solltest du zuerst Viral und danach Social ansehen. So erkennst du sowohl aufkommende Themen als auch Plattformtrends.'
    if (isNews(text)) return 'Der News-Bereich eignet sich für einen schnellen Überblick über wichtige Entwicklungen. In Kombination mit Today Brief ist er noch hilfreicher.'
    if (text.includes('dashboard') || text.includes('site') || text.includes('seite')) return 'World Dashboard bündelt mehrere wichtige Bereiche an einem Ort, darunter Krypto, Nachrichten, Reisen, Aktien, virale Inhalte und eine tägliche Zusammenfassung.'
    if (isStartIntent(text)) return 'Am besten beginnst du mit Today Brief, danach mit News und Crypto, und gehst dann zu Stocks, Flights, Hotels, Viral oder Social weiter.'
    if (isUsageIntent(text)) return 'Nutze die obere Navigation für die Bereiche, die Suche zum Finden von Themen und Customize zum Anpinnen oder Ausblenden von Sektionen. Achte vor allem auf Änderungen und Trends.'
    return 'Ich bin der Assistant für World Dashboard. Auch bei kurzen oder unvollständigen Nachrichten versuche ich die Absicht zu verstehen und den richtigen Bereich zu empfehlen.'
  }

  if (lang === 'Turkish') {
    if (isCrypto(text)) return 'Kripto için önce Crypto, sonra Whale Activity bölümüne bak. Genel bağlam için Today Brief ve News de faydalıdır.'
    if (isStocks(text)) return 'Hisse ve piyasa için önce Stocks bölümüne, sonra Today Brief ve News kısmına bak.'
    if (isTravel(text)) return 'Seyahat için ana bölümler Flights ve Hotels kısmıdır. Önce Flights, sonra Hotels bakmak en uygunudur.'
    if (isViral(text)) return 'Trend ve içerik için önce Viral, sonra Social bölümüne bak. Böylece hem yükselen konuları hem de platform yönünü görebilirsin.'
    if (isNews(text)) return 'News bölümü önemli gelişmeleri hızlı görmek için iyidir. Daha iyi bağlam için Today Brief ile birlikte kullan.'
    if (text.includes('dashboard') || text.includes('site') || text.includes('sitenin')) return 'World Dashboard; kripto, haberler, seyahat, hisseler, viral içerikler ve günlük özet gibi önemli bölümleri tek yerde toplar.'
    if (isStartIntent(text)) return 'Başlamak için önce Today Brief, sonra News ve Crypto bölümlerine bak. Sonra ihtiyacına göre Stocks, Flights, Hotels, Viral veya Social kısmına geç.'
    if (isUsageIntent(text)) return 'Üst menü ile bölümler arasında geçiş yap, arama ile konu bul, Customize ile bölümleri gizle veya öne çıkar. En çok değişimlere ve trendlere odaklan.'
    return 'Ben World Dashboard assistantıyım. Mesaj kısa veya eksik olsa bile niyeti anlamaya ve doğru bölümü önermeye çalışırım.'
  }

  if (isCrypto(text)) return 'For crypto topics, check Crypto first and then Whale Activity. Today Brief and News are useful for broader context.'
  if (isStocks(text)) return 'For stocks and market context, start with Stocks, then use Today Brief and News to understand the bigger picture.'
  if (isTravel(text)) return 'For travel-related questions, the most relevant sections are Flights and Hotels. Start with Flights, then compare with Hotels.'
  if (isViral(text)) return 'For trends and content ideas, start with Viral and then check Social. That gives you both fast-moving topics and platform-specific direction.'
  if (isNews(text)) return 'The News section is useful for a fast scan of major developments. Pair it with Today Brief for context.'
  if (text.includes('dashboard') || text.includes('site')) return 'World Dashboard brings several high-signal feeds together in one place, including crypto, news, travel, stocks, viral content, and a daily brief.'
  if (isStartIntent(text)) return 'A good starting order is Today Brief first, then News and Crypto, and then the sections most relevant to your goals such as Stocks, Flights, Hotels, Viral, or Social.'
  if (isUsageIntent(text)) return 'Use the top navigation to jump between sections, search to find a topic, and customize to pin or hide sections. Focus on changes, trends, and standout items rather than reading every card equally.'

  return 'I am the World Dashboard assistant. Even if your message is short or incomplete, I will try to infer your intent and guide you to the right section of the site.'
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
You should behave like a smart but site-focused assistant.
Infer intent even when the user's message is short, partially written, informal, misspelled, or incomplete.
Use the latest user message plus recent conversation history to infer what they probably mean.
Do not be overly rigid. If the likely intent is still related to the dashboard, answer helpfully.
Only reject requests when they are clearly unrelated to this site.
If a user asks about crypto, guide them mainly to Crypto and Whale Activity.
If a user asks about stocks or markets, guide them mainly to Stocks, Today Brief, and News.
If a user asks about travel, guide them mainly to Flights and Hotels.
If a user asks about viral topics, content ideas, YouTube, Instagram, TikTok, or trends, guide them mainly to Viral and Social.
If a user asks about news, guide them mainly to News and Today Brief.
If a user asks where to start, recommend Today Brief first, then News and Crypto, then the most relevant section for their goal.
Always reply in the same language as the user's latest message.
If the user asks, you may also provide a short translation or alternative version in Azerbaijani, Russian, English, German, or Turkish.
Be concise, practical, clear, and honest.
Do not invent facts not present in the user's message or visible dashboard context.
Prefer short helpful answers over long generic explanations.
For simple questions, answer briefly.
For more complex questions, answer step by step with practical guidance.
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
        temperature: 0.45,
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
