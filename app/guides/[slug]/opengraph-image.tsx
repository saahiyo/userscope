import { ImageResponse } from 'next/og';
import { getGuideBySlug } from '@/lib/guides/guidesData';

export const runtime = 'edge';
export const alt = 'UserScope OSINT Guide';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);

  const title = guide?.title || 'OSINT & Reconnaissance Guide';
  const category = guide?.category || 'Tutorial';
  const readingTime = guide?.readingTime || '7 min read';
  const author = guide?.author.name || 'UserScope Research Team';

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
        {/* Top Header */}
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
              <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                UserScope
              </span>
              <span style={{ fontSize: '12px', color: '#86868b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                OSINT Knowledge Base
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(0, 113, 227, 0.15)',
              border: '1px solid rgba(0, 113, 227, 0.3)',
              borderRadius: '999px',
              padding: '8px 18px',
              fontSize: '14px',
              color: '#2997ff',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {category} Guide
          </div>
        </div>

        {/* Center: Title & Read Time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '15px',
                color: '#a1a1a6',
                fontFamily: 'monospace',
              }}
            >
              ⏱ {readingTime} • Technical Guide
            </span>
          </div>

          <h1
            style={{
              fontSize: title.length > 55 ? '46px' : '54px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              margin: 0,
              color: '#ffffff',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom Footer Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #22222a',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#86868b', fontSize: '16px' }}>
            <span>By {author}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2997ff', fontSize: '15px', fontWeight: 600 }}>
            <span>userscope.space/guides</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
