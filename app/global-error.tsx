'use client'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#050507', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#6b6b80', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{error?.message || 'An unexpected error occurred'}</p>
          <button onClick={reset} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
