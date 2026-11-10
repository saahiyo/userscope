import { PlatformRecord } from './platformDirectory';

export interface UsernameRuleDefinition {
  minLength: number;
  maxLength: number;
  allowedChars: string;
  caseSensitive: boolean;
  specialRules: string[];
  exampleValid: string;
  exampleInvalid: string;
  notes?: string;
}

const BESPOKE_RULES: Record<string, UsernameRuleDefinition> = {
  github: {
    minLength: 1,
    maxLength: 39,
    allowedChars: 'Alphanumeric (a-z, 0-9) and single hyphens (-)',
    caseSensitive: false,
    specialRules: [
      'Cannot start or end with a hyphen',
      'Cannot contain consecutive hyphens (--)',
      'Reserved usernames (admin, api, raw) cannot be registered',
    ],
    exampleValid: 'torvalds',
    exampleInvalid: '-invalid-',
    notes: 'GitHub usernames map directly to repository URLs and public SSH key discovery endpoints.',
  },
  gitlab: {
    minLength: 2,
    maxLength: 255,
    allowedChars: 'Alphanumeric, underscores, hyphens, and periods',
    caseSensitive: false,
    specialRules: [
      'Cannot start or end with a period or hyphen',
      'Cannot contain consecutive periods or special characters',
    ],
    exampleValid: 'gitlab-user',
    exampleInvalid: '.invalid.',
    notes: 'Used for personal namespace and default git remote URLs.',
  },
  reddit: {
    minLength: 3,
    maxLength: 20,
    allowedChars: 'Alphanumeric (a-z, 0-9), underscores (_), and hyphens (-)',
    caseSensitive: false,
    specialRules: [
      'Cannot start with an underscore or hyphen',
      'Usernames cannot be changed once created on Reddit',
    ],
    exampleValid: 'spez',
    exampleInvalid: '_invalid_username_too_long_',
    notes: 'Reddit handles resolve to u/{username} user profile endpoints.',
  },
  x: {
    minLength: 4,
    maxLength: 15,
    allowedChars: 'Letters (a-z), numbers (0-9), and underscores (_)',
    caseSensitive: false,
    specialRules: [
      'Cannot contain symbols, dashes, or spaces',
      'Must not exceed 15 characters',
    ],
    exampleValid: 'jack',
    exampleInvalid: 'my-handle-with-dashes',
    notes: 'Commonly prefixed with @ in public citations, but queried without @ in URLs.',
  },
  telegram: {
    minLength: 5,
    maxLength: 32,
    allowedChars: 'Alphanumeric (a-z, 0-9) and underscores (_)',
    caseSensitive: false,
    specialRules: [
      'Must be at least 5 characters long',
      'Cannot begin or end with an underscore',
      'Cannot contain consecutive underscores',
    ],
    exampleValid: 'durov',
    exampleInvalid: 'tg_1',
    notes: 'Public Telegram usernames create t.me/{username} deep links.',
  },
  discord: {
    minLength: 2,
    maxLength: 32,
    allowedChars: 'Lowercase alphanumeric (a-z, 0-9), underscores (_), and periods (.)',
    caseSensitive: false,
    specialRules: [
      'Must be entirely lowercase',
      'Cannot have consecutive periods (..)',
      'Legacy four-digit discriminators (#0000) have been deprecated',
    ],
    exampleValid: 'gamer_tag',
    exampleInvalid: 'User..Name',
    notes: 'Universal global handles across all Discord servers and direct messages.',
  },
  steam: {
    minLength: 3,
    maxLength: 32,
    allowedChars: 'Alphanumeric (a-z, 0-9) and underscores (_)',
    caseSensitive: false,
    specialRules: [
      'Custom vanity URLs allow letters, digits, and underscores',
      'Steam Community vanity URLs resolve under steamcommunity.com/id/{vanity}',
    ],
    exampleValid: 'valve_gamer',
    exampleInvalid: 'ab',
    notes: 'Distinct from internal numerical SteamID64 values.',
  },
  npm: {
    minLength: 1,
    maxLength: 214,
    allowedChars: 'Lowercase alphanumeric, hyphens (-), and underscores (_)',
    caseSensitive: false,
    specialRules: [
      'Must be lowercase',
      'Cannot start with a period or underscore',
      'Cannot contain URL-unfriendly characters',
    ],
    exampleValid: 'sindresorhus',
    exampleInvalid: 'UpperCase_Author',
    notes: 'Author namespaces on npm publish scoped packages under @{username}/{package}.',
  },
  pypi: {
    minLength: 1,
    maxLength: 50,
    allowedChars: 'Alphanumeric (a-z, 0-9), hyphens (-), and underscores (_)',
    caseSensitive: false,
    specialRules: [
      'Case-insensitive package maintainer accounts',
      'Directly links to Python package maintainer profiles',
    ],
    exampleValid: 'tiangolo',
    exampleInvalid: 'user@name!',
    notes: 'Maintainer profile on the Python Package Index.',
  },
  dockerhub: {
    minLength: 4,
    maxLength: 30,
    allowedChars: 'Lowercase alphanumeric (a-z, 0-9) and hyphens (-)',
    caseSensitive: false,
    specialRules: [
      'Cannot begin or end with a hyphen',
      'Must contain only lowercase letters and digits',
    ],
    exampleValid: 'library',
    exampleInvalid: 'Docker_User',
    notes: 'Docker image repositories are published under {username}/{repository}.',
  },
  medium: {
    minLength: 3,
    maxLength: 30,
    allowedChars: 'Alphanumeric, hyphens, and periods',
    caseSensitive: false,
    specialRules: [
      'Can resolve as subdomain or medium.com/@{username}',
      'Cannot begin with a hyphen',
    ],
    exampleValid: 'ev',
    exampleInvalid: 'no spaces allowed',
    notes: 'Author and publication handle on Medium.',
  },
  youtube: {
    minLength: 3,
    maxLength: 30,
    allowedChars: 'Alphanumeric (a-z, 0-9), periods (.), underscores (_), and hyphens (-)',
    caseSensitive: false,
    specialRules: [
      'YouTube handles begin with @ in UI but resolve at youtube.com/@{handle}',
      'Cannot mimic URL identifiers or reserved channel paths',
    ],
    exampleValid: 'mkbhd',
    exampleInvalid: 'a b c',
    notes: 'Unified channel and creator handle across YouTube.',
  },
  twitch: {
    minLength: 4,
    maxLength: 25,
    allowedChars: 'Alphanumeric (a-z, 0-9) and underscores (_)',
    caseSensitive: false,
    specialRules: [
      'Cannot start with an underscore',
      'Cannot contain symbols or spaces',
    ],
    exampleValid: 'shroud',
    exampleInvalid: 'tv',
    notes: 'Live channel handle and chat identity.',
  },
  spotify: {
    minLength: 1,
    maxLength: 64,
    allowedChars: 'Alphanumeric characters, usernames, or Spotify alphanumeric IDs',
    caseSensitive: false,
    specialRules: [
      'Newer profiles may use generated alphanumeric IDs',
      'Custom display names can differ from account IDs',
    ],
    exampleValid: 'spotify_artist',
    exampleInvalid: 'invalid#user',
    notes: 'User profile on Spotify for public playlists and artist follows.',
  },
  chesscom: {
    minLength: 3,
    maxLength: 20,
    allowedChars: 'Alphanumeric (a-z, 0-9) and hyphens (-)',
    caseSensitive: false,
    specialRules: [
      'Case-insensitive lookup',
      'Cannot contain consecutive hyphens',
    ],
    exampleValid: 'hikaru',
    exampleInvalid: 'hi',
    notes: 'Public player profile and game archive on Chess.com.',
  },
};

export function getUsernameRules(platform: PlatformRecord): UsernameRuleDefinition {
  const normalized = platform.slug.replace(/[^a-z0-9]/g, '');
  if (BESPOKE_RULES[normalized]) {
    return BESPOKE_RULES[normalized];
  }

  // Fallback to intelligent category-driven defaults
  switch (platform.categoryKey) {
    case 'developer':
      return {
        minLength: 2,
        maxLength: 64,
        allowedChars: 'Alphanumeric (a-z, 0-9), hyphens (-), and underscores (_)',
        caseSensitive: false,
        specialRules: [
          'Typically cannot begin or end with a hyphen or dot',
          'Avoid punctuation marks other than hyphens and underscores',
        ],
        exampleValid: 'dev-handle',
        exampleInvalid: 'dev@domain!',
        notes: `Standard developer registry naming convention for ${platform.name}.`,
      };
    case 'gaming':
      return {
        minLength: 3,
        maxLength: 32,
        allowedChars: 'Alphanumeric (a-z, 0-9), underscores (_), and dashes (-)',
        caseSensitive: false,
        specialRules: [
          'Spaces and special non-ASCII symbols are generally disallowed in profile URLs',
        ],
        exampleValid: 'player_one',
        exampleInvalid: 'p 1',
        notes: `Gamer tag and community vanity handle conventions on ${platform.name}.`,
      };
    case 'media':
      return {
        minLength: 2,
        maxLength: 50,
        allowedChars: 'Alphanumeric characters, underscores, and hyphens',
        caseSensitive: false,
        specialRules: [
          'URL handles must be alphanumeric; creator display names may differ',
        ],
        exampleValid: 'creator_studio',
        exampleInvalid: 'user name',
        notes: `Public creator or channel URL handle on ${platform.name}.`,
      };
    case 'finance':
      return {
        minLength: 3,
        maxLength: 40,
        allowedChars: 'Alphanumeric characters and hyphens',
        caseSensitive: false,
        specialRules: [
          'Financial profiles typically require strict alphanumeric handles without symbols',
        ],
        exampleValid: 'investor-pro',
        exampleInvalid: 'user$123',
        notes: `Profile namespace standards on ${platform.name}.`,
      };
    default:
      return {
        minLength: 3,
        maxLength: 32,
        allowedChars: 'Alphanumeric (a-z, 0-9), underscores (_), and periods (.)',
        caseSensitive: false,
        specialRules: [
          'Cannot contain spaces or special punctuation characters',
          'Query without leading @ symbol',
        ],
        exampleValid: 'target_alias',
        exampleInvalid: '@target alias',
        notes: `Standard public URL handle pattern on ${platform.name}.`,
      };
  }
}
