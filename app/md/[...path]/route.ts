import { createDualmarkRouteHandler } from '@dualmark/nextjs';
import { getAllPlatforms, PLATFORM_COUNT, SCAN_RULE_COUNT } from '@/lib/osint/platformDirectory';

const handler = createDualmarkRouteHandler({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space',
  staticPages: [
    {
      pattern: '/',
      render: () => `# UserScope — Username Search Across Public Platforms

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
`,
    },
    {
      pattern: '/platforms',
      render: () => `# UserScope Platform Directory (${PLATFORM_COUNT} Public Platforms)

Explore the catalog of public online registries, developer platforms, and social ecosystems supported by UserScope.

## Monitored Categories
- **Developer & Code**: Code repositories, package registries, bug trackers, and developer communities.
- **Social & Identity**: Social networking platforms, messaging networks, forums, and identity registries.
- **Gaming & Virtual**: Gaming ecosystems, competitive platforms, leaderboards, and game mod hubs.
- **Media & Creative**: Video networks, music streaming, design portfolios, and creative communities.
- **Finance & Business**: Financial communities, freelance markets, creator tipping, and crypto networks.
- **Global Services & Community**: Knowledge bases, shopping platforms, blogs, public archives, and international services.

Search the live platform catalog at [https://userscope.space/platforms](https://userscope.space/platforms).
`,
    },
  ],
  collections: {
    platforms: {
      converter: 'feature',
      getEntries: () => {
        const platforms = getAllPlatforms();
        return platforms.map((p) => ({
          id: p.slug,
          data: {
            title: `${p.name} Username Search & Reconnaissance`,
            description: `Check if a username or handle exists on ${p.name} (${p.category}).`,
          },
          body: `## ${p.name}\n\n- **Category**: ${p.category}\n- **Pattern**: ${p.urlPattern}\n- **Domain**: ${p.domain}\n- **Verification Method**: ${p.checkType}\n\nVerify whether any alias or handle exists on ${p.name} using UserScope's real-time streaming scanner.`,
        }));
      },
    },
  },
});

export const GET = handler.GET;
export const generateStaticParams = handler.generateStaticParams;
export const dynamic = 'force-static';
