'use client'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function SectionError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 relative z-[1] flex items-center justify-center">
      <ErrorBoundary>
        <div className="text-center px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Page Error</h2>
          <p className="text-sm text-[#6b6b80] mb-6 max-w-md">{error.message || 'Something went wrong loading this section.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-500/30 transition">
              Try Again
            </button>
            <a href="/" className="px-4 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white text-sm hover:bg-white/[0.1] transition">
              Go Home
            </a>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  )
}
