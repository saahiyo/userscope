import { DiscoveredProfile, SearchStreamEvent, SearchAggregatedSummary } from './types';
import { POPULAR_SITES } from './sites';
import { enrichFromApiResponse, enrichFromHtml } from './enrichers';
import { cleanDisplayName, cleanLocation } from '@/lib/utils/text';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export async function scanUsernameStream(
  username: string,
  onEvent: (event: SearchStreamEvent) => void
) {
  const startTime = Date.now();

  const aggregatedSummary: SearchAggregatedSummary = {
    profilePictures: [],
    banners: [],
    emails: username.includes('@') ? [username] : [],
    locations: [],
    names: [],
    usernames: [username],
    firstSeen: undefined,
    lastSeen: undefined
  };

  let earliestTimestamp: number | null = null;
  let latestTimestamp: number | null = null;

  // Generic lookup across POPULAR_SITES
  const sites = POPULAR_SITES;
  const totalCount = sites.length;
  let checkedCount = 0;
  let hitsCount = 0;

  const queue = [...sites];
  const concurrency = 8;

  async function worker() {
    while (queue.length > 0) {
      const site = queue.shift();
      if (!site) break;

      const profile = await checkSiteGeneric(site, username);
      checkedCount++;

      if (profile) {
        hitsCount++;
        if (profile.joinedDate) {
          const parsed = Date.parse(profile.joinedDate);
          if (!isNaN(parsed)) {
            if (earliestTimestamp === null || parsed < earliestTimestamp) {
              earliestTimestamp = parsed;
              aggregatedSummary.firstSeen = profile.joinedDate;
            }
            if (latestTimestamp === null || parsed > latestTimestamp) {
              latestTimestamp = parsed;
              aggregatedSummary.lastSeen = profile.joinedDate;
            }
          }
        }
        if (profile.avatarUrl && !aggregatedSummary.profilePictures.includes(profile.avatarUrl)) {
          aggregatedSummary.profilePictures.push(profile.avatarUrl);
        }
        if (profile.bannerUrl && !aggregatedSummary.banners.includes(profile.bannerUrl)) {
          aggregatedSummary.banners.push(profile.bannerUrl);
        }
        if (profile.email && !aggregatedSummary.emails.includes(profile.email)) {
          aggregatedSummary.emails.push(profile.email);
        }
        if (profile.location) {
          const cleanLoc = cleanLocation(profile.location);
          if (cleanLoc && !aggregatedSummary.locations.some(l => l.toLowerCase() === cleanLoc.toLowerCase())) {
            aggregatedSummary.locations.push(cleanLoc);
          }
        }
        if (profile.displayName) {
          const cleanName = cleanDisplayName(profile.displayName, username);
          if (cleanName && !aggregatedSummary.names.some(n => n.toLowerCase() === cleanName.toLowerCase())) {
            aggregatedSummary.names.push(cleanName);
          }
        }

        onEvent({
          type: 'hit',
          profile,
          checkedCount,
          totalCount,
          hitsCount,
          timeElapsedMs: Date.now() - startTime,
          summary: aggregatedSummary
        });
      } else {
        onEvent({
          type: 'progress',
          checkedCount,
          totalCount,
          hitsCount,
          timeElapsedMs: Date.now() - startTime,
          summary: aggregatedSummary
        });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  onEvent({
    type: 'complete',
    checkedCount: totalCount,
    totalCount,
    hitsCount,
    timeElapsedMs: Date.now() - startTime,
    summary: aggregatedSummary
  });
}

async function checkSiteGeneric(site: any, username: string): Promise<DiscoveredProfile | null> {
  const checkUrl = site.checkUrl.replace(/{username}/g, encodeURIComponent(username));
  const profileUrl = site.url.replace(/{username}/g, encodeURIComponent(username));
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6500);

  try {
    const res = await fetch(checkUrl, {
      method: site.method || 'GET',
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': site.isApi ? 'application/json, text/plain, */*' : 'text/html',
        ...(site.headers || {})
      },
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (site.expectedStatus && res.status !== site.expectedStatus) return null;
    if (site.missingStatus && res.status === site.missingStatus) return null;
    if (!res.ok && !site.expectedStatus) return null;

    let rawText = '';
    let jsonData: any = null;

    if (site.isApi) {
      try {
        jsonData = await res.json();
        rawText = JSON.stringify(jsonData);
      } catch {
        rawText = await res.text();
      }
    } else {
      rawText = await res.text();
    }

    if (site.missingString && rawText.includes(site.missingString)) return null;
    if (site.presentString && !rawText.includes(site.presentString)) return null;

    let enrichedData: Partial<DiscoveredProfile> = {};
    if (site.isApi && jsonData) {
      enrichedData = enrichFromApiResponse(site, username, jsonData);
    } else {
      enrichedData = enrichFromHtml(rawText, site.name, username);
    }

    return {
      id: `${site.name}-${username}`,
      platform: site.name,
      category: site.category || 'social',
      username,
      profileUrl,
      verified: true,
      displayName: enrichedData.displayName || username,
      avatarUrl: enrichedData.avatarUrl,
      bannerUrl: enrichedData.bannerUrl,
      bio: enrichedData.bio,
      location: enrichedData.location,
      email: enrichedData.email,
      joinedDate: enrichedData.joinedDate,
      followers: enrichedData.followers,
      following: enrichedData.following,
      posts: enrichedData.posts,
      extraFields: enrichedData.extraFields,
      checkedAt: Date.now()
    };
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}
