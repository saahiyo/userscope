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
  rawItem?: any;
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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeForMatching(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const POPULAR_ALIASES = new Set([
  'github',
  'reddit',
  'duolingo',
  'chesscom',
  'hackernews',
  'deviantart',
  'steam',
  'telegram',
  'medium',
  'spotify',
  'soundcloud',
  'gitlab',
  'dockerhub',
  'npm',
  'ifttt',
  'patreon',
  'pinterest',
  'vimeo',
  'codepen',
  'devto',
  'kaggle',
  'lichess',
  'replit',
  'behance',
  'dribbble',
  'substack',
  'linktree',
  'letterboxd',
  'producthunt',
  'buymeacoffee',
  'fiverr',
  'aboutme',
  'keybase',
  'lastfm',
  'bitbucket',
  'instructables',
  'twitter',
  'x',
  'instagram',
  'youtube',
  'tiktok',
  'twitch',
  'linkedin',
  'discord',
]);

function parsePlatformIdentity(rawName: string): {
  slug: string;
  displayName: string;
  isPrimary: boolean;
  priority: number;
} {
  const match = rawName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const base = match[1].trim();
    const modifier = match[2].trim().toLowerCase();
    if (['user', 'profile', 'profiles', 'public', 'account'].includes(modifier)) {
      return {
        slug: slugify(base),
        displayName: base,
        isPrimary: true,
        priority: 1,
      };
    }
    return {
      slug: slugify(`${base}-${modifier}`),
      displayName: rawName,
      isPrimary: false,
      priority: 2,
    };
  }
  return {
    slug: slugify(rawName),
    displayName: rawName,
    isPrimary: true,
    priority: 1,
  };
}

// Build sanitized and deduplicated platform catalog once
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

const typedRaw = (rawSites as RawWmnItem[]).filter(
  (item) => !(item.cat || '').toLowerCase().includes('nsfw')
);

// Sort so primary profiles (priority 1) claim canonical slugs before sub-services
typedRaw.sort(
  (a, b) => parsePlatformIdentity(a.name).priority - parsePlatformIdentity(b.name).priority
);

for (const item of typedRaw) {
  const { key: categoryKey, label: categoryLabel } = mapCategory(item.cat);
  const prettyUrl = item.uri_pretty || item.uri_check;
  const domain = extractDomain(prettyUrl);
  const identity = parsePlatformIdentity(item.name);

  let baseSlug = identity.slug || 'platform';
  let slug = baseSlug;
  let counter = 1;

  while (usedSlugs.has(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  usedSlugs.add(slug);

  const cleanNorm = normalizeForMatching(identity.displayName);
  const isPopular = POPULAR_ALIASES.has(cleanNorm);

  const checkType =
    item.uri_check.includes('api.') || item.uri_check.includes('/api/') || item.uri_check.includes('graphql')
      ? 'REST API'
      : item.m_code === 404
      ? 'HTTP Status'
      : 'Public Body Matching';

  const record: PlatformRecord = {
    slug,
    name: identity.displayName,
    category: categoryLabel,
    categoryKey,
    urlPattern: prettyUrl.replace('{account}', '{username}'),
    domain,
    faviconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`,
    checkType,
    isPopular,
    sampleUsers: (item.known || []).slice(0, 4),
    rawItem: item,
  };

  allPlatformsList.push(record);
  slugToPlatform.set(slug, record);
}

// Sort: popular platforms first, then alphabetically by name
allPlatformsList.sort((a, b) => {
  if (a.isPopular && !b.isPopular) return -1;
  if (!a.isPopular && b.isPopular) return 1;
  return a.name.localeCompare(b.name);
});

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
