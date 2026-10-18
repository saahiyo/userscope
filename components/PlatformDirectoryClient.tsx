'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Globe, ExternalLink, ArrowRight, X, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs, microinteractions } from '@/lib/motion';
import { PlatformRecord, CategoryKey, CATEGORIES } from '@/lib/osint/platformDirectory';
import { PlatformFavicon } from '@/components/PlatformFavicon';

interface PlatformDirectoryClientProps {
  platforms: PlatformRecord[];
}

export const PlatformDirectoryClient: React.FC<PlatformDirectoryClientProps> = ({ platforms }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');

  const categoryKeys: CategoryKey[] = [
    'all',
    'developer',
    'social',
    'gaming',
    'media',
    'finance',
    'services',
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: platforms.length };
    for (const p of platforms) {
      counts[p.categoryKey] = (counts[p.categoryKey] || 0) + 1;
    }
    return counts;
  }, [platforms]);

  const filteredPlatforms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return platforms.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.categoryKey === selectedCategory;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [platforms, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Floating Search Pill */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-apple-label-tertiary group-focus-within:text-apple-blue transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 650+ platforms by name, domain, or category..."
            className="w-full pl-11 pr-10 py-3.5 rounded-full bg-apple-well/90 hover:bg-apple-chip/70 focus:bg-apple-well border border-apple-border focus:border-apple-blue/50 text-sm text-apple-label placeholder:text-apple-label-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all shadow-apple-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-apple-label-tertiary hover:text-apple-label transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {categoryKeys.map((catKey) => {
            const cat = CATEGORIES[catKey];
            const isSelected = selectedCategory === catKey;
            const count = categoryCounts[catKey] || 0;

            return (
              <motion.button
                key={catKey}
                type="button"
                whileTap={microinteractions.chipTap}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-apple-sm ${
                  isSelected
                    ? 'bg-apple-label text-apple-bg shadow-sm'
                    : 'bg-apple-well text-apple-label-secondary hover:text-apple-label hover:bg-apple-chip border border-apple-border'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-apple-bg/20 text-apple-bg'
                      : 'bg-apple-chip text-apple-label-tertiary'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="flex items-center justify-between text-xs text-apple-label-secondary border-b border-apple-border pb-3">
        <span>
          Showing <strong className="text-apple-label">{filteredPlatforms.length}</strong> of {platforms.length} platforms
        </span>
        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className="text-apple-blue hover:underline text-xs"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Platforms Grid */}
      {filteredPlatforms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredPlatforms.map((platform) => {
            return (
              <div
                key={platform.slug}
                className="apple-card rounded-[18px] sm:rounded-[20px] p-4 sm:p-5 border border-apple-border flex flex-col justify-between hover:border-apple-border-strong transition-all group"
              >
                <div className="space-y-3">
                  {/* Header: Favicon + Platform Name + Category Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-[10px] bg-apple-well border border-apple-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        <PlatformFavicon
                          src={platform.faviconUrl}
                          alt={`${platform.name} icon`}
                          className="w-5 h-5 object-contain"
                          fallbackSize={18}
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/platforms/${platform.slug}`}
                          className="font-semibold text-sm text-apple-label hover:text-apple-blue transition-colors truncate block"
                        >
                          {platform.name}
                        </Link>
                        <span className="text-[11px] font-mono text-apple-label-tertiary truncate block">
                          {platform.domain}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                        CATEGORIES[platform.categoryKey]?.badgeClass || ''
                      }`}
                    >
                      {platform.category}
                    </span>
                  </div>

                  {/* URL Profile Template Preview */}
                  <div className="p-2 rounded-[10px] bg-apple-well/70 border border-apple-border text-[11px] font-mono text-apple-label-secondary truncate">
                    <span className="opacity-60">Pattern: </span>
                    <span className="text-apple-label select-all">{platform.urlPattern}</span>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 mt-3 border-t border-apple-border/70 flex items-center justify-between gap-2 text-xs">
                  <Link
                    href={`/platforms/${platform.slug}`}
                    className="inline-flex items-center gap-1 text-apple-label-secondary hover:text-apple-label font-medium transition-colors"
                  >
                    <span>View OSINT Intel</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href={`/?q=${encodeURIComponent(platform.sampleUsers[0] || 'test')}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-apple-well hover:bg-apple-chip border border-apple-border text-[11px] font-medium text-apple-label transition-colors shadow-apple-sm"
                    title={`Scan sample handle on UserScope`}
                  >
                    <span>Quick Scan</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-apple-card border border-apple-border rounded-apple-2xl space-y-3">
          <p className="text-sm font-medium text-apple-label">No platforms matched your search</p>
          <p className="text-xs text-apple-label-secondary">
            Try searching with a different platform name, domain extension, or category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-2 px-4 py-1.5 rounded-full bg-apple-well hover:bg-apple-chip border border-apple-border text-xs font-semibold text-apple-label transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
