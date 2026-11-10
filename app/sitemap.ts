import { MetadataRoute } from 'next';
import { getAllPlatforms } from '@/lib/osint/platformDirectory';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';
  const platforms = getAllPlatforms();
  const currentDate = new Date().toISOString();

  const platformEntries: MetadataRoute.Sitemap = platforms.map((p) => ({
    url: `${baseUrl}/platforms/${p.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: p.isPopular ? 0.8 : 0.6,
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
    ...platformEntries,
  ];
}
