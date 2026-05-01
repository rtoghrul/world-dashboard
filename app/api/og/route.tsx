import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'World Dashboard'
  const subtitle = searchParams.get('subtitle') || 'AI Tools · Crypto · News · Software · Entertainment'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #030305 0%, #0a0a1a 40%, #1a1035 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(99,102,241,0.15), transparent)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '999px',
              padding: '8px 20px',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ color: '#a5b4fc', fontSize: '16px' }}>Live Dashboard</span>
          </div>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #6366f1 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: '22px', color: '#8b8b9e', textAlign: 'center' }}>
            {subtitle}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '20px',
            }}
          >
            {[
              { label: 'Sections', value: '15+' },
              { label: 'Languages', value: '12' },
              { label: 'Real-time', value: '24/7' },
            ].map((stat) => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>{stat.value}</span>
                <span style={{ fontSize: '14px', color: '#6b6b80' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
