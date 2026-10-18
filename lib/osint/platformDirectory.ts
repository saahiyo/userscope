import rawSites from './wmnData.json';
import { POPULAR_SITES } from './sites';

export type CategoryKey = 'all' | 'developer' | 'social' | 'gaming' | 'media' | 'finance' | 'services';

export interface CategoryMetadata {
  key: CategoryKey;
  label: string;
  description: string;
  badgeClass: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryMetadata> = {
  all: {
    key: 'all',
    label: 'All Registries',
    description: 'Comprehensive global catalog of verified public ecosystems and developer registries.',
    badgeClass: 'text-apple-label bg-apple-well border-apple-border',
  },
  developer: {
    key: 'developer',
    label: 'Developer & Code',
    description: 'Code repositories, package registries, bug trackers, and developer communities.',
    badgeClass: 'text-apple-blue bg-apple-blue/10 border-apple-blue/20',
  },
  social: {
    key: 'social',
    label: 'Social & Identity',
    description: 'Social networking platforms, messaging networks, forums, and identity registries.',
    badgeClass: 'text-apple-purple bg-apple-purple/10 border-apple-purple/20',
  },
  gaming: {
    key: 'gaming',
    label: 'Gaming & Virtual',
    description: 'Gaming ecosystems, competitive platforms, leaderboards, and game mod hubs.',
    badgeClass: 'text-apple-green bg-apple-green/10 border-apple-green/20',
  },
  media: {
    key: 'media',
    label: 'Media & Creative',
    description: 'Video networks, music streaming, design portfolios, and creative communities.',
    badgeClass: 'text-apple-pink bg-apple-pink/10 border-apple-pink/20',
  },
  finance: {
    key: 'finance',
    label: 'Finance & Business',
    description: 'Financial communities, freelance markets, creator tipping, and crypto networks.',
    badgeClass: 'text-apple-orange bg-apple-orange/10 border-apple-orange/20',
  },
  services: {
    key: 'services',
    label: 'Global Services & Community',
    description: 'Knowledge bases, shopping platforms, blogs, public archives, and international services.',
    badgeClass: 'text-apple-teal bg-apple-teal/10 border-apple-teal/20',
  },
};

export interface PlatformRecord {
  slug: string;
  name: string;
  category: string;
  categoryKey: CategoryKey;
  urlPattern: string;
  domain: string;
  faviconUrl: string;
  checkType: 'REST API' | 'HTTP Status' | 'Public Body Matching';
  isPopular: boolean;
  sampleUsers: string[];
}

function mapCategory(rawCat?: string): { key: CategoryKey; label: string } {
  const cat = (rawCat || '').toLowerCase();

  if (cat === 'coding' || cat === 'tech') {
    return { key: 'developer', label: 'Developer & Code' };
  }
  if (cat === 'social' || cat === 'blog' || cat === 'forum') {
    return { key: 'social', label: 'Social & Identity' };
  }
  if (cat === 'gaming') {
    return { key: 'gaming', label: 'Gaming & Virtual' };
  }
  if (cat === 'music' || cat === 'art' || cat === 'images' || cat === 'video') {
    return { key: 'media', label: 'Media & Creative' };
  }
  if (cat === 'finance' || cat === 'business') {
    return { key: 'finance', label: 'Finance & Business' };
  }

  return { key: 'services', label: 'Global Services & Community' };
}

function extractDomain(url: string): string {
  try {
    const formatted = url.replace('{account}', 'test').replace('{username}', 'test');
    const u = new URL(formatted);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

function createBaseSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Build sanitized and deduplicated platform catalog once
const popularNames = new Set(POPULAR_SITES.map((s) => s.name.toLowerCase()));

const allPlatformsList: PlatformRecord[] = [];
const slugToPlatform = new Map<string, PlatformRecord>();
const usedSlugs = new Set<string>();

interface RawWmnItem {
  name: string;
  uri_check: string;
  uri_pretty?: string;
  cat?: string;
  known?: string[];
  e_code?: number;
  m_code?: number;
}

const typedRaw = rawSites as RawWmnItem[];

for (const item of typedRaw) {
  // Exclude adult/NSFW platforms from public SEO index
  if ((item.cat || '').toLowerCase().includes('nsfw')) {
    continue;
  }

  const { key: categoryKey, label: categoryLabel } = mapCategory(item.cat);
  const prettyUrl = item.uri_pretty || item.uri_check;
  const domain = extractDomain(prettyUrl);

  let baseSlug = createBaseSlug(item.name) || 'platform';
  let slug = baseSlug;
  let counter = 1;

  while (usedSlugs.has(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  usedSlugs.add(slug);

  const isPopular = popularNames.has(item.name.toLowerCase());
  const checkType =
    item.uri_check.includes('api.') || item.uri_check.includes('/api/') || item.uri_check.includes('graphql')
      ? 'REST API'
      : item.m_code === 404
      ? 'HTTP Status'
      : 'Public Body Matching';

  const record: PlatformRecord = {
    slug,
    name: item.name,
    category: categoryLabel,
    categoryKey,
    urlPattern: prettyUrl.replace('{account}', '{username}'),
    domain,
    faviconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
    checkType,
    isPopular,
    sampleUsers: (item.known || []).slice(0, 4),
  };

  allPlatformsList.push(record);
  slugToPlatform.set(slug, record);
}

// Sort alphabetically, with popular platforms prioritized in listing
export const ALL_PLATFORMS = allPlatformsList;

export function getAllPlatforms(): PlatformRecord[] {
  return ALL_PLATFORMS;
}

export function getPlatformBySlug(slug: string): PlatformRecord | undefined {
  return slugToPlatform.get(slug);
}

export function getPlatformsByCategory(categoryKey: CategoryKey): PlatformRecord[] {
  if (categoryKey === 'all') return ALL_PLATFORMS;
  return ALL_PLATFORMS.filter((p) => p.categoryKey === categoryKey);
}

export function getPopularPlatforms(limit: number = 24): PlatformRecord[] {
  const popular = ALL_PLATFORMS.filter((p) => p.isPopular);
  if (popular.length >= limit) return popular.slice(0, limit);
  // Fill remaining slots with well-known recognizable services
  const remaining = ALL_PLATFORMS.filter((p) => !p.isPopular);
  return [...popular, ...remaining].slice(0, limit);
}

export function getRelatedPlatforms(platform: PlatformRecord, limit: number = 4): PlatformRecord[] {
  return ALL_PLATFORMS
    .filter((p) => p.slug !== platform.slug && p.categoryKey === platform.categoryKey)
    .slice(0, limit);
}
