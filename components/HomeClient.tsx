'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HeaderNav } from '@/components/HeaderNav';
import { SearchPill } from '@/components/SearchPill';
import { ScanProgress } from '@/components/ScanProgress';
import { IdentityOverview } from '@/components/IdentityOverview';
import { CategoryScopeBar } from '@/components/CategoryScopeBar';
import { ProfileCard } from '@/components/ProfileCard';
import { MasonryGrid } from '@/components/MasonryGrid';
import { RelationshipGraph } from '@/components/RelationshipGraph';
import { PresenceTimeline } from '@/components/PresenceTimeline';
import { DiscoveredProfile, SearchAggregatedSummary, SearchStreamEvent } from '@/lib/osint/types';
import { Sparkles, ShieldCheck, Search, ArrowRight, CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { FeatureBento } from '@/components/FeatureBento';
import { WorkflowSteps } from '@/components/WorkflowSteps';
import { PlatformShowcase } from '@/components/PlatformShowcase';
import { FaqSection } from '@/components/FaqSection';
import { LandingFooter } from '@/components/LandingFooter';
import { useTheme } from '@/components/ThemeProvider';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { motion, AnimatePresence } from 'framer-motion';
import { springs, microinteractions, easings } from '@/lib/motion';
import dynamic from 'next/dynamic';

const PatternWaves = dynamic(() => import('@/components/PatternWaves'), {
  ssr: false,
});

function SearchParamsSync({ onSearch }: { onSearch: (q: string, platform?: string) => void }) {
  const searchParams = useSearchParams();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    const initialQuery = searchParams.get('q') || searchParams.get('username') || searchParams.get('target');
    const initialPlatform = searchParams.get('platform') || undefined;
    if (initialQuery && initialQuery.trim()) {
      mountedRef.current = true;
      onSearch(initialQuery.trim(), initialPlatform);
    }
  }, [searchParams, onSearch]);

  return null;
}

export function HomeClient({ platformCount, scanRuleCount }: { platformCount: number; scanRuleCount: number }) {
  const { isDark } = useTheme();
  const isReducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [targetPlatform, setTargetPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search Results State
  const [searchedQuery, setSearchedQuery] = useState('');
  const [profiles, setProfiles] = useState<DiscoveredProfile[]>([]);
  const [summary, setSummary] = useState<SearchAggregatedSummary>({
    profilePictures: [],
    banners: [],
    emails: [],
    locations: [],
    names: [],
    usernames: [],
  });
  const [stats, setStats] = useState({
    profilesFound: 0,
    timeElapsed: 0,
    firstSeen: 'Jun 16, 2018',
    lastSeen: 'Aug 26, 2026',
    checkedCount: 0,
    totalCount: scanRuleCount,
  });

  // Filter & View Options
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'graph' | 'timeline'>('grid');

  const eventSourceRef = useRef<EventSource | null>(null);

  const startSearch = useCallback(
    (targetQuery?: string, platformOverride?: string) => {
      const q = (targetQuery || query).trim();
      if (!q || isLoading) return;

      const plat = platformOverride !== undefined ? platformOverride : targetPlatform;

      if (targetQuery) {
        setQuery(targetQuery);
      }
      if (platformOverride !== undefined) {
        setTargetPlatform(platformOverride || null);
      }

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('q', q);
        if (plat) {
          url.searchParams.set('platform', plat);
        } else {
          url.searchParams.delete('platform');
        }
        window.history.replaceState(null, '', url.toString());
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setIsLoading(true);
      setSearchedQuery(q);
      setProfiles([]);
      setSummary({
        profilePictures: [],
        banners: [],
        emails: [],
        locations: [],
        names: [],
        usernames: [q],
      });
      setStats({
        profilesFound: 0,
        timeElapsed: 0,
        firstSeen: 'Jun 16, 2018',
        lastSeen: 'Aug 26, 2026',
        checkedCount: 0,
        totalCount: plat ? 1 : scanRuleCount,
      });

      const streamUrl = plat
        ? `/api/search/stream?username=${encodeURIComponent(q)}&platform=${encodeURIComponent(plat)}`
        : `/api/search/stream?username=${encodeURIComponent(q)}`;

      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const payload: SearchStreamEvent = JSON.parse(event.data);

          if (payload.type === 'hit' && payload.profile) {
            setProfiles((prev) => {
              if (prev.some((p) => p.id === payload.profile!.id)) return prev;
              return [...prev, payload.profile!];
            });
          }

          if (payload.summary) {
            setSummary(payload.summary);
          }

          setStats((prev) => ({
            ...prev,
            profilesFound: payload.hitsCount ?? prev.profilesFound,
            timeElapsed: payload.timeElapsedMs ? Number((payload.timeElapsedMs / 1000).toFixed(1)) : prev.timeElapsed,
            checkedCount: payload.checkedCount ?? prev.checkedCount,
            totalCount: payload.totalCount ?? prev.totalCount,
          }));

          if (payload.type === 'complete' || payload.type === 'error') {
            eventSource.close();
            setIsLoading(false);
          }
        } catch (err) {
          console.error('Failed to parse SSE payload', err);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
      };
    },
    [query, isLoading]
  );

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const resetSearch = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setIsLoading(false);
    setSearchedQuery('');
    setTargetPlatform(null);
    setProfiles([]);
    setFilterQuery('');
    setSelectedCategory('all');

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('q');
      url.searchParams.delete('username');
      url.searchParams.delete('target');
      url.searchParams.delete('platform');
      const cleanPath = url.pathname + (url.search ? url.search : '');
      window.history.replaceState(null, '', cleanPath);
    }
  };

  // Filter and sort profiles
  const categories = Array.from(new Set(profiles.map((p) => p.category)));

  const filteredProfiles = profiles.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesText =
      !filterQuery ||
      p.platform.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.displayName && p.displayName.toLowerCase().includes(filterQuery.toLowerCase())) ||
      p.username.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (p.bio && p.bio.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(filterQuery.toLowerCase()));

    return matchesCategory && matchesText;
  });

  const handleExport = (format: 'json' | 'csv') => {
    if (profiles.length === 0) return;

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `userscope-footprint-${searchedQuery || 'results'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      const headers = ['Platform', 'Category', 'Username', 'Profile URL', 'Display Name', 'Location', 'Email', 'Joined Date', 'Followers'];
      const rows = profiles.map((p) => [
        p.platform,
        p.category,
        p.username,
        p.profileUrl,
        p.displayName || '',
        p.location || '',
        p.email || '',
        p.joinedDate || '',
        p.followers || '',
      ]);
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join(
          '\n'
        );
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodeURI(csvContent));
      downloadAnchor.setAttribute('download', `userscope-footprint-${searchedQuery || 'results'}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-label antialiased relative overflow-x-clip">
      <Suspense fallback={null}>
        <SearchParamsSync onSearch={startSearch} />
      </Suspense>

      {/* Dynamic Interactive PatternWaves Surface */}
      <div
        className="absolute top-0 left-0 right-0 h-[1050px] sm:h-[1250px] pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0, 0, 0, 0.4) 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, rgba(0, 0, 0, 0.4) 75%, transparent 100%)',
        }}
      >
        <PatternWaves
          key={isReducedMotion ? 'reduced' : 'motion'}
          preset="silk"
          color={isDark ? '#ffffff' : '#1d1d1f'}
          backgroundColor="transparent"
          fade="bottom"
          fadeSize={0.75}
          opacity={isDark ? 0.38 : 0.25}
          interactive={!isReducedMotion}
          paused={isReducedMotion}
          cursorSize={60}
          cursorStrength={isReducedMotion ? 0 : 0.6}
          speed={isReducedMotion ? 0 : 0.32}
          scale={1.1}
        />
      </div>

      {/* Liquid Glass Header Navigation */}
      <HeaderNav
        onExport={handleExport}
        hasResults={profiles.length > 0}
        isScanning={isLoading}
        totalPlatforms={platformCount}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-10">
        {/* Hero Section & Search Pill */}
        <section className="text-center space-y-4 sm:space-y-6 pt-2 sm:pt-6 relative">
          <div className="relative space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            {/* Subtle center ambient halo to guarantee pristine readability */}
            <div
              className="absolute -inset-x-12 -inset-y-8 bg-apple-bg/85 rounded-3xl blur-2xl pointer-events-none -z-10"
              aria-hidden="true"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-well border border-apple-border text-[11px] font-medium text-apple-label-secondary shadow-apple-sm">
              <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
              <span>{platformCount} Public Platforms in the Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-apple-label leading-[1.15] drop-shadow-sm">
              Search Usernames Across Public Platforms
            </h1>
            <p className="text-xs sm:text-base text-apple-label-secondary dark:text-neutral-300 max-w-lg mx-auto leading-relaxed">
              Search a username across {platformCount} listed public platforms. Full scans check {scanRuleCount} endpoint rules and stream results to your browser.
            </p>
          </div>

          {/* Floating Search Pill */}
          <SearchPill
            query={query}
            setQuery={setQuery}
            onSearch={() => startSearch()}
            isLoading={isLoading}
          />

          {/* Quick Demo Targets & Live Metrics Bar */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-medium text-apple-label-tertiary mr-1">
                Explore targets:
              </span>
              {[
                { handle: 'torvalds', note: 'Linux' },
                { handle: 'taylorotwell', note: 'Laravel' },
                { handle: 'shadcn', note: 'UI' },
                { handle: 'leerob', note: 'Next.js' },
              ].map((item) => (
                <motion.button
                  key={item.handle}
                  type="button"
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={microinteractions.chipTap}
                  transition={springs.snappy}
                  onClick={() => {
                    setQuery(item.handle);
                    startSearch(item.handle);
                  }}
                  className="touch-target-expand group px-3 py-1.5 rounded-full bg-apple-well hover:bg-apple-chip border border-apple-border hover:border-apple-border-strong text-xs text-apple-label transition-colors flex items-center gap-1.5 shadow-apple-sm"
                >
                  <span className="font-mono font-medium">@{item.handle}</span>
                  <span className="text-[10px] text-apple-label-secondary group-hover:text-apple-blue transition-colors">
                    {item.note} &rarr;
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-[11px] font-mono text-apple-label-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-apple-blue" />
                <span>{scanRuleCount} Scan Rules</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-apple-green" />
                <span>Sub-second SSE Streaming</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-apple-purple" />
                <span>Server-Processed Scans</span>
              </span>
            </div>
          </div>
        </section>

        {/* Real-time Telemetry Bar */}
        <AnimatePresence>
          {isLoading && (
            <ScanProgress
              checkedCount={stats.checkedCount}
              totalCount={stats.totalCount}
              hitsCount={stats.profilesFound}
              timeElapsed={stats.timeElapsed}
            />
          )}
        </AnimatePresence>

        {/* Results Stream Section vs Landing Page with animations.dev View Transition */}
        <AnimatePresence mode="wait">
          {searchedQuery ? (
            <motion.div
              key="results-stream"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={springs.smooth}
              className="space-y-6"
            >
              {/* Header with Back button & active target */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <motion.button
                  type="button"
                  whileHover={{ x: -2 }}
                  whileTap={microinteractions.buttonTap}
                  transition={springs.snappy}
                  onClick={resetSearch}
                  className="touch-target-expand inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-well hover:bg-apple-chip border border-apple-border text-xs font-semibold text-apple-label-secondary hover:text-apple-label transition-colors shadow-apple-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Overview</span>
                </motion.button>
                <div className="flex items-center gap-2">
                  {targetPlatform && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-apple-blue/10 border border-apple-blue/20 text-apple-blue font-medium">
                      Platform: <span className="font-bold uppercase">{targetPlatform}</span>
                    </span>
                  )}
                  {targetPlatform && !isLoading && (
                    <button
                      type="button"
                      onClick={() => {
                        startSearch(searchedQuery, '');
                      }}
                      className="text-xs text-apple-blue hover:underline inline-flex items-center gap-1"
                    >
                      <span>Scan all {scanRuleCount} endpoint rules &rarr;</span>
                    </button>
                  )}
                  <span className="text-xs font-mono text-apple-label-secondary">
                    Target: <span className="text-apple-label font-bold">@{searchedQuery}</span>
                  </span>
                </div>
              </div>

              {/* Discovered Identity Overview Card */}
              <IdentityOverview
                summary={summary}
                targetUsername={searchedQuery}
                totalFound={profiles.length}
                timeElapsed={stats.timeElapsed}
                firstSeen={stats.firstSeen}
                lastSeen={stats.lastSeen}
              />

              {/* Scope Bar & Filter Controls */}
              <CategoryScopeBar
                filterQuery={filterQuery}
                setFilterQuery={setFilterQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                totalProfiles={profiles.length}
                filteredCount={filteredProfiles.length}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {/* View Mode Switching: Interactive Graph, Chronological Timeline, or Profile Cards */}
              {viewMode === 'graph' ? (
                <RelationshipGraph
                  profiles={filteredProfiles}
                  summary={summary}
                  targetUsername={searchedQuery}
                />
              ) : viewMode === 'timeline' ? (
                <PresenceTimeline
                  profiles={filteredProfiles}
                  targetUsername={searchedQuery}
                />
              ) : filteredProfiles.length > 0 ? (
                viewMode === 'grid' ? (
                  <MasonryGrid profiles={filteredProfiles} />
                ) : (
                  <motion.div layout transition={springs.smooth} className="flex flex-col gap-4 pt-1">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {filteredProfiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )
              ) : (
                <div className="text-center py-16 bg-apple-card border border-apple-border rounded-apple-2xl space-y-3">
                  {isLoading ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-apple-blue/30 border-t-apple-blue rounded-full animate-spin" />
                      <p className="text-sm text-apple-label-secondary">
                        Searching {scanRuleCount} endpoint rules...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-apple-label">No matching profiles found</p>
                      <p className="text-xs text-apple-label-secondary">
                        Try selecting another category or clearing your filter keyword.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* Comprehensive Product Landing Sections */
            <motion.div
              key="landing-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springs.smooth}
              className="space-y-10 sm:space-y-16"
            >
              <FeatureBento scanRuleCount={scanRuleCount} />
              <WorkflowSteps scanRuleCount={scanRuleCount} />
              <PlatformShowcase platformCount={platformCount} />
              <FaqSection platformCount={platformCount} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Comprehensive Apple Grouped Footer */}
      <LandingFooter platformCount={platformCount} />
    </div>
  );
}
