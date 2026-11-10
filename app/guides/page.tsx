import type { Metadata } from 'next';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { LandingFooter } from '@/components/LandingFooter';
import { getAllGuides } from '@/lib/guides/guidesData';
import { PLATFORM_COUNT } from '@/lib/osint/platformDirectory';
import { BookOpen, Clock, ArrowRight, Shield, Sparkles, ChevronRight, Compass } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export const metadata: Metadata = {
  title: 'OSINT & Username Reconnaissance Guides | UserScope',
  description:
    'Comprehensive guides and tutorials on OSINT methodology, username enumeration, handle availability audits, and digital footprint defense.',
  alternates: {
    canonical: `${siteUrl}/guides`,
  },
  openGraph: {
    title: 'OSINT & Username Reconnaissance Guides | UserScope',
    description:
      'Master public reconnaissance, account enumeration mechanics, and digital footprint hygiene with in-depth technical guides.',
    url: `${siteUrl}/guides`,
    siteName: 'UserScope',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'UserScope OSINT Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OSINT & Username Reconnaissance Guides | UserScope',
    description:
      'Master public reconnaissance, account enumeration mechanics, and digital footprint hygiene with in-depth technical guides.',
    images: ['/og.png'],
  },
};

export default function GuidesHubPage() {
  const guides = getAllGuides();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${siteUrl}/guides/#webpage`,
        url: `${siteUrl}/guides`,
        name: 'OSINT & Username Reconnaissance Guides',
        description:
          'Comprehensive guides on OSINT methodology, username enumeration, handle availability, and footprint auditing.',
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
      },
      {
        '@type': 'ItemList',
        itemListElement: guides.map((guide, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${siteUrl}/guides/${guide.slug}`,
          name: guide.title,
          description: guide.description,
        })),
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
            name: 'Guides',
            item: `${siteUrl}/guides`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-label flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderNav totalPlatforms={PLATFORM_COUNT} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-apple-label-tertiary mb-6"
        >
          <Link href="/" className="hover:text-apple-label transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-apple-label font-medium">Guides</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide border border-apple-blue/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Topical Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-apple-label">
            OSINT & Digital Footprint Guides
          </h1>
          <p className="text-sm sm:text-base text-apple-label-secondary max-w-2xl leading-relaxed">
            Practical research, technical breakdowns, and methodologies on public account reconnaissance, username enumeration mechanics, and defensive privacy hygiene.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <article
              key={guide.slug}
              className="flex flex-col justify-between p-6 rounded-2xl bg-apple-card border border-apple-border/80 hover:border-apple-border-focus hover:shadow-apple-md transition-all duration-200 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border">
                    {guide.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-apple-label-tertiary font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{guide.readingTime}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-apple-label group-hover:text-apple-blue transition-colors leading-snug">
                    <Link href={`/guides/${guide.slug}`} className="focus:outline-none">
                      {guide.title}
                    </Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-apple-label-secondary mt-2 line-clamp-3 leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-apple-border/50 flex items-center justify-between">
                <div className="text-[11px] text-apple-label-tertiary">
                  Updated {guide.updatedAt}
                </div>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-apple-blue group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner linking to live tool */}
        <div className="mt-16 p-8 rounded-2xl bg-apple-well/60 border border-apple-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-lg font-bold text-apple-label tracking-tight">
              Ready to verify accounts across {PLATFORM_COUNT}+ platforms?
            </h3>
            <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
              Experience the fast streaming scanner. Zero installation, zero credentials required, and results delivered over real-time SSE.
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-apple-blue hover:bg-apple-blue/90 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-sm transition-all"
          >
            <span>Launch Live Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <LandingFooter platformCount={PLATFORM_COUNT} />
    </div>
  );
}
