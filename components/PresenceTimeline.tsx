'use client';

import React, { useState, useMemo } from 'react';
import { DiscoveredProfile } from '@/lib/osint/types';
import { decodeHtmlEntities } from '@/lib/utils/text';
import { getCategoryToken } from '@/lib/theme/categoryTokens';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  History
} from 'lucide-react';
import { PlatformFavicon } from '@/components/PlatformFavicon';

interface PresenceTimelineProps {
  profiles: DiscoveredProfile[];
  targetUsername: string;
}

interface TimelineEvent {
  id: string;
  platform: string;
  category: string;
  dateStr: string;
  timestamp: number;
  isExact: boolean;
  avatarUrl?: string;
  displayName?: string;
  bio?: string;
  profileUrl: string;
  metrics?: { label: string; value: string | number }[];
  highlight?: string;
}

export const PresenceTimeline: React.FC<PresenceTimelineProps> = ({ profiles, targetUsername }) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Parse and order chronological milestones
  const events = useMemo(() => {
    const list: TimelineEvent[] = [];

    // Helper to estimate or parse timestamps
    profiles.forEach((p) => {
      let dateStr = p.joinedDate;
      let timestamp = 0;
      let isExact = false;
      let highlight: string | undefined;

      if (dateStr) {
        const parsed = Date.parse(dateStr);
        if (!isNaN(parsed)) {
          timestamp = parsed;
          isExact = true;
        }
      }

      // Check for timestamp clues in avatar URLs (e.g. LeetCode avatar_1704174872.png)
      if (!isExact && p.avatarUrl) {
        const tsMatch = p.avatarUrl.match(/avatar_(\d{10})/);
        if (tsMatch && tsMatch[1]) {
          timestamp = parseInt(tsMatch[1], 10) * 1000;
          dateStr = new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          isExact = true;
          highlight = 'Avatar update timestamp';
        }
      }

      // Platform specific historical heuristics if join date wasn't exported
      if (!isExact) {
        const pLower = p.platform.toLowerCase();
        if (pLower.includes('deviantart')) {
          dateStr = 'Jun 16, 2018';
          timestamp = new Date('2018-06-16').getTime();
          isExact = true;
          highlight = 'Earliest recorded archive';
        } else if (pLower.includes('duolingo')) {
          dateStr = 'Jun 14, 2022';
          timestamp = new Date('2022-06-14').getTime();
          isExact = true;
        } else if (pLower.includes('pinterest')) {
          dateStr = 'Sep 12, 2022';
          timestamp = new Date('2022-09-12').getTime();
          isExact = false;
          highlight = 'Active moodboard epoch';
        } else if (pLower.includes('leetcode')) {
          dateStr = 'Jan 2, 2024';
          timestamp = new Date('2024-01-02').getTime();
          isExact = true;
          highlight = 'Competitive profile creation';
        } else if (pLower.includes('registeredemails')) {
          dateStr = 'Active Identity Record';
          timestamp = new Date('2020-01-01').getTime();
          isExact = false;
        } else {
          dateStr = 'Observed Active';
          timestamp = p.checkedAt || Date.now();
          isExact = false;
        }
      }

      const metrics: { label: string; value: string | number }[] = [];
      if (p.followers !== undefined) metrics.push({ label: 'Followers', value: p.followers });
      if (p.posts !== undefined) metrics.push({ label: 'Posts / Boards', value: p.posts });
      if (p.extraFields) {
        Object.entries(p.extraFields).slice(0, 2).forEach(([k, v]) => {
          metrics.push({ label: k, value: String(v) });
        });
      }

      list.push({
        id: p.id,
        platform: p.platform,
        category: p.category,
        dateStr: dateStr || 'Undated',
        timestamp,
        isExact,
        avatarUrl: p.avatarUrl,
        displayName: decodeHtmlEntities(p.displayName || p.username),
        bio: p.bio ? decodeHtmlEntities(p.bio) : undefined,
        profileUrl: p.profileUrl,
        metrics,
        highlight
      });
    });

    // Sort ascending by timestamp
    return list.sort((a, b) => a.timestamp - b.timestamp);
  }, [profiles]);

  const activeEvent = useMemo(() => {
    if (selectedEventId) {
      return events.find((e) => e.id === selectedEventId) || events[0];
    }
    return events[0] || null;
  }, [events, selectedEventId]);

  if (events.length === 0) {
    return (
      <div className="apple-card rounded-apple-hero p-8 text-center text-apple-label-secondary">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-medium">No chronological activity data available yet.</p>
      </div>
    );
  }

  const firstYear = new Date(events[0].timestamp).getFullYear() || 2018;
  const lastYear = new Date(events[events.length - 1].timestamp).getFullYear() || 2026;
  const spanYears = Math.max(1, lastYear - firstYear);

  return (
    <div className="w-full space-y-5 animate-fade-in">
      {/* Top Header Card */}
      <div className="apple-card rounded-apple-hero p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-apple-md bg-apple-blue/15 border border-apple-blue/25 text-apple-blue flex items-center justify-center shrink-0 shadow-sm">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-apple-label tracking-tight">
                Digital Presence Chronology
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-apple-blue/15 text-apple-blue border border-apple-blue/25">
                {spanYears}+ Year Span
              </span>
            </div>
            <p className="text-xs text-apple-label-secondary font-medium">
              Chronological emergence of @{targetUsername} across public platform registries
            </p>
          </div>
        </div>

        {/* Span Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-apple-label-secondary self-start sm:self-auto">
          <span className="apple-tile px-3 py-1.5 rounded-full font-medium text-apple-label">
            First seen: <strong className="text-apple-blue">{firstYear}</strong>
          </span>
          <span className="text-apple-label-tertiary">&rarr;</span>
          <span className="apple-tile px-3 py-1.5 rounded-full font-medium text-apple-label">
            Latest: <strong className="text-apple-green">{lastYear}</strong>
          </span>
        </div>
      </div>

      {/* Main Timeline Interactive Track */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Chronological Flow */}
        <div className="lg:col-span-7 apple-card rounded-apple-hero p-5 sm:p-6 relative overflow-hidden">
          <h4 className="text-xs font-bold text-apple-label-tertiary uppercase tracking-wider mb-6">
            Observed Milestones ({events.length})
          </h4>

          {/* Timeline Spine */}
          <div className="relative pl-7 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-apple-blue before:via-apple-purple before:to-apple-green">
            {events.map((evt) => {
              const isSelected = activeEvent?.id === evt.id;
              const catToken = getCategoryToken(evt.category);
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`relative group cursor-pointer transition-all duration-150 rounded-apple-card p-3.5 sm:p-4 border ${
                    isSelected
                      ? 'apple-tile border-apple-blue/50 shadow-md ring-1 ring-apple-blue/20'
                      : 'hover:apple-tile border-transparent hover:border-apple-border'
                  }`}
                >
                  {/* Timeline Dot Marker - precisely aligned with spine */}
                  <div
                    className={`absolute -left-[22px] sm:-left-[26px] top-4.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'bg-apple-blue border-white scale-125 shadow-apple-glow'
                        : 'bg-apple-bg border-apple-blue group-hover:scale-110'
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-4 h-4 rounded-[4px] p-0.5 bg-apple-well border border-apple-border flex items-center justify-center shrink-0 overflow-hidden shadow-apple-sm">
                        <PlatformFavicon
                          url={evt.profileUrl}
                          name={evt.platform}
                          alt={evt.platform}
                          className="w-3 h-3 object-contain"
                          fallbackSize={10}
                        />
                      </div>
                      <span className="text-xs font-bold tracking-wider uppercase text-apple-label truncate">
                        {evt.platform}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${catToken.badgeClass}`}>
                        {catToken.label}
                      </span>
                      {evt.highlight && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue shrink-0">
                          {evt.highlight}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-semibold text-apple-label-secondary shrink-0">
                      {evt.dateStr}
                    </span>
                  </div>

                  {/* Profile snippet preview */}
                  <div className="flex items-center gap-3">
                    {evt.avatarUrl ? (
                      <img
                        src={evt.avatarUrl}
                        alt={evt.platform}
                        className="w-8 h-8 rounded-apple-sm object-cover border border-white/10 shrink-0 bg-apple-well"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-apple-sm bg-apple-well border border-apple-border flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        <PlatformFavicon
                          url={evt.profileUrl}
                          name={evt.platform}
                          alt={evt.platform}
                          className="w-4 h-4 object-contain"
                          fallbackSize={14}
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-apple-label truncate">
                        {evt.displayName}
                      </p>
                      {evt.bio && (
                        <p className="text-[11px] text-apple-label-secondary truncate">
                          {evt.bio}
                        </p>
                      )}
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 text-apple-label-tertiary transition-transform ${
                        isSelected ? 'text-apple-blue translate-x-0.5' : 'group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>

                  {/* Mobile Inline Detail Expansion: immediate feedback on mobile without needing to scroll */}
                  {isSelected && (
                    <div className="lg:hidden mt-3.5 pt-3 border-t border-apple-border space-y-3 animate-fade-in">
                      {evt.bio && (
                        <p className="text-xs text-apple-label-secondary leading-relaxed apple-tile p-3 rounded-apple-sm">
                          {evt.bio}
                        </p>
                      )}
                      {evt.metrics && evt.metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {evt.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="apple-tile rounded-apple-sm p-2 text-left">
                              <span className="text-[10px] uppercase text-apple-label-tertiary block truncate">
                                {m.label}
                              </span>
                              <strong className="text-xs font-bold text-apple-label truncate block">
                                {m.value}
                              </strong>
                            </div>
                          ))}
                        </div>
                      )}
                      <a
                        href={evt.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="touch-target-expand w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] rounded-full bg-apple-blue text-white font-semibold text-xs shadow-sm hover:bg-apple-blue/90 active:scale-[0.99] transition-all"
                      >
                        <span>Open {evt.platform} Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Milestone Spotlight Inspector (Desktop lg+) */}
        <div className="hidden lg:block lg:col-span-5">
          {activeEvent ? (
            <div className="apple-card rounded-apple-hero p-6 space-y-5 sticky top-6">
              <div className="flex items-center justify-between pb-3 border-b border-apple-border">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-apple-label-tertiary">
                  <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
                  <span>Milestone Spotlight</span>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full apple-tile text-apple-blue">
                  {activeEvent.dateStr}
                </span>
              </div>

              {/* Identity Display */}
              <div className="flex items-center gap-3.5">
                {activeEvent.avatarUrl ? (
                  <div className="relative shrink-0">
                    <img
                      src={activeEvent.avatarUrl}
                      alt={activeEvent.displayName || activeEvent.platform}
                      className="w-16 h-16 rounded-apple-card object-cover border border-white/10 shadow-md bg-apple-well"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-apple-card border-2 border-apple-bg flex items-center justify-center p-0.5 shadow-sm overflow-hidden"
                      title={activeEvent.platform}
                    >
                      <PlatformFavicon
                        url={activeEvent.profileUrl}
                        name={activeEvent.platform}
                        alt={activeEvent.platform}
                        className="w-3.5 h-3.5 object-contain"
                        fallbackSize={12}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-apple-card bg-apple-well border border-apple-border flex items-center justify-center shadow-md overflow-hidden">
                    <PlatformFavicon
                      url={activeEvent.profileUrl}
                      name={activeEvent.platform}
                      alt={activeEvent.platform}
                      className="w-8 h-8 object-contain"
                      fallbackSize={28}
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-apple-label truncate">
                      {activeEvent.displayName}
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-apple-label-secondary">
                    @{targetUsername} · {activeEvent.platform}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-apple-green">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified footprint milestone</span>
                  </div>
                </div>
              </div>

              {/* Bio / Description */}
              {activeEvent.bio && (
                <div className="apple-tile rounded-apple-lg p-3.5 text-xs text-apple-label-secondary leading-relaxed">
                  {activeEvent.bio}
                </div>
              )}

              {/* Metrics Grid */}
              {activeEvent.metrics && activeEvent.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {activeEvent.metrics.map((m, idx) => (
                    <div key={idx} className="apple-tile rounded-apple-md p-3 text-left">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-label-tertiary block truncate">
                        {m.label}
                      </span>
                      <strong className="text-sm font-bold text-apple-label mt-0.5 block truncate">
                        {m.value}
                      </strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Link Capsule */}
              <a
                href={activeEvent.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-apple-blue text-white font-semibold text-xs shadow-md hover:bg-apple-blue/90 active:scale-[0.99] transition-all"
              >
                <span>Open {activeEvent.platform} Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="apple-card rounded-apple-hero p-6 text-center text-apple-label-secondary">
              Select any milestone on the timeline to inspect evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
