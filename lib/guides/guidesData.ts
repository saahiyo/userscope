export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideTableOfContentsItem {
  id: string;
  title: string;
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  category: 'OSINT' | 'Security' | 'Privacy' | 'Tutorial';
  readingTime: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
  };
  tags: string[];
  tableOfContents: GuideTableOfContentsItem[];
  faqs: GuideFaq[];
  content: string; // Markdown or rich structured text
}

export const GUIDES: Guide[] = [
  {
    slug: 'check-username-availability-across-platforms',
    title: 'How to Check Username Availability Across 650+ Platforms in Real Time',
    metaTitle: 'How to Check Username Availability Across 650+ Platforms | UserScope Guide',
    description: 'Learn how to claim, verify, and monitor digital handles across developer ecosystems, social networks, and gaming platforms without getting blocked.',
    category: 'Tutorial',
    readingTime: '6 min read',
    publishedAt: '2026-11-01',
    updatedAt: '2026-11-10',
    author: {
      name: 'UserScope Security Research Team',
      role: 'OSINT & Threat Intelligence Lab',
    },
    tags: ['Username Availability', 'Brand Protection', 'OSINT', 'Handle Claiming', 'Footprint Audit'],
    tableOfContents: [
      { id: 'why-handle-consistency-matters', title: 'Why Consistent Handles Matter for Identity & Branding' },
      { id: 'manual-vs-automated-enumeration', title: 'Manual Search vs. Automated Multi-Threaded Scanning' },
      { id: 'how-availability-checks-work', title: 'How Multi-Platform Availability Checks Work Under the Hood' },
      { id: 'key-ecosystems-to-secure', title: 'The 6 Core Platform Ecosystems to Audit' },
      { id: 'step-by-step-guide', title: 'Step-by-Step: Conducting a Real-Time Scan with UserScope' },
      { id: 'what-to-do-when-taken', title: 'What to Do When Your Desired Username Is Already Taken' },
      { id: 'faqs', title: 'Frequently Asked Questions' },
    ],
    faqs: [
      {
        question: 'Why should I register my handle on platforms I do not actively use?',
        answer: 'Registering your personal or brand handle proactively prevents brand impersonation, squatting, and phishing attacks before malicious actors can claim your identity.',
      },
      {
        question: 'How fast can UserScope check username availability across 650+ services?',
        answer: 'UserScope executes asynchronous, multi-threaded HTTP checks streamed in real-time over Server-Sent Events (SSE), delivering verified hits to your browser in under 15 seconds.',
      },
      {
        question: 'Do platforms ban or rate-limit automated username availability checks?',
        answer: 'Directly querying hundreds of services from your local browser IP can trigger Cloudflare blocks and rate limits. UserScope resolves checks server-side with strict concurrency limits and headers to avoid false flags.',
      },
      {
        question: 'Can I reclaim an inactive username that someone else registered years ago?',
        answer: 'Many platforms (such as X, GitHub, and Instagram) have inactive account policies or trademark dispute mechanisms. If you hold a registered trademark or the account has zero activity, you can submit an official dispute.',
      },
    ],
    content: `
### Why Consistent Handles Matter for Identity & Branding {#why-handle-consistency-matters}

When launching a new software product, open-source project, or personal brand, claiming a consistent handle across developer registries, social media, and communication networks is foundational.

A unified handle delivers three distinct advantages:
1. **Brand Protection & Anti-Impersonation**: Prevents scammers and competitors from squatting your name or launching phishing attacks using your exact alias on platforms you neglected.
2. **Discoverability & Cross-Platform SEO**: Search engines like Google and Bing index public profiles. When your handle is identical across GitHub, Twitter/X, Reddit, and npm, search engines connect the entities into a coherent knowledge graph.
3. **Frictionless Trust**: Users instinctively recognize and trust creators whose username remains uniform across Discord, Telegram, YouTube, and package registries.

---

### Manual Search vs. Automated Multi-Threaded Scanning {#manual-vs-automated-enumeration}

Historically, verifying username availability meant manually opening 50 different browser tabs, navigating to each sign-up form, and typing in your handle. This approach is slow, error-prone, and misses hundreds of international or niche developer platforms.

| Method | Speed | Platform Coverage | Accuracy & Traps |
| :--- | :--- | :--- | :--- |
| **Manual Browser Tabs** | 15–30 minutes | 10–20 popular sites | Prone to false positives caused by session cookies or 302 redirects |
| **Traditional CLI Scripts** | 1–3 minutes | 200–400 platforms | Requires Python, CLI terminal, and risks local IP rate-limiting |
| **UserScope Live Stream** | **Under 15 seconds** | **650+ platforms** | Real-time Server-Sent Events (SSE), zero install, server-buffered |

---

### How Multi-Platform Availability Checks Work Under the Hood {#how-availability-checks-work}

Automated reconnaissance platforms query public profile endpoints using three primary verification methods:

1. **HTTP Status Code Verification**: The engine requests \`https://target.com/user/{account}\`. If the server responds with \`404 Not Found\`, the handle is typically unclaimed. If it responds with \`200 OK\`, the profile exists.
2. **DOM String & Response Matching**: Many modern Single Page Applications (SPAs) return a \`200 OK\` shell regardless of whether the profile exists, displaying an in-app error like *"This user does not exist"*. The scanner checks for platform-specific response markers (e.g. \`m_string\` or \`e_string\`).
3. **Internal API Verification**: Some platforms (like TikTok, Chess.com, or LeetCode) provide public JSON GraphQL or REST APIs that return structured fields like \`{"isAvailable": true}\`.

---

### The 6 Core Platform Ecosystems to Audit {#key-ecosystems-to-secure}

When conducting an availability audit, categorize platforms into strategic ecosystems:

* **Developer & Code**: [GitHub](/platforms/github), [GitLab](/platforms/gitlab), [Docker Hub](/platforms/docker-hub), [npm](/platforms/npm), [PyPI](/platforms/pypi), [Bitbucket](/platforms/bitbucket).
* **Social & Identity**: [X (Twitter)](/platforms/x), [Reddit](/platforms/reddit), [Bluesky](/platforms/bluesky), [Threads](/platforms/threads), [Mastodon](/platforms/mastodon), [Telegram](/platforms/telegram).
* **Gaming & Virtual**: [Steam](/platforms/steam), [Twitch](/platforms/twitch), [Roblox](/platforms/roblox), [Chess.com](/platforms/chess-com), [Discord](/platforms/discord).
* **Media & Creative**: [DeviantArt](/platforms/deviantart), [Behance](/platforms/behance), [Medium](/platforms/medium), [Substack](/platforms/substack), [Vimeo](/platforms/vimeo).
* **Finance & Business**: [ProductHunt](/platforms/producthunt), [AngelList](/platforms/angellist), [BuyMeACoffee](/platforms/buymeacoffee), [Keybase](/platforms/keybase).
* **Global Communities**: [About.me](/platforms/about-me), [Linktree](/platforms/linktree), [Pastebin](/platforms/pastebin), [Gravatar](/platforms/gravatar).

---

### Step-by-Step: Conducting a Real-Time Scan with UserScope {#step-by-step-guide}

1. Navigate to the [UserScope Homepage](/) or use the search widget below.
2. Enter your desired handle or brand alias (e.g., \`quantum-dev\` or \`secops\`).
3. Press **Enter** or click **Scan**.
4. Watch the real-time stream: UserScope asynchronously queries over 650 public endpoints, immediately separating **Found Accounts** from **Available / Unclaimed Handles**.
5. Switch between **Masonry Grid**, **Relationship Graph**, and **Timeline** views to analyze existing digital footprints.
6. Export the complete report in **JSON** or **CSV** for your records.

---

### What to Do When Your Desired Username Is Already Taken {#what-to-do-when-taken}

If your primary handle is already occupied on key networks, use these proven defensive strategies:
* **Prefix / Suffix Standardization**: Use consistent modifiers like \`get[name]\`, \`[name]app\`, \`[name]dev\`, or \`[name]hq\` across all platforms where the root handle is taken.
* **Inspect Account Activity**: Many accounts were registered a decade ago and abandoned. Check if the profile has zero public activity.
* **Trademark & Legal Reclamation**: If you possess a registered trademark for your business name, platforms like GitHub, X, and Meta have formal trademark infringement intake forms where inactive handles can be transferred.
`,
  },
  {
    slug: 'what-is-username-enumeration',
    title: 'What is Username Enumeration? Mechanics, Defense, and OSINT Techniques',
    metaTitle: 'What is Username Enumeration? Security Guide & OSINT Techniques | UserScope',
    description: 'A deep dive into username enumeration: how security analysts and attackers discover registered accounts via status codes, timing leaks, and API responses.',
    category: 'Security',
    readingTime: '7 min read',
    publishedAt: '2026-11-02',
    updatedAt: '2026-11-10',
    author: {
      name: 'UserScope Security Research Team',
      role: 'OSINT & Threat Intelligence Lab',
    },
    tags: ['Username Enumeration', 'AppSec', 'Penetration Testing', 'OWASP', 'Reconnaissance'],
    tableOfContents: [
      { id: 'definition-and-mechanics', title: 'What is Username Enumeration?' },
      { id: 'common-attack-vectors', title: 'The Primary Enumeration Vectors' },
      { id: 'timing-attacks-explained', title: 'Timing Attacks & Cryptographic Discrepancies' },
      { id: 'defense-and-mitigation', title: 'How Platforms Defend Against Enumeration (OWASP Guidelines)' },
      { id: 'enumeration-in-osint', title: 'Ethical Enumeration in OSINT and Bug Bounty Recon' },
      { id: 'faqs', title: 'Frequently Asked Questions' },
    ],
    faqs: [
      {
        question: 'Is username enumeration considered a vulnerability by OWASP?',
        answer: 'Yes. Username enumeration on private login/reset forms violates OWASP authentication guidelines (CWE-204 / CWE-200), as it allows attackers to compile valid target lists for credential stuffing.',
      },
      {
        question: 'What is the difference between public OSINT enumeration and private login enumeration?',
        answer: 'Public OSINT enumeration checks whether an account exists publicly on a social network (like browsing to a user profile). Private login enumeration probes authentication forms (like password reset) to discover whether an email address is registered.',
      },
      {
        question: 'How do websites prevent timing attacks during username verification?',
        answer: 'Websites prevent timing attacks by performing constant-time password hashing dummy computations even when a username does not exist, ensuring response latency remains identical in both cases.',
      },
    ],
    content: `
### What is Username Enumeration? {#definition-and-mechanics}

**Username Enumeration** is a reconnaissance technique where an observer probes an application to determine whether a specific user identifier, alias, or email address exists in the system's database.

In cybersecurity, enumeration is classified under **CWE-204 (Observable Response Discrepancy)** and **CWE-200 (Exposure of Sensitive Information)**. When an application behaves differently for existing accounts versus non-existent accounts, an external actor can systematically map valid user identities.

---

### The Primary Enumeration Vectors {#common-attack-vectors}

Enumeration generally manifests across four interfaces:

1. **Password Reset Interfaces**: Entering an invalid email displays *"No account found with this email"*, while a valid email shows *"A recovery link has been sent"*.
2. **Registration Forms**: Typing a username into a sign-up field triggers an asynchronous inline validation request (e.g. \`GET /api/check-username?u=admin\`) returning \`{"taken": true}\`.
3. **Login Form Error Messages**: Distinguishing between *"Invalid password"* and *"User does not exist"*.
4. **Public Profile Routing**: Accessing \`/user/{handle}\` returning HTTP \`200 OK\` with metadata versus HTTP \`404 Not Found\` or \`302 Found\`.

---

### Timing Attacks & Cryptographic Discrepancies {#timing-attacks-explained}

Even when an application returns identical error messages (e.g. *"Invalid credentials"*), subtle server-side execution delays can leak account existence:

\`\`\`
Client Request -> Server Check
  1. Lookup username in DB
  2. If found -> Execute bcrypt.compare(password, hash)  [Takes ~250ms]
  3. If not found -> Return generic error immediately    [Takes ~10ms]
\`\`\`

Because cryptographic hashing algorithms like **bcrypt**, **Argon2**, and **PBKDF2** are computationally intensive, a request for an existing user takes significantly longer to resolve than one for a nonexistent user. Attackers measuring sub-millisecond network latency can reliably infer account presence without ever knowing the password.

---

### How Platforms Defend Against Enumeration (OWASP Guidelines) {#defense-and-mitigation}

To conform with OWASP Application Security Standards, production systems implement the following mitigations:

* **Generic Authentication Messages**: Standardize all responses to *"If an account matches those details, instructions have been sent"* or *"Incorrect username or password"*.
* **Constant-Time Execution (Dummy Hashing)**: If a username lookup fails, compute a dummy hash calculation with equal cost factors to eliminate response time variance.
* **Aggressive Rate-Limiting**: Enforce IP and session token bucket limits on authentication and password reset endpoints.
* **CAPTCHAs and Proof-of-Work**: Gate repetitive identifier lookups behind Cloudflare Turnstile or similar challenges.

---

### Ethical Enumeration in OSINT and Bug Bounty Recon {#enumeration-in-osint}

In Open Source Intelligence (OSINT), public profile enumeration is a standard passive reconnaissance methodology. Because social networks, code repositories, and public forums intentionally design profile endpoints to be discoverable, querying these endpoints allows security researchers to:
* Map an organization's employee exposure across public coding communities.
* Identify leaked developer accounts on package registries ([npm](/platforms/npm), [PyPI](/platforms/pypi), [Docker Hub](/platforms/docker-hub)).
* Verify suspect handles in digital fraud and threat intelligence investigations.

UserScope facilitates this ethical workflow by organizing checks strictly against public, non-authenticated endpoints without attempting password validation or intrusive probing.
`,
  },
  {
    slug: 'find-social-media-profiles-by-username',
    title: "How to Find Someone's Public Social Media Footprint by Username",
    metaTitle: "Find Social Media Profiles by Username | OSINT Methodology Guide",
    description: "A practical guide to tracing public aliases across social networks, code repositories, forums, and creator platforms using ethical OSINT techniques.",
    category: 'OSINT',
    readingTime: '8 min read',
    publishedAt: '2026-11-03',
    updatedAt: '2026-11-10',
    author: {
      name: 'UserScope Security Research Team',
      role: 'OSINT & Threat Intelligence Lab',
    },
    tags: ['Social Media OSINT', 'Digital Footprint', 'Handle Investigation', 'People Search', 'Ethics'],
    tableOfContents: [
      { id: 'psychology-of-handle-reuse', title: 'The Psychology of Handle Reuse Across the Internet' },
      { id: 'the-osint-pivot-method', title: 'The OSINT Pivot Method: Connecting the Dots' },
      { id: 'analyzing-cross-platform-evidence', title: 'Analyzing Cross-Platform Forensic Evidence' },
      { id: 'avoiding-false-positives', title: 'Filtering Collisions and False Positives' },
      { id: 'visualizing-identity-graphs', title: 'Mapping Clusters with UserScope Relationship Graphs' },
      { id: 'legal-and-ethical-boundaries', title: 'Legal & Ethical Boundaries of OSINT Investigations' },
      { id: 'faqs', title: 'Frequently Asked Questions' },
    ],
    faqs: [
      {
        question: 'Is it legal to search someone’s public social media profiles using OSINT tools?',
        answer: 'Yes, searching publicly available profile pages and endpoints that require no credentials or bypassing of access controls is legal in most jurisdictions. However, the data must only be used in compliance with privacy laws and platform terms.',
      },
      {
        question: 'How do you know if two accounts with the same username belong to the same person?',
        answer: 'Analysts look for corroborating evidence: matching profile photos, shared bio wording, mutual following lists, identical PGP keys, matching location tags, and correlated account creation dates.',
      },
      {
        question: 'What should I do if a target username is very common, like "alex" or "john"?',
        answer: 'For common names, searching the raw alias alone produces too many collisions. Focus on unique handle variations, combined email patterns, or pivot from a known commit author email or unique avatar hash.',
      },
    ],
    content: `
### The Psychology of Handle Reuse Across the Internet {#psychology-of-handle-reuse}

Human memory and digital habits lead the vast majority of Internet users to reuse a small set of preferred handles across multiple online services. A handle chosen for gaming at age 14 often persists into college forums, open-source repositories, and developer registries.

In Open Source Intelligence (OSINT), this behavioral pattern is known as **Handle Correlation**. By starting with a single known username, an analyst can frequently uncover an expansive web of public presence spanning:
* Developer accounts with exposed commit email addresses.
* Discussion forums containing geographic clues or hobby interests.
* Media profiles showcasing voice, video, or creative portfolios.

---

### The OSINT Pivot Method: Connecting the Dots {#the-osint-pivot-method}

Reconnaissance is rarely linear. It relies on the **Pivot Method**, where each discovered artifact leads to new queries:

\`\`\`
Target Handle: 'cyber_phoenix'
   │
   ├─► GitHub Profile Found
   │     └─► Commit History reveals email: 'cphoenix99@proton.me'
   │
   ├─► Steam Profile Found
   │     └─► Avatar image matches avatar on Reddit account
   │
   └─► Keybase Profile Found
         └─► PGP Fingerprint links to verified Mastodon domain
\`\`\`

---

### Analyzing Cross-Platform Forensic Evidence {#analyzing-cross-platform-evidence}

When examining search results across platforms, look for these key correlation points:

1. **Avatar Reverse-Hashing**: Download the profile photo and compute an MD5/pHash or run a reverse image search. Users often set the identical avatar across multiple services.
2. **Bio Phrasing & Unique Vocabulary**: Search exact phrases from bios in quotation marks (e.g., \`"Rust enthusiast, amateur astrophotographer"\`).
3. **Temporal Correlation**: Check account creation timestamps. If accounts across Reddit, GitHub, and Discord were all created in the summer of 2021, the likelihood of a single owner increases dramatically.
4. **Follower / Following Overlap**: Compare mutual connections between suspected profiles.

---

### Filtering Collisions and False Positives {#avoiding-false-positives}

Not every hit is the person you are investigating. Account name collisions happen frequently, especially with:
* Short handles (under 5 characters).
* Dictionary words, popular movie characters, or memes.
* Common first names.

To eliminate noise, establish a **Confidence Scoring Rubric**:
* **High Confidence (90%+ )**: Shared avatar image, verified PGP identity, or explicit cross-linking in the profile bio.
* **Medium Confidence (60–80%)**: Similar location, shared technical interests, and matching registration timeline.
* **Low / Unverified (<40%)**: Isolated account with default avatar and zero posted content.

---

### Mapping Clusters with UserScope Relationship Graphs {#visualizing-identity-graphs}

UserScope features an interactive **Force-Directed Relationship Graph** that automatically clusters found profiles into visual categories (Developer, Social, Gaming, Finance).

By viewing profile hits as interconnected nodes, researchers can instantly spot:
* Isolated outliers (potential collisions).
* Densely connected hubs where multiple developer or social profiles reinforce each other.
* Quick links to verify each target in a dedicated browser tab.

---

### Legal & Ethical Boundaries of OSINT Investigations {#legal-and-ethical-boundaries}

Responsible reconnaissance adheres to strict boundaries:
* **No Authentication Bypassing**: Never attempt password cracking, credential spraying, or session hijacking.
* **Respect Privacy Directives**: Honor platform terms of service and avoid scraping private, friends-only, or paywalled data.
* **Anti-Doxxing Principles**: Conduct OSINT strictly for defensive auditing, fraud prevention, academic research, or authorized penetration tests.
`,
  },
  {
    slug: 'what-is-osint-guide',
    title: 'What is OSINT? The Definitive Guide to Open Source Intelligence in 2026',
    metaTitle: 'What is OSINT? The Definitive Guide to Open Source Intelligence | UserScope',
    description: 'A comprehensive primer on Open Source Intelligence (OSINT): the intelligence cycle, passive vs active reconnaissance, tools, and ethical frameworks.',
    category: 'OSINT',
    readingTime: '9 min read',
    publishedAt: '2026-11-04',
    updatedAt: '2026-11-10',
    author: {
      name: 'UserScope Security Research Team',
      role: 'OSINT & Threat Intelligence Lab',
    },
    tags: ['OSINT Guide', 'Intelligence Cycle', 'Cybersecurity', 'Reconnaissance', 'E-E-A-T'],
    tableOfContents: [
      { id: 'what-is-osint-definition', title: 'What is OSINT? Definition and Core Principles' },
      { id: 'the-osint-cycle', title: 'The 5 Stages of the Intelligence Cycle' },
      { id: 'passive-vs-active-recon', title: 'Passive vs. Active Reconnaissance Explained' },
      { id: 'core-domains-of-osint', title: 'The Core Disciplines of Modern OSINT' },
      { id: 'tools-and-frameworks', title: 'Essential OSINT Tooling Architecture' },
      { id: 'legal-and-privacy-standards', title: 'Legal & Privacy Frameworks (GDPR & Ethics)' },
      { id: 'faqs', title: 'Frequently Asked Questions' },
    ],
    faqs: [
      {
        question: 'Who uses OSINT in the real world?',
        answer: 'OSINT is utilized by cybersecurity red/blue teams, investigative journalists, law enforcement agencies, fraud prevention specialists, and corporate risk auditors.',
      },
      {
        question: 'Is OSINT the same as hacking?',
        answer: 'No. OSINT relies exclusively on publicly accessible data that is openly shared or published. It does not exploit vulnerabilities, breach networks, or steal credentials.',
      },
      {
        question: 'What is the most common mistake made by beginner OSINT researchers?',
        answer: 'The most common mistake is failing to verify sources and suffering from confirmation bias—assuming two matching handles belong to the same person without secondary proof.',
      },
    ],
    content: `
### What is OSINT? Definition and Core Principles {#what-is-osint-definition}

**Open Source Intelligence (OSINT)** is the discipline of gathering, analyzing, and synthesizing publicly available information into actionable intelligence.

Originally developed within military and geopolitical intelligence agencies, OSINT is now a vital pillar of modern cybersecurity, threat modeling, digital forensics, and investigative journalism.

The defining characteristic of OSINT is **accessibility**: the data can be legally obtained through public broadcasts, search engines, public government registries, academic databases, and social media platforms without requiring clandestine operations or unauthorized access.

---

### The 5 Stages of the Intelligence Cycle {#the-osint-cycle}

Professional analysts do not collect data randomly. They follow the structured **Intelligence Cycle**:

1. **Planning & Direction**: Establish clear requirements. What specific questions must be answered? What are the boundaries and rules of engagement?
2. **Collection**: Gathering raw data from public sources (social networks, WHOIS records, public Git repos, certificate transparency logs).
3. **Processing**: Normalizing, cleaning, and structuring unstructured data (e.g. converting raw HTML into standardized JSON records).
4. **Analysis & Production**: Correlating data points, evaluating credibility, eliminating false positives, and connecting identity dots.
5. **Dissemination**: Packaging findings into clear reports, threat advisories, or executive dashboards.

---

### Passive vs. Active Reconnaissance Explained {#passive-vs-active-recon}

| Feature | Passive Reconnaissance | Active Reconnaissance |
| :--- | :--- | :--- |
| **Direct Target Interaction** | None (queries cached/third-party data) | Direct (queries target infrastructure) |
| **Detection Risk** | Zero (invisible to target) | High (logged in server access/firewall logs) |
| **Examples** | Looking up DNS history, checking archives, querying search engines | Port scanning (Nmap), web directory fuzzing, banner grabbing |
| **UserScope Approach** | Queries public profile web endpoints with strict headers and passive observation | N/A (UserScope does not perform network fuzzing or port scanning) |

---

### The Core Disciplines of Modern OSINT {#core-domains-of-osint}

* **People & Identity Reconnaissance**: Handle tracking, username verification, avatar correlation, and public registry lookups across platforms like [GitHub](/platforms/github) and [Reddit](/platforms/reddit).
* **Network & Domain OSINT**: Subdomain enumeration, DNS records, SSL/TLS certificate transparency logs, and IP ownership records.
* **Geospatial Intelligence (GEOINT)**: Pinpointing locations from photographs, shadows, building architectural patterns, and EXIF metadata.
* **Code & Secret OSINT**: Hunting for hardcoded API keys, exposed database credentials, and internal company architecture in public repositories.
`,
  },
  {
    slug: 'top-osint-tools-for-reconnaissance',
    title: 'Top OSINT Tools for Security Researchers & Penetration Testers in 2026',
    metaTitle: 'Top OSINT Tools for Security Researchers in 2026 | UserScope Guide',
    description: 'An authoritative comparison of the best open-source intelligence tools for username search, domain reconnaissance, metadata analysis, and threat mapping.',
    category: 'Security',
    readingTime: '8 min read',
    publishedAt: '2026-11-05',
    updatedAt: '2026-11-10',
    author: {
      name: 'UserScope Security Research Team',
      role: 'OSINT & Threat Intelligence Lab',
    },
    tags: ['OSINT Tools', 'Sherlock', 'Spiderfoot', 'Maltego', 'Tool Comparison', 'AppSec'],
    tableOfContents: [
      { id: 'the-evolution-of-osint-tools', title: 'The Evolution of OSINT Tooling: CLI to Real-Time Streaming' },
      { id: 'best-username-recon-tools', title: 'Best Username & Handle Reconnaissance Tools' },
      { id: 'best-domain-network-tools', title: 'Best Domain, DNS & Network Intelligence Tools' },
      { id: 'best-metadata-forensic-tools', title: 'Best Metadata & File Extraction Tools' },
      { id: 'best-visualization-graph-tools', title: 'Best Intelligence Graphing & Visualization Platforms' },
      { id: 'how-to-choose-the-right-tool', title: 'How to Choose the Right Tool for Your Workflow' },
      { id: 'faqs', title: 'Frequently Asked Questions' },
    ],
    faqs: [
      {
        question: 'How does UserScope compare to CLI tools like Sherlock or Maigret?',
        answer: 'While Sherlock and Maigret require local Python environments and run sequential CLI checks from your personal IP address, UserScope provides an instant browser-based interface, real-time Server-Sent Events streaming, force-directed graph visualization, and 650+ verified platform checks with zero installation.',
      },
      {
        question: 'Are open-source OSINT tools free to use commercially?',
        answer: 'Most leading OSINT tools (including UserScope, Sherlock, and ExifTool) are published under permissive licenses like MIT or GPL, permitting both personal research and commercial security audits.',
      },
    ],
    content: `
### The Evolution of OSINT Tooling: CLI to Real-Time Streaming {#the-evolution-of-osint-tools}

For years, intelligence analysts and penetration testers relied on Python CLI scripts. While powerful, local CLI tools introduce real-world pain points:
* Dependency conflicts and broken pip packages.
* Frequent rate-limiting from target services due to requests originating from a single home IP.
* Raw terminal text that requires manual formatting into client deliverables.

Modern OSINT platforms have transitioned to **browser-native, real-time streaming architectures**, combining high-performance server-side workers with visual exploration canvases.

---

### Best Username & Handle Reconnaissance Tools {#best-username-recon-tools}

#### 1. UserScope
* **Type**: Web-based Real-time Streaming Scanner.
* **Platform Coverage**: 650+ platforms across Developer, Social, Gaming, Media, and Finance.
* **Strengths**: Zero installation, sub-15s scans via Server-Sent Events, interactive force graph, timeline reconstruction, and forensic CSV/JSON export.
* **Best For**: Fast, clean, visual intelligence investigations and handle availability audits.

#### 2. Sherlock Project
* **Type**: Open-source Python CLI.
* **Platform Coverage**: ~350 platforms.
* **Strengths**: Robust community-maintained JSON signature file, command-line automation friendly.
* **Trade-off**: Requires Python installation, CLI terminal, and can suffer from Cloudflare IP blocks on home networks.

#### 3. Maigret
* **Type**: Advanced Python CLI with recursive parsing.
* **Platform Coverage**: ~3,000 sites.
* **Strengths**: Extracts detailed profile metadata (UIDs, bios, avatars, joined dates) where supported.
* **Trade-off**: Longer scan durations and higher rate of false positives on niche sites.

---

### Best Domain, DNS & Network Intelligence Tools {#best-domain-network-tools}

* **Amass (OWASP)**: In-depth attack surface mapping and external asset discovery using active and passive data sources.
* **Sublist3r**: Classic fast subdomain enumeration tool utilizing search engines and Netcraft.
* **crt.sh**: Web interface to the Certificate Transparency log cluster, uncovering new subdomains as soon as an SSL cert is issued.

---

### Best Metadata & File Extraction Tools {#best-metadata-forensic-tools}

* **ExifTool**: The gold standard for reading, writing, and editing image and document EXIF metadata (camera models, GPS coordinates, timestamps).
* **FOCA (Fingerprinting Organizations with Collected Archives)**: Automated document download and metadata analysis tool for corporate footprints.

---

### Best Intelligence Graphing & Visualization Platforms {#best-visualization-graph-tools}

* **Maltego**: Enterprise-grade entity link analysis and graph exploration software.
* **UserScope Relationship Graph**: Built-in 2D force-directed canvas that automatically clusters identities and highlights cross-platform links directly in the browser.
`,
  },
  {
    slug: 'protect-digital-identity-footprint',
    title: 'How to Protect Your Digital Footprint & Audit Your Online Presence',
    metaTitle: 'How to Protect Your Digital Footprint | Practical Privacy Guide',
    description: 'A practical, step-by-step guide to discovering forgotten accounts, removing legacy profiles, and minimizing your attack surface against identity theft.',
    category: 'Privacy',
    readingTime: '7 min read',
    publishedAt: '2026-11-06',
    updatedAt: '2026-11-10',
    author: {
      name: 'UserScope Security Research Team',
      role: 'OSINT & Threat Intelligence Lab',
    },
    tags: ['Privacy Guide', 'Digital Hygiene', 'Account Deletion', 'OpSec', 'Data Privacy'],
    tableOfContents: [
      { id: 'understanding-your-digital-footprint', title: 'Understanding Your Digital Footprint and the Threat Model' },
      { id: 'conducting-a-self-audit', title: 'Step 1: Conducting a Rigorous Self-Audit' },
      { id: 'high-risk-leak-vectors', title: 'Common High-Risk Data Leak Vectors' },
      { id: 'step-by-step-delisting', title: 'Step 2: The Account De-Listing & Deletion Playbook' },
      { id: 'identity-compartmentalization', title: 'Step 3: Identity Compartmentalization & Alias Hygiene' },
      { id: 'continuous-monitoring', title: 'Maintaining Continuous Digital Hygiene' },
      { id: 'faqs', title: 'Frequently Asked Questions' },
    ],
    faqs: [
      {
        question: 'Why are forgotten old accounts dangerous?',
        answer: 'Old, neglected accounts on obscure forums or obsolete services often run outdated password storage schemes (like MD5) and lack two-factor authentication. When breached, attackers test those leaked passwords against your primary email and modern accounts.',
      },
      {
        question: 'How do I request complete deletion under GDPR or CCPA?',
        answer: 'Most platforms provide an automated "Delete Account" button in settings. For those that do not, email their designated privacy officer referencing your "Right to Erasure" (GDPR Article 17) or CCPA deletion rights.',
      },
    ],
    content: `
### Understanding Your Digital Footprint and the Threat Model {#understanding-your-digital-footprint}

Every forum you joined, game server you registered for, and comment you posted over the last two decades forms your **Digital Footprint**.

A wide, unmanaged footprint introduces severe security liabilities:
* **Credential Stuffing**: Old passwords from breached 2014 forums get tested against modern services.
* **Social Engineering & Doxxing**: Attackers piece together your hometown, first pet, mother’s maiden name, and high school from scattered forum threads to bypass security questions.
* **Professional Reputation Risk**: Out-of-context comments made as a teenager can resurface in employer background checks.

---

### Step 1: Conducting a Rigorous Self-Audit {#conducting-a-self-audit}

Before you can clean your footprint, you must discover what the Internet knows about you:

1. **Audit Every Handle You Have Ever Used**: Enter your childhood nicknames, gamer tags, and current professional aliases into [UserScope](/) to generate an instant inventory of active profiles across 650+ platforms.
2. **Search Your Email Addresses**: Query breach databases like *Have I Been Pwned* to identify all compromised services linked to your primary and secondary inboxes.
3. **Audit Public Git Repositories**: Check your public commit history on [GitHub](/platforms/github) for exposed personal emails or historical aliases:
   \`\`\`bash
   git log --pretty=format:"%ae" | sort -u
   \`\`\`

---

### Common High-Risk Data Leak Vectors {#high-risk-leak-vectors}

* **Public Bio Cross-Linking**: Linking your personal Instagram or Spotify to your anonymous developer GitHub account.
* **Consistent Avatar Hashes**: Using the same custom profile photo across sensitive discussion boards and public LinkedIn profiles.
* **Location & Timezone Leaks**: Regularly posting timestamps that reveal your active waking hours and geographic continent.

---

### Step 2: The Account De-Listing & Deletion Playbook {#step-by-step-delisting}

When removing accounts, execute in this order:

1. **Scrub Before Deleting**: Many platforms retain deleted account data in database archives. Manually change your profile name to random characters (e.g. \`anon_8923\`), delete all past posts, and replace your email with a burner forwarding address **before** clicking *"Delete Account"*.
2. **Revoke OAuth Connections**: Go to your Google, Apple, and GitHub security settings and disconnect all legacy third-party app authorizations.
3. **Submit Search Engine Removals**: Once a profile is deleted, use Google's *Remove Outdated Content Tool* to purge the cached snippet from Google Search results.

---

### Step 3: Identity Compartmentalization & Alias Hygiene {#identity-compartmentalization}

For future account creation, adopt **Identity Compartmentalization**:

* **Professional Persona**: Single, consistent handle used exclusively for [GitHub](/platforms/github), LinkedIn, and official business.
* **Personal / Social Persona**: Separate handle disconnected from your legal name, using masked email aliases (e.g. SimpleLogin or iCloud Hide My Email).
* **Exploratory / Anonymous Persona**: Unique, randomly generated handles used once per service and never linked to your personal IP or email.
`,
  },
];

export function getAllGuides(): Guide[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
