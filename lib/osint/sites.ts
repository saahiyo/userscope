import { SiteDefinition } from './types';

export const POPULAR_SITES: SiteDefinition[] = [
  {
    name: 'GitHub',
    category: 'coding',
    url: 'https://github.com/{username}',
    checkUrl: 'https://api.github.com/users/{username}',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://github.com&size=64',
    headers: {
      'User-Agent': 'Fingerprint-OSINT-Recon',
      'Accept': 'application/vnd.github.v3+json'
    }
  },
  {
    name: 'Reddit',
    category: 'forum',
    url: 'https://www.reddit.com/user/{username}',
    checkUrl: 'https://www.reddit.com/user/{username}/about.json',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    missingString: '"error": 404',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://reddit.com&size=64',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  },
  {
    name: 'Duolingo',
    category: 'social',
    url: 'https://www.duolingo.com/profile/{username}',
    checkUrl: 'https://www.duolingo.com/2017-06-30/users?username={username}',
    isApi: true,
    expectedStatus: 200,
    missingString: '"users":[]',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://duolingo.com&size=64',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  },
  {
    name: 'Chess.com',
    category: 'gaming',
    url: 'https://www.chess.com/member/{username}',
    checkUrl: 'https://api.chess.com/pub/player/{username}',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://chess.com&size=64'
  },
  {
    name: 'HackerNews',
    category: 'coding',
    url: 'https://news.ycombinator.com/user?id={username}',
    checkUrl: 'https://hacker-news.firebaseio.com/v0/user/{username}.json',
    isApi: true,
    expectedStatus: 200,
    missingString: 'null',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://news.ycombinator.com&size=64'
  },
  {
    name: 'DeviantArt',
    category: 'design',
    url: 'https://www.deviantart.com/{username}',
    checkUrl: 'https://www.deviantart.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'This user does not exist or has been deactivated',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://deviantart.com&size=64'
  },
  {
    name: 'Steam',
    category: 'gaming',
    url: 'https://steamcommunity.com/id/{username}',
    checkUrl: 'https://steamcommunity.com/id/{username}',
    expectedStatus: 200,
    missingString: 'The specified profile could not be found',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://store.steampowered.com&size=64'
  },
  {
    name: 'Telegram',
    category: 'social',
    url: 'https://t.me/{username}',
    checkUrl: 'https://t.me/{username}',
    expectedStatus: 200,
    missingString: 'If you have Telegram, you can contact @',
    presentString: 'tgme_page_title',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://telegram.org&size=64'
  },
  {
    name: 'Medium',
    category: 'social',
    url: 'https://medium.com/@{username}',
    checkUrl: 'https://medium.com/@{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'PAGE NOT FOUND',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://medium.com&size=64'
  },
  {
    name: 'Spotify',
    category: 'music',
    url: 'https://open.spotify.com/user/{username}',
    checkUrl: 'https://open.spotify.com/user/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://spotify.com&size=64'
  },
  {
    name: 'SoundCloud',
    category: 'music',
    url: 'https://soundcloud.com/{username}',
    checkUrl: 'https://soundcloud.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://soundcloud.com&size=64'
  },
  {
    name: 'GitLab',
    category: 'coding',
    url: 'https://gitlab.com/{username}',
    checkUrl: 'https://gitlab.com/api/v4/users?username={username}',
    isApi: true,
    expectedStatus: 200,
    missingString: '[]',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://gitlab.com&size=64'
  },
  {
    name: 'DockerHub',
    category: 'coding',
    url: 'https://hub.docker.com/u/{username}',
    checkUrl: 'https://hub.docker.com/v2/users/{username}/',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://docker.com&size=64'
  },
  {
    name: 'npm',
    category: 'coding',
    url: 'https://www.npmjs.com/~{username}',
    checkUrl: 'https://www.npmjs.com/~{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://npmjs.com&size=64'
  },
  {
    name: 'IFTTT',
    category: 'social',
    url: 'https://ifttt.com/p/{username}',
    checkUrl: 'https://ifttt.com/p/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'Page not found',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ifttt.com&size=64'
  },
  {
    name: 'Patreon',
    category: 'social',
    url: 'https://www.patreon.com/{username}',
    checkUrl: 'https://www.patreon.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://patreon.com&size=64'
  },
  {
    name: 'Pinterest',
    category: 'social',
    url: 'https://www.pinterest.com/{username}',
    checkUrl: 'https://www.pinterest.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://pinterest.com&size=64'
  },
  {
    name: 'Vimeo',
    category: 'social',
    url: 'https://vimeo.com/{username}',
    checkUrl: 'https://vimeo.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://vimeo.com&size=64'
  },
  {
    name: 'CodePen',
    category: 'coding',
    url: 'https://codepen.io/{username}',
    checkUrl: 'https://codepen.io/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: '404 - Not Found',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://codepen.io&size=64'
  },
  {
    name: 'Dev.to',
    category: 'coding',
    url: 'https://dev.to/{username}',
    checkUrl: 'https://dev.to/api/users/by_username?url={username}',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://dev.to&size=64'
  },
  {
    name: 'Kaggle',
    category: 'coding',
    url: 'https://www.kaggle.com/{username}',
    checkUrl: 'https://www.kaggle.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://kaggle.com&size=64'
  },
  {
    name: 'Lichess',
    category: 'gaming',
    url: 'https://lichess.org/@/{username}',
    checkUrl: 'https://lichess.org/api/user/{username}',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://lichess.org&size=64'
  },
  {
    name: 'Replit',
    category: 'coding',
    url: 'https://replit.com/@{username}',
    checkUrl: 'https://replit.com/@{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'User not found',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://replit.com&size=64'
  },
  {
    name: 'Behance',
    category: 'design',
    url: 'https://www.behance.net/{username}',
    checkUrl: 'https://www.behance.net/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://behance.net&size=64'
  },
  {
    name: 'Dribbble',
    category: 'design',
    url: 'https://dribbble.com/{username}',
    checkUrl: 'https://dribbble.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://dribbble.com&size=64'
  },
  {
    name: 'Substack',
    category: 'social',
    url: 'https://{username}.substack.com',
    checkUrl: 'https://{username}.substack.com/api/v1/user/by-username/{username}',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://substack.com&size=64'
  },
  {
    name: 'Linktree',
    category: 'portfolio',
    url: 'https://linktr.ee/{username}',
    checkUrl: 'https://linktr.ee/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'The page you’re looking for doesn’t exist',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://linktr.ee&size=64'
  },
  {
    name: 'Letterboxd',
    category: 'social',
    url: 'https://letterboxd.com/{username}',
    checkUrl: 'https://letterboxd.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'Sorry, we couldn’t find that page',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://letterboxd.com&size=64'
  },
  {
    name: 'ProductHunt',
    category: 'portfolio',
    url: 'https://www.producthunt.com/@{username}',
    checkUrl: 'https://www.producthunt.com/@{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'Page Not Found',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://producthunt.com&size=64'
  },
  {
    name: 'BuyMeACoffee',
    category: 'finance',
    url: 'https://www.buymeacoffee.com/{username}',
    checkUrl: 'https://www.buymeacoffee.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://buymeacoffee.com&size=64'
  },
  {
    name: 'Fiverr',
    category: 'portfolio',
    url: 'https://www.fiverr.com/{username}',
    checkUrl: 'https://www.fiverr.com/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fiverr.com&size=64'
  },
  {
    name: 'About.me',
    category: 'portfolio',
    url: 'https://about.me/{username}',
    checkUrl: 'https://about.me/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://about.me&size=64'
  },
  {
    name: 'Keybase',
    category: 'security',
    url: 'https://keybase.io/{username}',
    checkUrl: 'https://keybase.io/_/api/1.0/user/lookup.json?usernames={username}',
    isApi: true,
    expectedStatus: 200,
    missingString: '"them":null',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://keybase.io&size=64'
  },
  {
    name: 'Last.fm',
    category: 'music',
    url: 'https://www.last.fm/user/{username}',
    checkUrl: 'https://www.last.fm/user/{username}',
    expectedStatus: 200,
    missingStatus: 404,
    missingString: 'User not found',
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://last.fm&size=64'
  },
  {
    name: 'Bitbucket',
    category: 'coding',
    url: 'https://bitbucket.org/{username}',
    checkUrl: 'https://api.bitbucket.org/2.0/users/{username}',
    isApi: true,
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://bitbucket.org&size=64'
  },
  {
    name: 'Instructables',
    category: 'portfolio',
    url: 'https://www.instructables.com/member/{username}/',
    checkUrl: 'https://www.instructables.com/member/{username}/',
    expectedStatus: 200,
    missingStatus: 404,
    faviconUrl: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://instructables.com&size=64'
  }
];
