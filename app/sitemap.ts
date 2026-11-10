import { MetadataRoute } from 'next';
import { getAllPlatforms } from '@/lib/osint/platformDirectory';
import { getAllGuides } from '@/lib/guides/guidesData';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';
  const platforms = getAllPlatforms();
  const guides = getAllGuides();
  const currentDate = new Date().toISOString();

  const platformEntries: MetadataRoute.Sitemap = platforms.map((p) => ({
    url: `${baseUrl}/platforms/${p.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: p.isPopular ? 0.8 : 0.6,
  }));

  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/platforms`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...guideEntries,
    ...platformEntries,
  ];
}
