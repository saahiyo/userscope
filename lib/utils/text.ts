/**
 * Utility to decode HTML entities and format strings cleanly.
 */
export function decodeHtmlEntities(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Filter out web scraper junk, page boilerplate, site prefixes, and generic titles
 * returning only genuine human names / meaningful aliases, or null.
 */
export function cleanDisplayName(rawName: string | undefined, username: string): string | null {
  if (!rawName) return null;
  let name = decodeHtmlEntities(rawName).trim();

  // Strip common platform suffixes:
  // e.g. "torvalds on DeviantArt" -> "torvalds"
  // "torvalds's profile on AudioJungle"
  // "TorVaLDs (@torvalds) on Flipboard"
  name = name.replace(/\s+(?:on|at)\s+[A-Za-z0-9._-]+$/i, '');
  name = name.replace(/'s\s+(?:profile|Applets|account|portfolio|channel|stream)\s*(?:on\s+.*)?$/i, '');
  name = name.replace(/\s+profile\s+on\s+.*$/i, '');
  name = name.replace(/\s*\(@?[A-Za-z0-9_.-]+\)/gi, '');
  name = name.replace(/\s+ID:\s*\d+/gi, '');
  name = name.replace(/\s+aka\s+.*$/i, '');
  name = name.replace(/^Portfolio\s+of\s+/i, '');
  name = name.trim();

  // Blacklist of generic page boilerplate phrases and scraper junk (case-insensitive)
  const junkPatterns = [
    /gifs?\s+on/i,
    /portfolio\s+фрилансера/i,
    /портфолио/i,
    /пользователь/i,
    /profil\s+użytkownika/i,
    /kwejki\s+użytkownika/i,
    /блог\s+будущего/i,
    /profile\b/i,
    /applets?\b/i,
    /freelancer?\b/i,
    /not found\b/i,
    /login\b/i,
    /sign\s*in/i,
    /welcome to/i,
    /user account/i,
    /^i\d{5,}/i, // e.g. "i1597029's Profile"
  ];

  for (const pattern of junkPatterns) {
    if (pattern.test(name)) return null;
  }

  // Handle parenthesis annotations like "torvalds (Hemant)"
  if (name.includes('(') && name.includes(')')) {
    const match = name.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const inside = match[1].trim();
      // If inside is a clean human name like "Hemant", prioritize it
      if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(inside)) {
        name = inside;
      } else {
        name = name.replace(/\([^)]*\)/g, '').trim();
      }
    }
  }

  // If sanitized name matches the handle itself (case-insensitive), discard as redundant
  if (name.toLowerCase() === username.toLowerCase()) {
    return null;
  }

  // Length constraints
  if (name.length < 2 || name.length > 35) {
    return null;
  }

  // Must contain at least one letter
  if (!/[a-zA-Z\u00C0-\u024F\u0400-\u04FF]/.test(name)) {
    return null;
  }

  return name;
}

/**
 * Clean and format location strings, filtering out 1-2 letter raw country codes or noise.
 */
export function cleanLocation(rawLoc: string | undefined): string | null {
  if (!rawLoc) return null;
  const loc = decodeHtmlEntities(rawLoc).trim();

  // Filter single chars or map common 2-letter ISO country codes
  if (loc.length <= 2) {
    const isoMap: Record<string, string> = {
      in: 'India',
      us: 'United States',
      uk: 'United Kingdom',
      ca: 'Canada',
      de: 'Germany',
      fr: 'France',
      au: 'Australia',
      br: 'Brazil',
      jp: 'Japan',
      gt: 'Guatemala',
    };
    return isoMap[loc.toLowerCase()] || null;
  }

  if (loc.length < 2 || loc.length > 50) return null;
  return loc;
}
