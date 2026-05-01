import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const size = parseInt(searchParams.get('size') || '512')

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0f0f2d 100%)',
          borderRadius: size * 0.2,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
            boxShadow: '0 0 60px rgba(99, 102, 241, 0.5)',
          }}
        >
          <span style={{ fontSize: size * 0.4, textAlign: 'center' }}>🌍</span>
        </div>
      </div>
    ),
    { width: size, height: size }
  )
}
