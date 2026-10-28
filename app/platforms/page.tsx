import type { Metadata } from 'next';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { LandingFooter } from '@/components/LandingFooter';
import { PlatformDirectoryClient } from '@/components/PlatformDirectoryClient';
import { getAllPlatforms, PLATFORM_COUNT } from '@/lib/osint/platformDirectory';
import { ArrowLeft, ChevronRight, Layers, ShieldCheck } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export const metadata: Metadata = {
  title: `Username Search Platforms (${PLATFORM_COUNT})`,
  description:
    `Browse ${PLATFORM_COUNT} public platforms supported by UserScope. Search by platform name, domain, or category, then check a username.`,
  alternates: {
    canonical: `${siteUrl}/platforms`,
  },
  openGraph: {
    title: `Username Search Platforms (${PLATFORM_COUNT}) | UserScope`,
    description:
      `Browse ${PLATFORM_COUNT} public platforms supported by UserScope and open a platform page to check a username.`,
    url: `${siteUrl}/platforms`,
    siteName: 'UserScope',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'UserScope Platform Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Username Search Platforms (${PLATFORM_COUNT}) | UserScope`,
    description:
      `Browse ${PLATFORM_COUNT} public platforms supported by UserScope and open a platform page to check a username.`,
    images: ['/og.png'],
  },
};

export default function PlatformsPage() {
  const platforms = getAllPlatforms();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/platforms/#webpage`,
        url: `${siteUrl}/platforms`,
        name: `Username Search Platforms (${PLATFORM_COUNT})`,
        description:
            `Directory of ${PLATFORM_COUNT} public platforms supported for username presence checks.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: siteUrl,
          name: 'UserScope',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Platforms Directory',
            item: `${siteUrl}/platforms`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-label antialiased relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* Header Navigation */}
      <HeaderNav totalPlatforms={platforms.length} />

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-apple-label-tertiary">
          <Link href="/" className="hover:text-apple-label transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-apple-label font-medium">Platforms Directory</span>
        </nav>

        {/* Directory Hero Header */}
        <header className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-well border border-apple-border text-[11px] font-medium text-apple-label-secondary shadow-apple-sm">
            <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
            <span>{PLATFORM_COUNT} Listed Platforms</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-apple-label">
            Search Platforms by Username
          </h1>

          <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
            Find a platform by name, domain, or category, then open its page to check a public username.
          </p>
        </header>

        {/* Interactive Directory Client Component */}
        <PlatformDirectoryClient platforms={platforms} />
      </main>

      <LandingFooter platformCount={PLATFORM_COUNT} />
    </div>
  );
}
