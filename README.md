# UserScope

Username reconnaissance across a directory of public platforms, with scan results streamed from the server.
**Live Application:** [userscope.space](https://userscope.space)

[![Live Demo](https://img.shields.io/badge/Live_Demo-userscope.space-10b981?style=flat-square)](https://userscope.space) [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/) [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[![UserScope Interface Preview](https://userscope.space/og.png)](https://userscope.space)

```bash
# Query public username footprints via SSE stream
curl -N "http://localhost:3000/api/search/stream?username=torvalds"
```

---

## Why UserScope?

Most username OSINT tools (Sherlock, WhatsMyName CLI, Blackbird) either:
- **Run solely in terminal shells**, making visual analysis, timeline correlation, and entity filtering tedious.
- **Buffer scans synchronously**, forcing you to wait minutes before seeing a single hit.
- **Use cloud-hosted tools** that can add services to the data path and require their own privacy review.

UserScope executes checks directly from your local instance via bounded worker pools, streaming live hits over Server-Sent Events the millisecond they are detected.

---

## Core Capabilities

- **Streaming Reconnaissance**: Checks configured public profile endpoints concurrently and streams results with SSE.
- **Defensive Safeguards**: Built-in sliding-window IP rate limiting, active scan concurrency gates, and regex-level SSRF / shell-injection rejection.
- **Multiple Analysis Views**:
  - **Masonry Grid**: Real-time platform cards grouped by service category (developer, social, gaming, finance).
  - **Relationship Graph**: Interactive force-directed canvas displaying shared identity clusters and metadata links.
  - **Presence Timeline**: Historical profile creation and account presence ordering.
- **Data Portability**: One-click full forensic report exports to JSON and formatted CSV.
- **Fast, Accessible Web UI**: Client-side reactive graphs, keyboard navigation, light/dark modes, and WCAG-compliant reduced motion support.

---

## Platform Coverage

UserScope checks public handles across its listed platform directory, including:

- **Developer & Code**: GitHub, GitLab, Bitbucket, NPM, PyPI, Docker Hub, Stack Overflow, Dev.to, Kaggle.
- **Gaming & Virtual**: Steam, Roblox, Chess.com, Minecraft, Epic Games.
- **Creative & Media**: DeviantArt, Behance, ArtStation, SoundCloud, Spotify, Flickr, 500px.
- **Identity & Social**: Keybase, Pastebin, About.me, Reddit, Telegram, Gravatar.

Browse individual platform reconnaissance methods and availability endpoints in the [Platform Directory](https://userscope.space/platforms).

---

## Architecture Flow

```mermaid
flowchart LR
    Client["Browser Client"]
    Router["Next.js Route Handler (/api/search/stream)"]
    Sec["Security Layer (Validation + Rate Limiter)"]
    Pool["Worker Concurrency Pool"]
    Targets["Configured Public Endpoints"]

    Client -->|"GET ?username=handle"| Router
    Router -->|"Sanitize & Rate Limit"| Sec
    Sec -->|"Dispatched Batch Tasks"| Pool
    Pool -->|"Concurrent HTTP Probes"| Targets
    Pool -.->|"Stream hits via SSE"| Client
```

---

## Quickstart

### Prerequisites
- Node.js 18.17+ or 20+
- npm, pnpm, or yarn

### 1. Clone & Install

```bash
git clone https://github.com/saahiyo/userscope.git
cd userscope
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start scanning handles.

### 3. Production Build

```bash
npm run build
npm run start
```

---

## API Reference

### Stream Search

`GET /api/search/stream`

Streams live OSINT discovery events using the standard `text/event-stream` protocol.

#### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | `string` | Yes | Target handle (3-30 chars, alphanumeric with `.` `_` `-`). |

#### SSE Event Payloads

```typescript
// Incoming profile hit event
{
  "type": "profile_found",
  "data": {
    "siteName": "GitHub",
    "category": "developer",
    "url": "https://github.com/torvalds",
    "exists": true,
    "responseTimeMs": 182,
    "metadata": {
      "bio": "Linus Torvalds",
      "avatar": "https://avatars.githubusercontent.com/u/1024025"
    }
  }
}
```

---

## Security & Ethics

UserScope queries publicly accessible endpoints and does not bypass authentication or break access control boundaries.
- **Rate Limiting**: Default ceiling of 10 requests/minute per client IP with a cap of 2 concurrent scans.
- **Input Sanitization**: Rejects reserved protocol tokens, internal localhost pointers, and special characters before network execution.

Use responsibly in accordance with local regulations and terms of service of queried platforms.

---

## License

MIT
