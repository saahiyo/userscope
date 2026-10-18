export interface SiteDefinition {
  name: string;
  category: 'social' | 'coding' | 'gaming' | 'music' | 'finance' | 'forum' | 'portfolio' | 'design' | 'security';
  url: string;
  checkUrl: string;
  method?: 'GET' | 'HEAD';
  expectedStatus?: number;
  missingStatus?: number;
  missingString?: string;
  presentString?: string;
  headers?: Record<string, string>;
  faviconUrl?: string;
  isApi?: boolean;
}

export interface DiscoveredProfile {
  id: string;
  platform: string;
  category: string;
  username: string;
  profileUrl: string;
  verified?: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
  faviconUrl?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  email?: string;
  joinedDate?: string;
  followers?: string | number;
  following?: string | number;
  posts?: string | number;
  extraFields?: Record<string, string | number | boolean>;
  checkedAt: number;
}

export interface SearchAggregatedSummary {
  profilePictures: string[];
  banners: string[];
  emails: string[];
  locations: string[];
  names: string[];
  usernames: string[];
  firstSeen?: string;
  lastSeen?: string;
}

export interface SearchStreamEvent {
  type: 'hit' | 'miss' | 'progress' | 'complete' | 'error';
  profile?: DiscoveredProfile;
  checkedCount?: number;
  totalCount?: number;
  hitsCount?: number;
  timeElapsedMs?: number;
  summary?: SearchAggregatedSummary;
  message?: string;
}
