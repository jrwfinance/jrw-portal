import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'JRW Finance — Mortgage Brokers Sydney'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px 72px',
          background: '#0d1002',
          position: 'relative',
        }}
      >
        {/* Grid dot pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(223,231,119,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse at 100% 0%, rgba(223,231,119,0.12) 0%, transparent 60%)',
          }}
        />
        {/* Bottom fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '300px',
            background: 'linear-gradient(to top, rgba(13,16,2,0.9) 0%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Logo pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(223,231,119,0.1)',
              border: '1px solid rgba(223,231,119,0.2)',
              borderRadius: '100px',
              padding: '8px 18px',
              width: 'fit-content',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#dfe777',
              }}
            />
            <span
              style={{
                color: '#dfe777',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              JRW Finance
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              color: '#ffffff',
              fontSize: '68px',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              maxWidth: '800px',
            }}
          >
            Property lending for people who take it seriously.
          </div>

          {/* Sub */}
          <div
            style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '22px',
              fontWeight: 300,
              lineHeight: 1.5,
              maxWidth: '560px',
              marginTop: '4px',
            }}
          >
            Mortgage brokers · 40+ lenders · Sydney, Australia
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, transparent, #dfe777, transparent)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
