'use client'

import { useEffect, useRef, useState } from 'react'

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
            <p className="text-sm font-semibold text-white">World Dashboard Assistant</p>
            <p className="mt-1 text-xs text-gray-400">Ask about dashboard sections, data, and how to use the site.</p>
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
                placeholder="Ask a question..."
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
            <p className="mt-2 text-[11px] text-gray-500">Enter to send · Shift + Enter for new line</p>
          </div>
        </div>
      )}
    </>
  )
}
