'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'World Dashboard Assistant', az: 'World Dashboard Köməkçisi', ru: 'Ассистент World Dashboard', de: 'World Dashboard Assistent', tr: 'World Dashboard Asistanı', fr: 'Assistant World Dashboard', es: 'Asistente de World Dashboard', it: 'Assistente World Dashboard', pt: 'Assistente do World Dashboard', zh: 'World Dashboard 助手', ar: 'مساعد لوحة العالم', ja: 'World Dashboard アシスタント' },
  subtitle: { en: 'Ask about dashboard sections, data, and how to use the site.', az: 'Bölmələr, məlumatlar və saytdan istifadə haqqında soruşun.', ru: 'Спросите о разделах, данных и использовании сайта.', de: 'Fragen zu Bereichen, Daten und Nutzung der Seite.', tr: 'Bölümler, veriler ve site kullanımı hakkında sorun.', fr: 'Posez des questions sur les sections et les données.', es: 'Pregunta sobre secciones, datos y uso del sitio.', it: 'Chiedi di sezioni, dati e uso del sito.', pt: 'Pergunte sobre seções, dados e uso do site.', zh: '咨询板块、数据和使用方法。', ar: 'اسأل عن الأقسام والبيانات وطريقة الاستخدام.', ja: 'セクションやデータ、使い方を質問できます。' },
  placeholder: { en: 'Ask a question...', az: 'Sual verin...', ru: 'Задайте вопрос...', de: 'Frage stellen...', tr: 'Soru sorun...', fr: 'Poser une question...', es: 'Haz una pregunta...', it: 'Fai una domanda...', pt: 'Faça uma pergunta...', zh: '提出问题...', ar: 'اطرح سؤالاً...', ja: '質問する...' },
  hint: { en: 'Enter to send · Shift + Enter for new line', az: 'Göndər: Enter · Yeni sətir: Shift + Enter', ru: 'Enter — отправить · Shift+Enter — новая строка', de: 'Enter zum Senden · Shift+Enter für neue Zeile', tr: 'Göndermek için Enter · Yeni satır için Shift+Enter', fr: 'Entrée pour envoyer · Maj+Entrée pour une ligne', es: 'Enter para enviar · Shift+Enter nueva línea', it: 'Invio per inviare · Shift+Invio per nuova riga', pt: 'Enter para enviar · Shift+Enter nova linha', zh: '回车发送 · Shift+回车换行', ar: 'Enter للإرسال · Shift+Enter لسطر جديد', ja: 'Enterで送信 · Shift+Enterで改行' },
  open: { en: 'AI Assistant', az: 'AI Köməkçi', ru: 'ИИ-ассистент', de: 'KI-Assistent', tr: 'YZ Asistanı', fr: 'Assistant IA', es: 'Asistente IA', it: 'Assistente IA', pt: 'Assistente IA', zh: 'AI 助手', ar: 'مساعد ذكي', ja: 'AIアシスタント' },
  close: { en: 'Close AI', az: 'Bağla', ru: 'Закрыть', de: 'Schließen', tr: 'Kapat', fr: 'Fermer', es: 'Cerrar', it: 'Chiudi', pt: 'Fechar', zh: '关闭', ar: 'إغلاق', ja: '閉じる' },
  openLabel: { en: 'Open AI assistant', az: 'AI köməkçini aç', ru: 'Открыть ИИ-ассистента', de: 'KI-Assistent öffnen', tr: 'YZ asistanını aç', fr: "Ouvrir l'assistant IA", es: 'Abrir asistente IA', it: "Apri l'assistente IA", pt: 'Abrir assistente IA', zh: '打开 AI 助手', ar: 'افتح المساعد الذكي', ja: 'AIアシスタントを開く' },
  closeLabel: { en: 'Close AI assistant', az: 'AI köməkçini bağla', ru: 'Закрыть ИИ-ассистента', de: 'KI-Assistent schließen', tr: 'YZ asistanını kapat', fr: "Fermer l'assistant IA", es: 'Cerrar asistente IA', it: "Chiudi l'assistente IA", pt: 'Fechar assistente IA', zh: '关闭 AI 助手', ar: 'أغلق المساعد الذكي', ja: 'AIアシスタントを閉じる' },
  greeting: { en: 'Hi! I am your World Dashboard assistant. I can explain the dashboard, suggest which sections to check, and help you understand what to focus on.', az: 'Salam! Mən World Dashboard köməkçinizəm. Paneli izah edə, hansı bölmələrə baxmağı məsləhət görə və nəyə diqqət etməyi göstərə bilərəm.', ru: 'Привет! Я ассистент World Dashboard. Могу объяснить, как устроен сайт, подсказать, какие разделы посмотреть, и на что обратить внимание.', de: 'Hallo! Ich bin dein World-Dashboard-Assistent. Ich erkläre das Dashboard, schlage Bereiche vor und helfe dir, das Wichtige zu finden.', tr: 'Merhaba! World Dashboard asistanınızım. Paneli açıklayabilir, hangi bölümlere bakacağınızı önerebilir ve neye odaklanacağınızı gösterebilirim.', fr: "Bonjour ! Je suis l'assistant World Dashboard. Je peux expliquer le tableau de bord, suggérer des sections et vous aider à vous concentrer sur l'essentiel.", es: '¡Hola! Soy el asistente de World Dashboard. Puedo explicar el panel, sugerir secciones y ayudarte a centrarte en lo importante.', it: "Ciao! Sono l'assistente di World Dashboard. Posso spiegare la dashboard, suggerire le sezioni da vedere e aiutarti a capire su cosa concentrarti.", pt: 'Olá! Sou o assistente do World Dashboard. Posso explicar o painel, sugerir seções e ajudar você a focar no que importa.', zh: '你好！我是 World Dashboard 助手，可以介绍本站、推荐值得查看的板块，并帮你找到重点。', ar: 'مرحباً! أنا مساعد لوحة العالم. يمكنني شرح اللوحة واقتراح الأقسام ومساعدتك على التركيز على المهم.', ja: 'こんにちは！World Dashboard アシスタントです。サイトの説明やおすすめのセクション、注目点をご案内します。' },
  noReply: { en: 'I could not generate a reply right now. Please try again in a moment.', az: 'Hazırda cavab yarada bilmədim. Bir azdan yenidən cəhd edin.', ru: 'Сейчас не удалось ответить. Попробуйте чуть позже.', de: 'Ich konnte gerade keine Antwort erzeugen. Bitte versuche es gleich noch einmal.', tr: 'Şu anda yanıt oluşturamadım. Lütfen birazdan tekrar deneyin.', fr: "Je n'ai pas pu répondre pour le moment. Réessayez dans un instant.", es: 'No pude generar una respuesta ahora. Inténtalo de nuevo en un momento.', it: 'Non riesco a rispondere ora. Riprova tra poco.', pt: 'Não consegui responder agora. Tente novamente em instantes.', zh: '暂时无法生成回复，请稍后再试。', ar: 'تعذّر إنشاء رد الآن. حاول مجدداً بعد قليل.', ja: '現在応答を生成できません。しばらくしてからお試しください。' },
  netError: { en: 'There was a connection problem while contacting the assistant. Please try again shortly.', az: 'Köməkçi ilə əlaqədə problem yarandı. Bir azdan yenidən cəhd edin.', ru: 'Проблема с подключением к ассистенту. Попробуйте ещё раз чуть позже.', de: 'Verbindungsproblem beim Assistenten. Bitte versuche es gleich erneut.', tr: 'Asistana bağlanırken sorun oluştu. Lütfen birazdan tekrar deneyin.', fr: "Problème de connexion avec l'assistant. Réessayez bientôt.", es: 'Hubo un problema de conexión con el asistente. Inténtalo de nuevo pronto.', it: "Problema di connessione con l'assistente. Riprova a breve.", pt: 'Houve um problema de conexão com o assistente. Tente novamente em breve.', zh: '连接助手时出现问题，请稍后再试。', ar: 'حدثت مشكلة في الاتصال بالمساعد. حاول مجدداً قريباً.', ja: 'アシスタントへの接続に問題が発生しました。しばらくしてから再試行してください。' },
  q1: { en: 'What does this dashboard show?', az: 'Bu panel nə göstərir?', ru: 'Что показывает этот дашборд?', de: 'Was zeigt dieses Dashboard?', tr: 'Bu panel neyi gösteriyor?', fr: 'Que montre ce tableau de bord ?', es: '¿Qué muestra este panel?', it: 'Cosa mostra questa dashboard?', pt: 'O que este painel mostra?', zh: '这个仪表盘展示什么？', ar: 'ماذا تعرض هذه اللوحة؟', ja: 'このダッシュボードでは何が見られますか？' },
  q2: { en: 'Which sections should I check first?', az: 'Əvvəlcə hansı bölmələrə baxım?', ru: 'Какие разделы посмотреть в первую очередь?', de: 'Welche Bereiche sollte ich zuerst ansehen?', tr: 'Önce hangi bölümlere bakmalıyım?', fr: 'Quelles sections consulter en premier ?', es: '¿Qué secciones debería ver primero?', it: 'Quali sezioni dovrei guardare prima?', pt: 'Quais seções devo ver primeiro?', zh: '我应该先看哪些板块？', ar: 'ما الأقسام التي أبدأ بها؟', ja: '最初にどのセクションを見るべき？' },
  q3: { en: 'How should I use this site?', az: 'Bu saytdan necə istifadə edim?', ru: 'Как пользоваться этим сайтом?', de: 'Wie nutze ich diese Seite am besten?', tr: 'Bu siteyi nasıl kullanmalıyım?', fr: 'Comment utiliser ce site ?', es: '¿Cómo debería usar este sitio?', it: 'Come dovrei usare questo sito?', pt: 'Como devo usar este site?', zh: '我该如何使用这个网站？', ar: 'كيف أستخدم هذا الموقع؟', ja: 'このサイトの使い方は？' },
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPT_KEYS = ['q1', 'q2', 'q3']

export default function AIAssistant() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: COPY.greeting.en
    }
  ])
  const [animatedReply, setAnimatedReply] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open, animatedReply])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`
  }, [input])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
    }
  }, [])

  const animateAssistantReply = (fullText: string) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)

    setAnimatedReply('')

    if (!fullText) {
      setMessages(prev => [...prev, { role: 'assistant', content: fullText }])
      return
    }

    let index = 0

    const step = () => {
      index += Math.max(1, Math.ceil(fullText.length / 80))
      const next = fullText.slice(0, index)
      setAnimatedReply(next)

      if (index < fullText.length) {
        animationTimeoutRef.current = setTimeout(step, 18)
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: fullText }])
        setAnimatedReply('')
      }
    }

    step()
  }

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const nextMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    setAnimatedReply('')

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: nextMessages })
      })

      const data = await res.json()
      const reply =
        data?.reply || c('noReply')

      animateAssistantReply(reply)
    } catch {
      animateAssistantReply(c('netError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-[4.5rem] md:bottom-5 right-4 md:right-5 z-[10000] rounded-full border border-indigo-500/40 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label={open ? c('closeLabel') : c('openLabel')}
        aria-expanded={open}
      >
        {open ? c('close') : c('open')}
      </button>

      {open && (
        <div className="fixed bottom-[8.5rem] md:bottom-24 right-3 md:right-5 z-[10000] flex h-[32rem] max-h-[calc(100dvh-10rem)] w-[24rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
          <div className="border-b border-gray-800 px-4 py-3">
            <p className="text-sm font-semibold text-white">{c('title')}</p>
            <p className="mt-1 text-xs text-gray-400">{c('subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-gray-800 px-4 py-3">
            {QUICK_PROMPT_KEYS.map(k => c(k)).map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs text-gray-200 transition hover:border-indigo-500 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-950/80 px-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-6 ${
                  msg.role === 'user'
                    ? 'ml-auto bg-indigo-600 text-white'
                    : 'border border-gray-800 bg-gray-900 text-gray-100'
                }`}
              >
                {idx === 0 && msg.content === COPY.greeting.en ? c('greeting') : msg.content}
              </div>
            ))}

            {animatedReply && (
              <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm leading-6 text-gray-100">
                {animatedReply}
                <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-indigo-400 align-middle" />
              </div>
            )}

            {loading && !animatedReply && (
              <div className="max-w-[85%] rounded-2xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-300">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-800 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void sendMessage()
                  }
                }}
            placeholder={c('placeholder')}
                className="max-h-[140px] min-h-[44px] flex-1 resize-none overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-gray-400 focus:border-indigo-500"
              />
              <button
                onClick={() => void sendMessage()}
                disabled={loading}
                className="h-11 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">{c('hint')}</p>
          </div>
        </div>
      )}
    </>
  )
}
