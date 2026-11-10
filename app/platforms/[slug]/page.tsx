import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { LandingFooter } from '@/components/LandingFooter';
import { PlatformScanForm } from '@/components/PlatformScanForm';
import { PlatformFavicon } from '@/components/PlatformFavicon';
import {
  getPlatformBySlug,
  getAllPlatforms,
  getRelatedPlatforms,
  CATEGORIES,
  PLATFORM_COUNT,
  SCAN_RULE_COUNT,
} from '@/lib/osint/platformDirectory';
import { getUsernameRules } from '@/lib/osint/usernameRules';
import {
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Lock,
  ArrowRight,
  Search,
  HelpCircle,
  FileText,
  Activity,
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllPlatforms().map((p) => ({
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

  const title = `Free ${platform.name} Username Search & Profile Lookup`;
  const description = `Free ${platform.name} username search and OSINT lookup. Verify public accounts and trace digital footprints across ${PLATFORM_COUNT}+ platforms — no login.`;
  const ogImageUrl = `${siteUrl}/platforms/${platform.slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/platforms/${platform.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: `${title} | UserScope`,
      description,
      url: `${siteUrl}/platforms/${platform.slug}`,
      siteName: 'UserScope',
      images: [
        {
          url: ogImageUrl,
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
      images: [ogImageUrl],
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
  const rules = getUsernameRules(platform);

  const faqs = [
    {
      q: `How does UserScope check if a username exists on ${platform.name}?`,
      a: `UserScope inspects public endpoints on ${platform.name} (${platform.domain}) using passive query patterns (${platform.checkType}). It verifies whether the username returns an active profile or an unregistered 404 response without making unauthorized modifications or alerting the account owner.`,
    },
    {
      q: `What username length and characters are allowed on ${platform.name}?`,
      a: `Handles on ${platform.name} typically range from ${rules.minLength} to ${rules.maxLength} characters. Allowed characters include ${rules.allowedChars}. Note that queries should be entered without any leading '@' or URL symbols.`,
    },
    {
      q: `Does ${platform.name} notify the account owner when a search is performed?`,
      a: `No. UserScope issues unauthenticated, read-only requests against public HTTP or API endpoints. The account owner is never notified, and no account credentials or sessions are used.`,
    },
    {
      q: `How does UserScope process searches for ${platform.name}?`,
      a: `Searches are sent to UserScope's server, which checks public endpoints and streams live telemetry to your browser via Server-Sent Events (SSE). The application does not save search histories.`,
    },
    {
      q: `Why is checking ${platform.name} valuable during OSINT investigations?`,
      a: `As part of the ${platform.category} ecosystem, usernames on ${platform.name} frequently correlate across other public registries. Correlating identical handles across multiple platforms helps identify digital footprints, verify online presence, or protect personal brand identity.`,
    },
    {
      q: `What does it mean if a handle on ${platform.name} returns 404?`,
      a: `A 404 status indicates that the handle is currently unregistered or unallocated on ${platform.name}. It may be open for brand registration or was previously deactivated by the platform.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemPage',
        '@id': `${siteUrl}/platforms/${platform.slug}/#webpage`,
        url: `${siteUrl}/platforms/${platform.slug}`,
        name: `Check ${platform.name} Usernames`,
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
        description: `Check public username presence on ${platform.name} with UserScope.`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
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
      <HeaderNav totalPlatforms={PLATFORM_COUNT} />

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
                  Check Usernames on {platform.name}
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
          platformSlug={platform.slug}
          sampleUsers={platform.sampleUsers}
          domain={platform.domain}
          urlPattern={platform.urlPattern}
          faviconUrl={platform.faviconUrl}
          platformCount={PLATFORM_COUNT}
          scanRuleCount={SCAN_RULE_COUNT}
        />

        {/* Username Constraints & Guidelines Section */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-apple-label tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-apple-blue" />
              <span>{platform.name} Username Format & Constraints</span>
            </h2>
            <p className="text-xs text-apple-label-secondary leading-relaxed">
              Namespace rules, character limitations, and valid handle syntax for {platform.name}:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="apple-card rounded-[16px] p-4 border border-apple-border space-y-1">
              <span className="text-[11px] font-semibold text-apple-label-tertiary uppercase tracking-wider block">
                Character Length
              </span>
              <span className="text-sm font-bold text-apple-label font-mono">
                {rules.minLength} – {rules.maxLength} chars
              </span>
            </div>

            <div className="apple-card rounded-[16px] p-4 border border-apple-border space-y-1">
              <span className="text-[11px] font-semibold text-apple-label-tertiary uppercase tracking-wider block">
                Case Sensitivity
              </span>
              <span className="text-sm font-bold text-apple-label font-mono">
                {rules.caseSensitive ? 'Case Sensitive' : 'Case Insensitive'}
              </span>
            </div>

            <div className="apple-card rounded-[16px] p-4 border border-apple-border space-y-1 sm:col-span-2">
              <span className="text-[11px] font-semibold text-apple-label-tertiary uppercase tracking-wider block">
                Allowed Characters
              </span>
              <span className="text-xs font-semibold text-apple-label leading-tight block">
                {rules.allowedChars}
              </span>
            </div>
          </div>

          <div className="apple-card rounded-[18px] p-4 sm:p-5 border border-apple-border space-y-3">
            <div className="text-xs font-semibold text-apple-label flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-apple-teal" />
              <span>Namespace Policy & Platform Rules</span>
            </div>
            <ul className="space-y-2 text-xs text-apple-label-secondary list-disc list-inside">
              {rules.specialRules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-apple-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-[10px] bg-apple-green/10 border border-apple-green/20 text-apple-green flex items-center justify-between">
                <span className="text-[11px] font-bold">Valid Example:</span>
                <span className="font-semibold">{rules.exampleValid}</span>
              </div>
              <div className="p-2.5 rounded-[10px] bg-apple-pink/10 border border-apple-pink/20 text-apple-pink flex items-center justify-between">
                <span className="text-[11px] font-bold">Disallowed Example:</span>
                <span className="line-through opacity-80">{rules.exampleInvalid}</span>
              </div>
            </div>
          </div>
        </section>

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
                <span>Server-Processed Public Checks</span>
              </div>
              <p className="text-xs text-apple-label-secondary leading-relaxed">
                Searches are sent to UserScope&apos;s server, which checks the public {platform.name} endpoint and streams the result to your browser. The app does not provide saved search history.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-apple-green">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Public Endpoint Check</span>
              </div>
            </div>
          </div>
        </section>

        {/* How to Check & Investigate Guide */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-apple-label tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-apple-blue" />
              <span>How to Check Username Availability & Presence on {platform.name}</span>
            </h2>
            <p className="text-xs text-apple-label-secondary leading-relaxed">
              Step-by-step guidance for security researchers, brand protection teams, and OSINT investigators:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="apple-card rounded-[16px] p-4 border border-apple-border space-y-2">
              <div className="w-6 h-6 rounded-full bg-apple-blue/10 text-apple-blue flex items-center justify-center text-xs font-bold font-mono">
                1
              </div>
              <h3 className="text-xs font-semibold text-apple-label">Enter Exact Handle</h3>
              <p className="text-[12px] text-apple-label-secondary leading-relaxed">
                Provide the username or handle without extra spaces or symbols. For {platform.name}, usernames resolve directly via <span className="font-mono text-apple-label">{platform.domain}</span>.
              </p>
            </div>

            <div className="apple-card rounded-[16px] p-4 border border-apple-border space-y-2">
              <div className="w-6 h-6 rounded-full bg-apple-purple/10 text-apple-purple flex items-center justify-center text-xs font-bold font-mono">
                2
              </div>
              <h3 className="text-xs font-semibold text-apple-label">Passive Probe Execution</h3>
              <p className="text-[12px] text-apple-label-secondary leading-relaxed">
                UserScope leverages high-efficiency {platform.checkType} queries to verify whether the target identity returns a valid public response code.
              </p>
            </div>

            <div className="apple-card rounded-[16px] p-4 border border-apple-border space-y-2">
              <div className="w-6 h-6 rounded-full bg-apple-green/10 text-apple-green flex items-center justify-center text-xs font-bold font-mono">
                3
              </div>
              <h3 className="text-xs font-semibold text-apple-label">Cross-Network Footprint</h3>
              <p className="text-[12px] text-apple-label-secondary leading-relaxed">
                Scan {platform.name} individually or check the full {PLATFORM_COUNT}-platform catalog to compare public username presence.
              </p>
            </div>
          </div>
        </section>

        {/* How to Interpret Scan Results */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-apple-label tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-apple-purple" />
              <span>Interpreting {platform.name} Scan Telemetry</span>
            </h2>
            <p className="text-xs text-apple-label-secondary leading-relaxed">
              Understand the meaning of each verification status returned by the UserScope engine:
            </p>
          </div>

          <div className="apple-card rounded-[18px] p-5 border border-apple-border divide-y divide-apple-border/60">
            <div className="py-3 first:pt-0 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-apple-green mt-1.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-apple-label font-mono">FOUND / CLAIMED</span>
                <p className="text-[12px] text-apple-label-secondary leading-relaxed">
                  An active account or public profile was verified on {platform.name}. You can click through directly to inspect public repository activity, biography details, or profile timestamps.
                </p>
              </div>
            </div>

            <div className="py-3 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-apple-label-tertiary mt-1.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-apple-label font-mono">AVAILABLE / UNCLAIMED (404)</span>
                <p className="text-[12px] text-apple-label-secondary leading-relaxed">
                  The handle does not currently exist on {platform.name}. It may be available for registration, or previously purged from the platform&apos;s namespace.
                </p>
              </div>
            </div>

            <div className="py-3 last:pb-0 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-apple-orange mt-1.5 shrink-0" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-apple-label font-mono">PROTECTED / RATE LIMITED</span>
                <p className="text-[12px] text-apple-label-secondary leading-relaxed">
                  The platform&apos;s anti-scraping or rate limit mechanisms triggered a verification block. Re-probe using direct browser verification via the link provided above.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-apple-label tracking-tight flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-apple-teal" />
              <span>Frequently Asked Questions about {platform.name} Reconnaissance</span>
            </h2>
            <p className="text-xs text-apple-label-secondary leading-relaxed">
              Common questions regarding handle verification, namespace rules, and privacy on {platform.name}:
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="apple-card rounded-[16px] p-4 sm:p-5 border border-apple-border space-y-1.5"
              >
                <h3 className="text-xs sm:text-sm font-semibold text-apple-label">
                  {faq.q}
                </h3>
                <p className="text-xs text-apple-label-secondary leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
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

      <LandingFooter platformCount={PLATFORM_COUNT} />
    </div>
  );
}
