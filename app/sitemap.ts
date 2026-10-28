import { MetadataRoute } from 'next';
import { getAllPlatforms } from '@/lib/osint/platformDirectory';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';
  const platforms = getAllPlatforms().filter((platform) => platform.isPopular);

  const platformEntries: MetadataRoute.Sitemap = platforms.map((p) => ({
    url: `${baseUrl}/platforms/${p.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/platforms`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...platformEntries,
  ];
}
