'use client';

import Link from 'next/link';
import { Code2, Globe, Music, Gamepad2, Briefcase, MessageSquare, ArrowRight } from 'lucide-react';

const exampleSlugMap: Record<string, string> = {
  GitHub: 'github',
  GitLab: 'gitlab',
  'Docker Hub': 'docker-hub',
  npm: 'npm',
  PyPI: 'pypi',
  Bitbucket: 'bitbucket',
  Kaggle: 'kaggle',
  HackerRank: 'hackerrank',
  'X (Twitter)': 'x-twitter',
  Reddit: 'reddit',
  Bluesky: 'bluesky-username',
  Mastodon: 'mastodon',
  Telegram: 'telegram',
  Discourse: 'discourse',
  Pinterest: 'pinterest',
  Tumblr: 'tumblr',
  'Dev.to': 'dev-to',
  Medium: 'medium',
  Substack: 'substack',
  ProductHunt: 'producthunt',
  Hashnode: 'hashnode',
  'About.me': 'about-me',
  Freelancer: 'freelancer',
  YouTube: 'youtube',
  Spotify: 'spotify',
  SoundCloud: 'soundcloud',
  Vimeo: 'vimeo',
  Behance: 'behance',
  Dribbble: 'dribbble',
  Flickr: 'flickr',
  Bandcamp: 'bandcamp',
  Steam: 'steam',
  Twitch: 'twitch',
  Roblox: 'roblox',
  'Chess.com': 'chess-com',
  'Speedrun.com': 'speedrun-com',
  Lichess: 'lichess',
  NexusMods: 'nexusmods',
  Gravatar: 'gravatar',
  Keybase: 'keybase',
  Pastebin: 'pastebin',
  Wikidot: 'wikidot',
  'OpenStreetMap Wiki': 'openstreetmap-wiki',
  SourceForge: 'sourceforge',
};

export const PlatformShowcase: React.FC<{ platformCount: number }> = ({ platformCount }) => {
  const categories = [
    {
      name: 'Developer & Code',
      icon: Code2,
      badgeClass: 'text-apple-blue bg-apple-blue/10 border-apple-blue/20',
      examples: ['GitHub', 'GitLab', 'Docker Hub', 'npm', 'PyPI', 'Bitbucket', 'Kaggle', 'HackerRank'],
    },
    {
      name: 'Social & Identity',
      icon: MessageSquare,
      badgeClass: 'text-apple-purple bg-apple-purple/10 border-apple-purple/20',
      examples: ['X (Twitter)', 'Reddit', 'Bluesky', 'Mastodon', 'Telegram', 'Discourse', 'Pinterest', 'Tumblr'],
    },
    {
      name: 'Professional & Writing',
      icon: Briefcase,
      badgeClass: 'text-apple-orange bg-apple-orange/10 border-apple-orange/20',
      examples: ['Dev.to', 'Medium', 'Substack', 'ProductHunt', 'Hashnode', 'About.me', 'Freelancer'],
    },
    {
      name: 'Media & Creative',
      icon: Music,
      badgeClass: 'text-apple-pink bg-apple-pink/10 border-apple-pink/20',
      examples: ['YouTube', 'Spotify', 'SoundCloud', 'Vimeo', 'Behance', 'Dribbble', 'Flickr', 'Bandcamp'],
    },
    {
      name: 'Gaming & Virtual',
      icon: Gamepad2,
      badgeClass: 'text-apple-green bg-apple-green/10 border-apple-green/20',
      examples: ['Steam', 'Twitch', 'Roblox', 'Chess.com', 'Speedrun.com', 'Lichess', 'NexusMods'],
    },
    {
      name: 'Global & Niche Services',
      icon: Globe,
      badgeClass: 'text-apple-teal bg-apple-teal/10 border-apple-teal/20',
      examples: ['Gravatar', 'Keybase', 'Pastebin', 'Wikidot', 'OpenStreetMap Wiki', 'SourceForge'],
    },
  ];

  return (
    <section className="space-y-6 pt-8 sm:pt-14">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border">
          Ecosystem Coverage
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-apple-label">
          Browse {platformCount} Public Platforms
        </h2>
        <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
          Browse developer, social, creative, and global services, then open a platform page to check a username.
        </p>

        <div className="pt-1">
          <Link
            href="/platforms"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-apple-well hover:bg-apple-chip border border-apple-border text-xs font-semibold text-apple-label transition-colors shadow-apple-sm"
          >
            <span>Explore All {platformCount} Platforms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="apple-card rounded-[18px] sm:rounded-[22px] p-4 sm:p-5 border border-apple-border flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[8px] bg-apple-well border border-apple-border flex items-center justify-center text-apple-label">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-apple-label tracking-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.examples.map((item) => {
                    const slug = exampleSlugMap[item];
                    const href = slug ? `/platforms/${slug}` : '/platforms';
                    return (
                      <Link
                        key={item}
                        href={href}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-apple-well hover:bg-apple-chip text-apple-label-secondary hover:text-apple-label border border-apple-border transition-colors"
                      >
                        {item}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
