import Link from 'next/link'
import { Compass, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0 p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Compass className="w-8 h-8 text-indigo-400" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-ink-1 mb-2">Page not found</h1>
        <p className="text-sm text-ink-4 mb-6">
          This page doesn&apos;t exist or has moved. Press <kbd className="px-1.5 py-0.5 rounded bg-fg/[0.06] text-[11px] text-ink-3">⌘K</kbd> to search sections, or head back home.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
