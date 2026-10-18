'use client'
import { useEffect } from 'react'

// Rendered when the root layout itself fails, so no providers (language, theme) are available here.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ background: '#050507', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <main id="main-content" style={{ textAlign: 'center', padding: '2rem', maxWidth: '28rem' }} role="alert">
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p style={{ color: '#a0a0b0', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            The dashboard couldn’t load. Please try again in a moment.
          </p>
          <button type="button" onClick={reset} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
            Try again
          </button>
          {error?.digest && (
            <p style={{ color: '#8b8b9e', fontSize: '0.6875rem', marginTop: '1.5rem' }}>Reference: <code>{error.digest}</code></p>
          )}
        </main>
      </body>
    </html>
  )
}
