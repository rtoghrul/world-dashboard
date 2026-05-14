import Link from 'next/link'

export default function GlobalFactsNav() {
  return (
    <Link
      href="/facts"
      aria-label="Open Facts"
      style={{
        position: 'fixed',
        top: '18px',
        left: '214px',
        zIndex: 2147483000,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 10px',
        borderRadius: '8px',
        color: '#a5a5b8',
        background: '#07070b',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1,
        textDecoration: 'none',
        pointerEvents: 'auto',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.02)',
      }}
    >
      <span>Facts</span>
      <span style={{ color: '#6b6b80', fontSize: '10px' }}>▾</span>
    </Link>
  )
}
