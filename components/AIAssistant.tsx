'use client'

import { useState } from 'react'

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

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const nextMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: nextMessages })
      })

      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            data?.reply ||
            'I could not generate a reply right now. Please try again in a moment.'
        }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'There was a connection problem while contacting the assistant. Please try again shortly.'
        }
      ])
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
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                  msg.role === 'user'
                    ? 'ml-auto bg-indigo-600 text-white'
                    : 'border border-gray-800 bg-gray-900 text-gray-100'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] rounded-2xl border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-300">
                Thinking...
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-gray-800 p-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') void sendMessage()
              }}
              placeholder="Ask a question..."
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-indigo-500"
            />
            <button
              onClick={() => void sendMessage()}
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
