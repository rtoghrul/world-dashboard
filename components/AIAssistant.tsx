'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'World Dashboard Assistant', az: 'World Dashboard Köməkçisi', ru: 'Ассистент World Dashboard', de: 'World Dashboard Assistent', tr: 'World Dashboard Asistanı', fr: 'Assistant World Dashboard', es: 'Asistente de World Dashboard', it: 'Assistente World Dashboard', pt: 'Assistente do World Dashboard', zh: 'World Dashboard 助手', ar: 'مساعد لوحة العالم', ja: 'World Dashboard アシスタント' },
  subtitle: { en: 'Ask about dashboard sections, data, and how to use the site.', az: 'Bölmələr, məlumatlar və saytdan istifadə haqqında soruşun.', ru: 'Спросите о разделах, данных и использовании сайта.', de: 'Fragen zu Bereichen, Daten und Nutzung der Seite.', tr: 'Bölümler, veriler ve site kullanımı hakkında sorun.', fr: 'Posez des questions sur les sections et les données.', es: 'Pregunta sobre secciones, datos y uso del sitio.', it: 'Chiedi di sezioni, dati e uso del sito.', pt: 'Pergunte sobre seções, dados e uso do site.', zh: '咨询板块、数据和使用方法。', ar: 'اسأل عن الأقسام والبيانات وطريقة الاستخدام.', ja: 'セクションやデータ、使い方を質問できます。' },
  placeholder: { en: 'Ask a question...', az: 'Sual verin...', ru: 'Задайте вопрос...', de: 'Frage stellen...', tr: 'Soru sorun...', fr: 'Poser une question...', es: 'Haz una pregunta...', it: 'Fai una domanda...', pt: 'Faça uma pergunta...', zh: '提出问题...', ar: 'اطرح سؤالاً...', ja: '質問する...' },
  hint: { en: 'Enter to send · Shift + Enter for new line', az: 'Göndər: Enter · Yeni sətir: Shift + Enter', ru: 'Enter — отправить · Shift+Enter — новая строка', de: 'Enter zum Senden · Shift+Enter für neue Zeile', tr: 'Göndermek için Enter · Yeni satır için Shift+Enter', fr: 'Entrée pour envoyer · Maj+Entrée pour une ligne', es: 'Enter para enviar · Shift+Enter nueva línea', it: 'Invio per inviare · Shift+Invio per nuova riga', pt: 'Enter para enviar · Shift+Enter nova linha', zh: '回车发送 · Shift+回车换行', ar: 'Enter للإرسال · Shift+Enter لسطر جديد', ja: 'Enterで送信 · Shift+Enterで改行' },
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const quickPrompts = [
  'What does this dashboard show?',
  'Which sections should I check first?',
  'How should I use this site?'
]

export default function AIAssistant() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I am your World Dashboard assistant. I can explain the dashboard, suggest which sections to check, and help you understand what to focus on.'
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
        data?.reply ||
        'I could not generate a reply right now. Please try again in a moment.'

      animateAssistantReply(reply)
    } catch {
      animateAssistantReply(
        'There was a connection problem while contacting the assistant. Please try again shortly.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-5 right-5 z-[70] rounded-full border border-indigo-500/40 bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {open ? 'Close AI' : 'AI Assistant'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[70] flex h-[32rem] w-[24rem] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
          <div className="border-b border-gray-800 px-4 py-3">
            <p className="text-sm font-semibold text-white">{c('title')}</p>
            <p className="mt-1 text-xs text-gray-400">{c('subtitle')}</p>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-gray-800 px-4 py-3">
            {quickPrompts.map(prompt => (
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
                {msg.content}
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
                className="max-h-[140px] min-h-[44px] flex-1 resize-none overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-gray-500 focus:border-indigo-500"
              />
              <button
                onClick={() => void sendMessage()}
                disabled={loading}
                className="h-11 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[11px] text-gray-500">{c('hint')}</p>
          </div>
        </div>
      )}
    </>
  )
}
