'use client'
import { useState, useEffect } from 'react'
import { Brain, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  category: string
}

const quizPool: QuizQuestion[] = [
  { question: 'What is the maximum supply of Bitcoin?', options: ['18M', '21M', '100M', 'Unlimited'], correct: 1, category: 'Crypto' },
  { question: 'Which company has the highest market cap?', options: ['Apple', 'Microsoft', 'NVIDIA', 'Amazon'], correct: 0, category: 'Stocks' },
  { question: 'What does ETF stand for?', options: ['Electronic Transfer Fund', 'Exchange-Traded Fund', 'External Trade Finance', 'Equity Token Fund'], correct: 1, category: 'Finance' },
  { question: 'What blockchain does Solana use for consensus?', options: ['Proof of Work', 'Proof of Stake', 'Proof of History', 'Delegated PoS'], correct: 2, category: 'Crypto' },
  { question: 'Which country has the largest GDP?', options: ['China', 'USA', 'Japan', 'Germany'], correct: 1, category: 'World' },
  { question: 'What is the Fear & Greed Index range?', options: ['0-10', '0-50', '0-100', '0-1000'], correct: 2, category: 'Markets' },
  { question: 'Who founded Ethereum?', options: ['Satoshi Nakamoto', 'Vitalik Buterin', 'Charles Hoskinson', 'Gavin Wood'], correct: 1, category: 'Crypto' },
  { question: 'What does DeFi stand for?', options: ['Defined Finance', 'Decentralized Finance', 'Default Finance', 'Digital Finance'], correct: 1, category: 'Crypto' },
  { question: 'Which index tracks the top 500 US stocks?', options: ['Dow Jones', 'NASDAQ', 'S&P 500', 'Russell 2000'], correct: 2, category: 'Stocks' },
  { question: 'What is a bull market?', options: ['Falling prices', 'Rising prices', 'Sideways movement', 'High volatility'], correct: 1, category: 'Markets' },
]

export default function DailyQuiz() {
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [dailyQuestions, setDailyQuestions] = useState<QuizQuestion[]>([])

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0)
    const shuffled = [...quizPool].sort((a, b) => {
      const ha = (seed * a.question.length) % 100
      const hb = (seed * b.question.length) % 100
      return ha - hb
    })
    setDailyQuestions(shuffled.slice(0, 5))

    const savedScore = localStorage.getItem(`wd-quiz-${today}`)
    if (savedScore) {
      setFinished(true)
      setScore(parseInt(savedScore))
    }
  }, [])

  const question = dailyQuestions[questionIdx]
  if (!question && !finished) return null

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === question.correct) setScore(s => s + 1)

    setTimeout(() => {
      if (questionIdx < dailyQuestions.length - 1) {
        setQuestionIdx(q => q + 1)
        setSelected(null)
      } else {
        setFinished(true)
        const today = new Date().toISOString().slice(0, 10)
        const finalScore = idx === question.correct ? score + 1 : score
        localStorage.setItem(`wd-quiz-${today}`, String(finalScore))
      }
    }, 1200)
  }

  if (finished) {
    const pct = Math.round((score / 5) * 100)
    return (
      <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-violet-400" />
          <h3 className="text-white font-semibold text-sm">Daily Quiz</h3>
        </div>
        <div className="text-center py-4">
          <Trophy className={`w-8 h-8 mx-auto mb-2 ${pct >= 80 ? 'text-amber-400' : pct >= 60 ? 'text-gray-300' : 'text-orange-700'}`} />
          <p className="text-white font-bold text-xl">{score}/5</p>
          <p className="text-[#8b8b9e] text-xs mt-1">
            {pct === 100 ? 'Perfect! 🎉' : pct >= 80 ? 'Great job! 🌟' : pct >= 60 ? 'Good effort!' : 'Try again tomorrow!'}
          </p>
          <p className="text-[10px] text-[#4a4a5e] mt-2">New quiz available tomorrow</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-400" />
          <h3 className="text-white font-semibold text-sm">Daily Quiz</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300">{question.category}</span>
          <span className="text-[10px] text-[#4a4a5e]">{questionIdx + 1}/5</span>
        </div>
      </div>

      <p className="text-white text-xs font-medium mb-3">{question.question}</p>

      <div className="space-y-2">
        {question.options.map((opt, i) => {
          let style = 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
          if (selected !== null) {
            if (i === question.correct) style = 'border-emerald-500/50 bg-emerald-500/10'
            else if (i === selected) style = 'border-red-500/50 bg-red-500/10'
            else style = 'border-white/[0.04] opacity-50'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition flex items-center gap-2 ${style}`}
            >
              <span className="w-5 h-5 rounded-full border border-white/[0.1] flex items-center justify-center text-[10px] text-[#4a4a5e] flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-white">{opt}</span>
              {selected !== null && i === question.correct && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
              {selected === i && i !== question.correct && <XCircle className="w-3.5 h-3.5 text-red-400 ml-auto" />}
            </button>
          )
        })}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${
            i < questionIdx ? 'bg-violet-400' : i === questionIdx ? 'bg-white' : 'bg-white/[0.1]'
          }`} />
        ))}
      </div>
    </div>
  )
}
