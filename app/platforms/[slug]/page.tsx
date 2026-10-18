import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { LandingFooter } from '@/components/LandingFooter';
import { PlatformScanForm } from '@/components/PlatformScanForm';
import { PlatformFavicon } from '@/components/PlatformFavicon';
import {
  getPlatformBySlug,
  getPopularPlatforms,
  getRelatedPlatforms,
  CATEGORIES,
} from '@/lib/osint/platformDirectory';
import {
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Zap,
  Lock,
  ArrowRight,
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export const dynamicParams = true;

export async function generateStaticParams() {
  const popular = getPopularPlatforms(25);
  return popular.map((p) => ({
    slug: p.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const platform = getPlatformBySlug(params.slug);

  if (!platform) {
    return {
      title: 'Platform Not Found | UserScope',
    };
  }

  const title = `Check Username on ${platform.name} — OSINT Footprint Reconnaissance`;
  const description = `Search and verify if any username, handle, or digital footprint exists on ${platform.name} and 650+ public registries in real time. Free passive OSINT reconnaissance with zero query logging.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/platforms/${platform.slug}`,
    },
    openGraph: {
      title: `${title} | UserScope`,
      description,
      url: `${siteUrl}/platforms/${platform.slug}`,
      siteName: 'UserScope',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: `UserScope - Check Username on ${platform.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | UserScope`,
      description,
      images: ['/og.png'],
    },
  };
}

export default function PlatformPage({ params }: PageProps) {
  const platform = getPlatformBySlug(params.slug);

  if (!platform) {
    notFound();
  }

  const related = getRelatedPlatforms(platform, 4);
  const categoryInfo = CATEGORIES[platform.categoryKey];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemPage',
        '@id': `${siteUrl}/platforms/${platform.slug}/#webpage`,
        url: `${siteUrl}/platforms/${platform.slug}`,
        name: `Check Username on ${platform.name} — OSINT Reconnaissance`,
        description: `Verify handle presence and discover public profile footprints on ${platform.name}.`,
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
            name: 'Platforms',
            item: `${siteUrl}/platforms`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: platform.name,
            item: `${siteUrl}/platforms/${platform.slug}`,
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: `UserScope ${platform.name} Reconnaissance Engine`,
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Any (Web Browser)',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: `Real-time public username verification tool probing ${platform.name} and 650+ other public networks.`,
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
      <HeaderNav totalPlatforms={653} />

      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-apple-label-tertiary">
          <Link href="/" className="hover:text-apple-label transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/platforms" className="hover:text-apple-label transition-colors">
            Platforms
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-apple-label font-medium">{platform.name}</span>
        </nav>

        {/* Platform Hero Card */}
        <header className="apple-card rounded-[22px] sm:rounded-[26px] p-5 sm:p-7 border border-apple-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-apple-sm">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-apple-well border border-apple-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <PlatformFavicon
                src={platform.faviconUrl}
                alt={`${platform.name} favicon`}
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                fallbackSize={28}
              />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-apple-label">
                  {platform.name}
                </h1>
                <span
                  className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                    categoryInfo?.badgeClass || ''
                  }`}
                >
                  {platform.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-apple-label-secondary font-mono">
                <a
                  href={`https://${platform.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-apple-label transition-colors inline-flex items-center gap-1"
                >
                  <span>{platform.domain}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
                <span>&bull;</span>
                <span className="text-apple-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-apple-green animate-pulse" />
                  <span>Engine Active</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-apple-label-tertiary">
            <span className="px-3 py-1 rounded-full bg-apple-well border border-apple-border">
              {platform.checkType}
            </span>
          </div>
        </header>

        {/* Quick Scan Action Form */}
        <PlatformScanForm
          platformName={platform.name}
          sampleUsers={platform.sampleUsers}
        />

        {/* Technical Reconnaissance Blueprint */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-apple-label tracking-tight">
            Reconnaissance Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="apple-card rounded-[18px] p-4 sm:p-5 border border-apple-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-apple-label">
                <Cpu className="w-4 h-4 text-apple-blue" />
                <span>Handle Pattern & Endpoint</span>
              </div>
              <p className="text-xs text-apple-label-secondary leading-relaxed">
                UserScope checks account registration on {platform.name} by passively querying the official public structure:
              </p>
              <div className="p-2.5 rounded-[10px] bg-apple-well border border-apple-border font-mono text-xs text-apple-label break-all">
                {platform.urlPattern}
              </div>
            </div>

            <div className="apple-card rounded-[18px] p-4 sm:p-5 border border-apple-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-apple-label">
                <Lock className="w-4 h-4 text-apple-green" />
                <span>Zero Query Logging & Privacy</span>
              </div>
              <p className="text-xs text-apple-label-secondary leading-relaxed">
                All searches against {platform.name} are performed using passive unauthenticated requests. No search query logs, handles, or IP histories are recorded.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-apple-green">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Client-Side Privacy Guaranteed</span>
              </div>
            </div>
          </div>
        </section>

        {/* Related Platforms in the Same Category */}
        {related.length > 0 && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-apple-label tracking-tight">
                Related {platform.category} Ecosystems
              </h2>
              <Link
                href="/platforms"
                className="text-xs text-apple-blue hover:underline inline-flex items-center gap-1"
              >
                <span>View all platforms</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/platforms/${rel.slug}`}
                  className="apple-card rounded-[16px] p-4 border border-apple-border hover:border-apple-border-strong transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[8px] bg-apple-well border border-apple-border flex items-center justify-center shrink-0">
                      <PlatformFavicon
                        src={rel.faviconUrl}
                        alt={`${rel.name} icon`}
                        className="w-4 h-4 object-contain"
                        fallbackSize={16}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-xs sm:text-sm text-apple-label group-hover:text-apple-blue transition-colors block truncate">
                        {rel.name}
                      </span>
                      <span className="text-[11px] font-mono text-apple-label-tertiary block truncate">
                        {rel.domain}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-apple-label-tertiary group-hover:text-apple-label group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
