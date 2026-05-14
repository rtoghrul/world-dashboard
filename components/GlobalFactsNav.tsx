import Link from 'next/link'

export default function GlobalFactsNav() {
  return (
    <Link
      href="/facts"
      aria-label="Open Facts"
      style={{
        position: 'fixed',
        top: '113px',
        left: '218px',
        zIndex: 2147483000,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 10px',
        borderRadius: '8px',
        color: '#a5a5b8',
        background: 'rgba(7, 7, 11, 0.88)',
        backdropFilter: 'blur(8px)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: 1,
        textDecoration: 'none',
        pointerEvents: 'auto',
      }}
    >
      <span>Facts</span>
      <span style={{ color: '#6b6b80', fontSize: '10px' }}>▾</span>
    </Link>
  )
}
