import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { PLATFORM_COUNT, SCAN_RULE_COUNT } from '@/lib/osint/platformDirectory';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free Username Search Across Public Platforms | UserScope',
    template: '%s | UserScope',
  },
  description: `Free username search across ${PLATFORM_COUNT} public platforms. Check public profile endpoints and follow results as they stream to your browser.`,
  keywords: [
    'UserScope',
    'OSINT',
    'OSINT username search',
    'username search',
    'digital footprint checker',
    'reverse username search',
    'public profile lookup',
    'footprint reconnaissance',
    'sherlock alternative online',
    'whatsmyname alternative',
    'find accounts by handle',
    'social media handle search',
    'passive OSINT reconnaissance',
  ],
  authors: [{ name: 'UserScope' }],
  creator: 'UserScope',
  alternates: {
    canonical: siteUrl,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Free Username Search Across Public Platforms | UserScope',
    description: `Search public handles across ${PLATFORM_COUNT} public platforms with live result streaming.`,
    url: siteUrl,
    siteName: 'UserScope',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `UserScope username search across ${PLATFORM_COUNT} public platforms`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Username Search Across Public Platforms | UserScope',
    description: `Search public handles across ${PLATFORM_COUNT} public platforms with live result streaming.`,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'UserScope',
      description: `Username search across ${PLATFORM_COUNT} public platforms.`,
      publisher: {
        '@type': 'Organization',
        name: 'UserScope',
        url: siteUrl,
        sameAs: ['https://github.com/saahiyo/userscope'],
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#app`,
      name: 'UserScope',
      url: siteUrl,
      applicationCategory: 'SecurityApplication',
      applicationSubCategory: 'OSINT & Digital Footprint Reconnaissance',
      operatingSystem: 'Any (Web Browser)',
      description: `Username reconnaissance across ${PLATFORM_COUNT} public platforms with server-side checks streamed to your browser.`,
      screenshot: `${siteUrl}/og.png`,
      softwareVersion: '0.1.0',
      license: 'https://opensource.org/licenses/MIT',
      featureList: [
        'Real-time SSE streaming reconnaissance',
        `${PLATFORM_COUNT} public platform listings and ${SCAN_RULE_COUNT} scan rules`,
        'Interactive identity relationship graph',
        'Chronological presence timeline',
        'One-click JSON & CSV forensic intelligence export',
        'Server-side public endpoint checks streamed to the browser',
      ],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Organization',
        name: 'UserScope',
        url: 'https://github.com/saahiyo/userscope',
        sameAs: ['https://github.com/saahiyo/userscope'],
      },
    },
  ],
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('userscope-theme') || localStorage.getItem('spectra-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'light' || (!stored && !prefersDark)) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-apple-bg text-apple-label antialiased selection:bg-apple-blue/20 selection:text-apple-blue"
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
