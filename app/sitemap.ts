import { MetadataRoute } from 'next';
import { getAllPlatforms } from '@/lib/osint/platformDirectory';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';
  const platforms = getAllPlatforms();
  const now = new Date();

  const platformEntries: MetadataRoute.Sitemap = platforms.map((p) => ({
    url: `${baseUrl}/platforms/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/platforms`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...platformEntries,
  ];
}
