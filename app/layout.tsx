import type { Metadata } from 'next';
import './globals.css';
import 'lenis/dist/lenis.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'UserScope — Public Footprint Reconnaissance',
    template: '%s | UserScope',
  },
  description:
    'Real-time open-source intelligence (OSINT) reconnaissance tool. Search public usernames, accounts, and digital footprints across 700+ platforms with zero paywalls.',
  keywords: [
    'UserScope',
    'OSINT',
    'username search',
    'digital footprint checker',
    'reverse username search',
    'public profile lookup',
    'footprint reconnaissance',
    'sherlock alternative online',
    'whatsmyname alternative',
    'find accounts by handle',
  ],
  authors: [{ name: 'UserScope' }],
  creator: 'UserScope',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'UserScope — Public Footprint Reconnaissance',
    description:
      'Search public handles and digital footprints across 700+ platforms in real time with live streaming telemetry.',
    url: siteUrl,
    siteName: 'UserScope',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'UserScope — Public Footprint Reconnaissance across 700+ platforms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UserScope — Public Footprint Reconnaissance',
    description:
      'Search public handles and digital footprints across 700+ platforms in real time with live streaming telemetry.',
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
      '@type': 'WebApplication',
      name: 'UserScope',
      url: siteUrl,
      applicationCategory: 'SecurityApplication',
      operatingSystem: 'All',
      description:
        'Real-time open-source intelligence reconnaissance tool searching public usernames and digital footprints across 700+ platforms.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is UserScope and what is it used for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'UserScope is an open-source intelligence (OSINT) reconnaissance platform that allows security researchers, penetration testers, and developers to determine where a specific handle or alias exists across 700+ public online platforms in real time.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does real-time Server-Sent Events (SSE) scanning work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When you initiate a scan, UserScope dispatches concurrent, asynchronous workers against public API endpoints. As soon as a platform verifies handle existence, the hit is streamed directly to your browser over an SSE connection in sub-second latency.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is querying public handles legal and safe?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. UserScope solely performs passive, unauthenticated queries against public endpoints that are open to the internet. It never accesses private communications, breaks authentication, or bypasses access controls.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does UserScope store, track, or sell searched usernames?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. UserScope does not maintain query databases or track user searches. The tool operates client-side streaming directly to your active browser session with complete investigative privacy.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I export the gathered reconnaissance intelligence?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. With one click, you can export all discovered profiles, verified URLs, avatar links, and metadata into standardized JSON or a spreadsheet-compatible CSV file.',
          },
        },
      ],
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
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
