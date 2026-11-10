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
  User,
  Share2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
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

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
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

        {/* Article Header */}
        <header className="space-y-4 max-w-3xl pb-8 border-b border-apple-border/60">
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-apple-label leading-tight">
            {guide.title}
          </h1>

          <p className="text-base sm:text-lg text-apple-label-secondary leading-relaxed">
            {guide.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-apple-well border border-apple-border flex items-center justify-center text-apple-blue">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-apple-label">{guide.author.name}</p>
              <p className="text-[11px] text-apple-label-tertiary">{guide.author.role}</p>
            </div>
          </div>
        </header>

        {/* Two-Column Body: Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
          {/* Main Article Content */}
          <article className="lg:col-span-8 min-w-0">
            {/* Interactive Quick Scan Callout */}
            <GuideQuickScan />

            {/* Markdown Body */}
            <GuideContent content={guide.content} />

            {/* Frequently Asked Questions */}
            {guide.faqs.length > 0 && (
              <section id="faqs" className="mt-16 pt-8 border-t border-apple-border scroll-mt-24">
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

            {/* Tags */}
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

          {/* Sticky Sidebar: Table of Contents & Related */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              {guide.tableOfContents.length > 0 && (
                <div className="p-5 rounded-2xl bg-apple-card border border-apple-border/80 shadow-apple-sm">
                  <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-apple-border/60">
                    <BookOpen className="w-4 h-4 text-apple-blue" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-apple-label">
                      On This Page
                    </h4>
                  </div>
                  <nav className="space-y-1.5 text-xs">
                    {guide.tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block py-1 text-apple-label-secondary hover:text-apple-blue transition-colors line-clamp-1 leading-normal"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Platform Directory Cross-Promotion */}
              <div className="p-5 rounded-2xl bg-apple-well/60 border border-apple-border shadow-apple-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-apple-label">
                  Monitored Platforms
                </h4>
                <p className="text-xs text-apple-label-secondary leading-relaxed">
                  UserScope monitors public profile rules across {PLATFORM_COUNT} platforms in developer, gaming, and social ecosystems.
                </p>
                <Link
                  href="/platforms"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-apple-blue hover:underline"
                >
                  <span>Explore Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <div className="p-5 rounded-2xl bg-apple-card border border-apple-border/80 shadow-apple-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-apple-label">
                    Related Guides
                  </h4>
                  <div className="space-y-3">
                    {relatedGuides.map((rel) => (
                      <Link
                        key={rel.slug}
                        href={`/guides/${rel.slug}`}
                        className="block group"
                      >
                        <p className="text-xs font-medium text-apple-label group-hover:text-apple-blue transition-colors line-clamp-2">
                          {rel.title}
                        </p>
                        <span className="text-[11px] text-apple-label-tertiary">
                          {rel.readingTime}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <LandingFooter platformCount={PLATFORM_COUNT} />
    </div>
  );
}
