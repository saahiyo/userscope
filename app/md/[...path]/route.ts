import { createDualmarkRouteHandler } from '@dualmark/nextjs';
import { getAllPlatforms } from '@/lib/osint/platformDirectory';

const handler = createDualmarkRouteHandler({
  siteUrl: 'https://userscope.space',
  staticPages: [
    {
      pattern: '/',
      render: () => `# UserScope — Public Footprint Reconnaissance

> Real-time open-source intelligence (OSINT) reconnaissance tool. Search public usernames, accounts, and digital footprints across 700+ platforms with zero paywalls.

**Live Application**: [https://userscope.space](https://userscope.space)  
**Source Code**: [https://github.com/saahiyo/userscope](https://github.com/saahiyo/userscope)  
**License**: MIT  

---

## Overview

UserScope allows security researchers, penetration testers, and developers to determine where a specific handle or alias exists across 700+ public online platforms simultaneously in real time.

Unlike traditional OSINT tools that run solely in terminal shells or gate search results behind credit subscriptions, UserScope provides:
- **Instant Browser Streaming**: Live Server-Sent Events (SSE) push verified account hits directly to your active browser session with millisecond latencies.
- **Client-Side Privacy**: Zero query tracking, zero search history storage, and zero telemetry leakage. Every probe queries public platform endpoints directly.
- **Broad Coverage**: Over 700 monitored registries across code repositories, social networks, gaming ecosystems, media communities, and financial platforms.
- **Forensic Export**: One-click export to standardized JSON and CSV formats for threat intelligence reports and identity investigations.

---

## Key Capabilities

1. **High-Velocity Parallel Probes**: Dispatches concurrent, asynchronous workers against public profile APIs. Most full-spectrum scans complete in under 20 seconds.
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
UserScope is an open-source intelligence (OSINT) reconnaissance platform that discovers public digital footprints across 700+ websites in real time.

### How does the real-time scan work?
When an investigation starts, UserScope dispatches concurrent, asynchronous HTTP workers against public platform profile endpoints. Confirmed hits are pushed immediately over an active SSE stream.

### Is querying public usernames legal?
Yes. UserScope exclusively performs passive, unauthenticated queries against public profile URLs that are open to the internet. It never accesses private communications, breaks authentication, or bypasses access controls.

### Does UserScope store search history?
No. UserScope maintains zero search logs and zero query databases. Investigations remain completely private to your local session.
`,
    },
    {
      pattern: '/platforms',
      render: () => `# UserScope Platform Directory (650+ Public Registries)

Explore the full catalog of public online registries, developer platforms, and social ecosystems monitored by UserScope.

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
