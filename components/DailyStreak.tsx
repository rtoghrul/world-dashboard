'use client'
import { useState, useEffect } from 'react'
import { Flame, Trophy, Star } from 'lucide-react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastVisit: string
  totalVisits: number
}

export default function DailyStreak() {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 })
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wd-streak')
    const data: StreakData = saved ? JSON.parse(saved) : { currentStreak: 0, longestStreak: 0, lastVisit: '', totalVisits: 0 }
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

    if (data.lastVisit === today) {
      setStreak(data)
      return
    }

    let newStreak = data.currentStreak
    if (data.lastVisit === yesterday) {
      newStreak += 1
      if (newStreak % 7 === 0 || newStreak === 1) setShowCelebration(true)
    } else if (data.lastVisit !== today) {
      newStreak = 1
    }

    const updated: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(data.longestStreak, newStreak),
      lastVisit: today,
      totalVisits: data.totalVisits + 1,
    }
    localStorage.setItem('wd-streak', JSON.stringify(updated))
    setStreak(updated)
  }, [])

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showCelebration])

  const milestones = [7, 14, 30, 60, 100, 365]
  const nextMilestone = milestones.find(m => m > streak.currentStreak) || streak.currentStreak + 7
  const progress = (streak.currentStreak % (nextMilestone > 7 ? nextMilestone - milestones[milestones.indexOf(nextMilestone) - 1] || nextMilestone : 7)) / (nextMilestone > 7 ? nextMilestone - (milestones[milestones.indexOf(nextMilestone) - 1] || 0) : 7) * 100

  return (
    <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-3 relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 animate-pulse-glow" />
      )}

      <div className="relative flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          streak.currentStreak >= 7 ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-white/[0.04]'
        }`}>
          <Flame className={`w-5 h-5 ${streak.currentStreak >= 7 ? 'text-amber-400' : 'text-[#4a4a5e]'}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{streak.currentStreak}</span>
            <span className="text-[#8b8b9e] text-xs">day streak</span>
            {streak.currentStreak >= 7 && <Star className="w-3 h-3 text-amber-400" />}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-[#4a4a5e] flex items-center gap-1">
              <Trophy className="w-2.5 h-2.5" /> Best: {streak.longestStreak}
            </span>
            <span className="text-[10px] text-[#4a4a5e]">
              Next: {nextMilestone} days
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar to next milestone */}
      <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}
