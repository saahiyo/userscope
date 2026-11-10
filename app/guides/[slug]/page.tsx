import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HeaderNav } from '@/components/HeaderNav';
import { LandingFooter } from '@/components/LandingFooter';
import { GuideContent } from '@/components/GuideContent';
import { GuideQuickScan } from '@/components/GuideQuickScan';
import { getAllGuides, getGuideBySlug } from '@/lib/guides/guidesData';
import { PLATFORM_COUNT } from '@/lib/osint/platformDirectory';
import {
  ChevronRight,
  Clock,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  ListOrdered,
} from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export async function generateStaticParams() {
  return getAllGuides().map((g) => ({
    slug: g.slug,
  }));
}

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};

  const url = `${siteUrl}/guides/${guide.slug}`;

  return {
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.description,
      url,
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author.name],
      tags: guide.tags,
      siteName: 'UserScope',
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.description,
      images: ['/og.png'],
    },
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const allGuides = getAllGuides();
  const relatedGuides = allGuides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${siteUrl}/guides/${guide.slug}/#article`,
        isPartOf: {
          '@id': `${siteUrl}/guides/#webpage`,
        },
        headline: guide.title,
        description: guide.description,
        inLanguage: 'en-US',
        mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt,
        author: {
          '@type': 'Organization',
          name: guide.author.name,
          url: siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'UserScope',
          url: siteUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/icon.svg`,
          },
        },
        keywords: guide.tags.join(', '),
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
          {
            '@type': 'ListItem',
            position: 3,
            name: guide.title,
            item: `${siteUrl}/guides/${guide.slug}`,
          },
        ],
      },
      ...(guide.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${siteUrl}/guides/${guide.slug}/#faq`,
              mainEntity: guide.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-label flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderNav totalPlatforms={PLATFORM_COUNT} />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-14 w-full">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-apple-label-tertiary mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-apple-label transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/guides" className="hover:text-apple-label transition-colors">
            Guides
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-apple-label font-medium truncate max-w-xs sm:max-w-md">
            {guide.title}
          </span>
        </nav>

        {/* Focused Article Header */}
        <header className="space-y-4 pb-8 border-b border-apple-border/60">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
              {guide.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-apple-label-tertiary">
              <Clock className="w-3.5 h-3.5" />
              <span>{guide.readingTime}</span>
            </div>
            <span className="text-apple-border">•</span>
            <div className="flex items-center gap-1.5 text-xs text-apple-label-tertiary">
              <Calendar className="w-3.5 h-3.5" />
              <span>Updated {guide.updatedAt}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-apple-label leading-[1.18]">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-apple-label-secondary leading-relaxed pt-1">
            {guide.description}
          </p>

          <div className="flex items-center gap-3 pt-3">
            <div className="w-8 h-8 rounded-full bg-apple-well border border-apple-border flex items-center justify-center text-apple-blue shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-apple-label">{guide.author.name}</p>
              <p className="text-[11px] text-apple-label-tertiary">{guide.author.role}</p>
            </div>
          </div>
        </header>

        {/* Compact, Inline Table of Contents */}
        {guide.tableOfContents.length > 0 && (
          <details className="my-8 rounded-xl bg-apple-well/50 border border-apple-border p-4 text-xs group" open>
            <summary className="font-semibold text-apple-label cursor-pointer flex items-center justify-between select-none">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-apple-label">
                <ListOrdered className="w-4 h-4 text-apple-blue" />
                Table of Contents
              </span>
              <span className="text-[11px] text-apple-label-tertiary group-open:rotate-90 transition-transform">
                ▶
              </span>
            </summary>
            <nav className="mt-3.5 pt-3 border-t border-apple-border/50 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {guide.tableOfContents.map((item, idx) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-start gap-1.5 text-apple-label-secondary hover:text-apple-blue transition-colors leading-normal"
                >
                  <span className="text-apple-label-tertiary font-mono shrink-0">{idx + 1}.</span>
                  <span className="line-clamp-1">{item.title}</span>
                </a>
              ))}
            </nav>
          </details>
        )}

        {/* Focused Reading Body */}
        <article className="min-w-0">
          {/* Interactive Quick Scan Callout */}
          <GuideQuickScan />

          {/* Markdown Body with Clean Typography */}
          <GuideContent content={guide.content} />

          {/* Frequently Asked Questions */}
          {guide.faqs.length > 0 && (
            <section id="faqs" className="mt-14 pt-8 border-t border-apple-border scroll-mt-24">
              <div className="flex items-center gap-2 mb-6">
                <span className="p-1.5 rounded-lg bg-apple-blue/10 text-apple-blue">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-apple-label">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-4">
                {guide.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-apple-card border border-apple-border/80 space-y-2"
                  >
                    <h4 className="text-sm sm:text-base font-semibold text-apple-label">
                      {faq.question}
                    </h4>
                    <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Topics & Tags */}
          <div className="mt-12 pt-6 border-t border-apple-border/50 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-apple-label-tertiary uppercase tracking-wider">
              Topics:
            </span>
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-apple-well text-apple-label-secondary border border-apple-border"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Post-Reading Section: Directory CTA + Related Guides */}
        <div className="mt-16 pt-10 border-t border-apple-border/80 space-y-10">
          {/* Platform Directory Cross-Promotion */}
          <div className="p-6 sm:p-7 rounded-2xl bg-apple-well/60 border border-apple-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-apple-label tracking-tight">
                Auditing handles across multiple networks?
              </h4>
              <p className="text-xs text-apple-label-secondary max-w-md leading-relaxed">
                UserScope checks unauthenticated profile endpoints across {PLATFORM_COUNT} platforms in developer, social, and gaming networks.
              </p>
            </div>
            <Link
              href="/platforms"
              className="px-4 py-2 rounded-xl bg-apple-card hover:bg-apple-chip border border-apple-border text-xs font-semibold text-apple-label inline-flex items-center gap-1.5 shrink-0 shadow-apple-sm transition-all"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-3.5 h-3.5 text-apple-blue" />
            </Link>
          </div>

          {/* Related Guides Grid */}
          {relatedGuides.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-apple-label-tertiary">
                Continue Reading
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedGuides.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/guides/${rel.slug}`}
                    className="p-4 rounded-xl bg-apple-card border border-apple-border/80 hover:border-apple-border-focus transition-all group flex flex-col justify-between"
                  >
                    <p className="text-xs font-semibold text-apple-label group-hover:text-apple-blue transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </p>
                    <span className="text-[11px] text-apple-label-tertiary mt-3 font-mono">
                      {rel.readingTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <LandingFooter platformCount={PLATFORM_COUNT} />
    </div>
  );
}
