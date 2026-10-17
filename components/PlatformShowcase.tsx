'use client';

import React from 'react';
import { Code2, Globe, Music, Gamepad2, Briefcase, MessageSquare } from 'lucide-react';

export const PlatformShowcase: React.FC = () => {
  const categories = [
    {
      name: 'Developer & Code',
      icon: Code2,
      count: '90+ Platforms',
      badgeClass: 'text-apple-blue bg-apple-blue/10 border-apple-blue/20',
      examples: ['GitHub', 'GitLab', 'Docker Hub', 'npm', 'PyPI', 'Bitbucket', 'Kaggle', 'HackerRank'],
    },
    {
      name: 'Social & Identity',
      icon: MessageSquare,
      count: '180+ Platforms',
      badgeClass: 'text-apple-purple bg-apple-purple/10 border-apple-purple/20',
      examples: ['X (Twitter)', 'Reddit', 'Bluesky', 'Mastodon', 'Telegram', 'Discourse', 'Pinterest', 'Tumblr'],
    },
    {
      name: 'Professional & Writing',
      icon: Briefcase,
      count: '110+ Platforms',
      badgeClass: 'text-apple-orange bg-apple-orange/10 border-apple-orange/20',
      examples: ['Dev.to', 'Medium', 'Substack', 'ProductHunt', 'Hashnode', 'About.me', 'Freelancer'],
    },
    {
      name: 'Media & Creative',
      icon: Music,
      count: '130+ Platforms',
      badgeClass: 'text-apple-pink bg-apple-pink/10 border-apple-pink/20',
      examples: ['YouTube', 'Spotify', 'SoundCloud', 'Vimeo', 'Behance', 'Dribbble', 'Flickr', 'Bandcamp'],
    },
    {
      name: 'Gaming & Virtual',
      icon: Gamepad2,
      count: '80+ Platforms',
      badgeClass: 'text-apple-green bg-apple-green/10 border-apple-green/20',
      examples: ['Steam', 'Twitch', 'Roblox', 'Chess.com', 'Speedrun.com', 'Lichess', 'NexusMods'],
    },
    {
      name: 'Global & Niche Services',
      icon: Globe,
      count: '100+ Platforms',
      badgeClass: 'text-apple-teal bg-apple-teal/10 border-apple-teal/20',
      examples: ['Gravatar', 'Keybase', 'Pastebin', 'Archive.org', 'Wikidata', 'Wikipedia', 'SourceForge'],
    },
  ];

  return (
    <section className="space-y-6 pt-8 sm:pt-14">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border">
          Ecosystem Coverage
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-apple-label">
          Broad Coverage Across 700+ Public Registries
        </h2>
        <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
          Comprehensive reconnaissance indexing developer registries, social graphs, creative networks, and global hubs.
        </p>
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
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${cat.badgeClass}`}>
                    {cat.count}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.examples.map((item) => (
                    <span
                      key={item}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-apple-well text-apple-label-secondary border border-apple-border"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
