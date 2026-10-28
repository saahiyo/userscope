import { markdownResponse } from '@dualmark/core';
import { PLATFORM_COUNT, SCAN_RULE_COUNT } from '@/lib/osint/platformDirectory';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# UserScope — Username Search Across Public Platforms

> Search usernames across ${PLATFORM_COUNT} listed public platforms. Full scans process ${SCAN_RULE_COUNT} endpoint rules and stream results to your browser.

**Live Application**: [https://userscope.space](https://userscope.space)  
**Source Code**: [https://github.com/saahiyo/userscope](https://github.com/saahiyo/userscope)  
**License**: MIT  

---

## Overview

UserScope helps security researchers, developers, and account owners check public username presence across the listed platform directory.

Unlike traditional OSINT tools that run solely in terminal shells or gate search results behind credit subscriptions, UserScope provides:
- **Live Results**: Server-Sent Events (SSE) stream scan results to your browser as checks complete.
- **Server-Processed Checks**: Searches are sent to UserScope's server, which queries public profile endpoints.
- **Broad Coverage**: The directory groups public profiles across code repositories, social networks, gaming ecosystems, media communities, and financial platforms.
- **Forensic Export**: One-click export to standardized JSON and CSV formats for threat intelligence reports and identity investigations.

---

## Key Capabilities

1. **Concurrent Checks**: Dispatches workers against configured public endpoints and streams results as checks complete.
2. **Defensive Safeguards**: Built-in sliding-window IP rate limiting, active scan concurrency gates, and regex-level SSRF / shell-injection rejection.
3. **Multimodal Analysis Views**:
   - **Masonry Grid**: Real-time platform cards grouped by service category with status badges and response latency.
   - **Relationship Graph**: Interactive force-directed canvas displaying shared identity clusters and metadata links.
   - **Presence Timeline**: Historical account presence and registry correlation.

---

## API & Programmatic Usage

UserScope exposes a public streaming endpoint for automated workflows:

\`\`\`bash
# Stream real-time profile hits for a target handle
curl -N "https://userscope.space/api/search/stream?username=torvalds"
\`\`\`

### Response Format
The endpoint streams Server-Sent Events (SSE) chunks formatted as JSON:
\`\`\`json
{
  "type": "hit",
  "profile": {
    "platform": "GitHub",
    "category": "developer",
    "username": "torvalds",
    "profileUrl": "https://github.com/torvalds",
    "verified": true,
    "latency": 120
  }
}
\`\`\`

---

## Platform Categories

UserScope monitors platforms across 6 main ecosystems:
- **Developer & Code**: GitHub, GitLab, Docker Hub, npm, PyPI, Bitbucket, Stack Overflow, Replit, Kaggle, LeetCode, HackerRank.
- **Social & Identity**: X (Twitter), Reddit, Mastodon, Bluesky, Threads, Telegram, Discord, Pinterest, Tumblr.
- **Gaming & Virtual**: Steam, Chess.com, Roblox, Epic Games, Twitch, Xbox, PlayStation Network.
- **Media & Creative**: DeviantArt, Patreon, SoundCloud, Spotify, Medium, Behance, Dribbble, Substack, Vimeo.
- **Finance & Business**: ProductHunt, AngelList, BuyMeACoffee, Keybase.
- **Global Services**: Wikipedia, Gravatar, Linktree, Pastebin, About.me.

---

## Frequently Asked Questions

### What is UserScope?
UserScope is an open-source intelligence (OSINT) reconnaissance platform that checks public username presence across ${PLATFORM_COUNT} listed platforms.

### How does the real-time scan work?
When an investigation starts, UserScope dispatches concurrent, asynchronous HTTP workers against public platform profile endpoints. Confirmed hits are pushed immediately over an active SSE stream.

### Is querying public usernames legal?
UserScope checks public profile endpoints without logging in to target accounts or accessing private communications. Use the tool only where permitted by applicable law and platform terms.

### How are searched usernames handled?
Searches are sent to UserScope's server for processing and streamed back to your browser. The app does not provide saved search history; infrastructure log retention depends on the service operator.
`;

  return markdownResponse(content, {
    cacheControl: 'public, max-age=3600',
    noindex: true,
  });
}
