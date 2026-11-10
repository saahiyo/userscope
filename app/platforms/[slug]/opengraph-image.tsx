import { ImageResponse } from 'next/og';
import { getPlatformBySlug } from '@/lib/osint/platformDirectory';

export const runtime = 'edge';
export const alt = 'UserScope Platform Reconnaissance';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const platform = getPlatformBySlug(params.slug);

  const platformName = platform?.name || 'Platform';
  const category = platform?.category || 'Public Registry';
  const domain = platform?.domain || 'web';
  const checkType = platform?.checkType || 'Endpoint Check';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0c',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1a1a24 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a24 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px 70px',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#f5f5f7',
        }}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#0071e3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 113, 227, 0.4)',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '3px solid #ffffff',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>
                UserScope
              </span>
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#86868b',
                  fontWeight: 600,
                }}
              >
                OSINT Reconnaissance Studio
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(52, 199, 89, 0.12)',
              border: '1px solid rgba(52, 199, 89, 0.3)',
              color: '#34c759',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#34c759',
              }}
            />
            <span>Engine Active • {checkType}</span>
          </div>
        </div>

        {/* Center Main Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '40px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: '#1c1c1e',
                border: '1px solid #2c2c2e',
                color: '#2997ff',
              }}
            >
              {category}
            </span>
            <span style={{ fontSize: '15px', color: '#86868b', fontFamily: 'monospace' }}>
              {domain}
            </span>
          </div>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: 0,
              background: 'linear-gradient(180deg, #ffffff 0%, #a1a1a6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Check {platformName} Usernames
          </h1>

          <p
            style={{
              fontSize: '22px',
              color: '#86868b',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '900px',
            }}
          >
            Verify public profile presence, trace digital footprints, and inspect endpoints across
            653 platforms with real-time SSE streaming.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1c1c1e',
            paddingTop: '28px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f5f5f7' }}>
              <span style={{ color: '#2997ff', fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: '15px', color: '#a1a1a6' }}>653 Platforms</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f5f5f7' }}>
              <span style={{ color: '#af52de', fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: '15px', color: '#a1a1a6' }}>Zero Login Required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f5f5f7' }}>
              <span style={{ color: '#34c759', fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: '15px', color: '#a1a1a6' }}>Passive Ethical Queries</span>
            </div>
          </div>

          <span
            style={{
              fontSize: '15px',
              fontFamily: 'monospace',
              color: '#6e6e73',
            }}
          >
            userscope.space
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
