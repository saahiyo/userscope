'use client';

import React from 'react';
import { Search, LayoutGrid, ListFilter, Network, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryToken } from '@/lib/theme/categoryTokens';
import { springs, microinteractions } from '@/lib/motion';

interface CategoryScopeBarProps {
  filterQuery: string;
  setFilterQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  totalProfiles: number;
  filteredCount: number;
  viewMode: 'grid' | 'list' | 'graph' | 'timeline';
  setViewMode: (mode: 'grid' | 'list' | 'graph' | 'timeline') => void;
}

export const CategoryScopeBar: React.FC<CategoryScopeBarProps> = ({
  filterQuery,
  setFilterQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalProfiles,
  filteredCount,
  viewMode,
  setViewMode,
}) => {
  const viewModes: Array<{
    id: 'grid' | 'list' | 'graph' | 'timeline';
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'list', label: 'List', icon: <ListFilter className="w-3.5 h-3.5" /> },
    { id: 'graph', label: 'Graph', icon: <Network className="w-3.5 h-3.5 text-apple-blue" /> },
    { id: 'timeline', label: 'Timeline', icon: <History className="w-3.5 h-3.5 text-apple-purple" /> },
  ];

  return (
    <div className="w-full apple-card rounded-apple-card p-3 sm:p-4 space-y-3.5 border border-apple-border shadow-apple-card">
      {/* Upper Control Bar: Search Input & Segmented View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input Filter */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-label-tertiary pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search footprints by platform, handle, or bio..."
            className="w-full bg-apple-well border border-apple-border rounded-full pl-9 pr-8 py-2 text-xs text-apple-label placeholder:text-apple-label-tertiary focus:outline-none focus:ring-1 focus:ring-apple-blue transition-all"
          />
          <AnimatePresence>
            {filterQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                whileTap={{ scale: 0.85 }}
                transition={springs.snappy}
                type="button"
                onClick={() => setFilterQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-apple-chip text-apple-label-secondary hover:text-apple-label flex items-center justify-center transition-colors"
                title="Clear filter"
              >
                <X className="w-3 h-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Segmented Control with animations.dev Sliding Pill Indicator */}
        <div className="relative inline-flex p-1 rounded-full bg-apple-well border border-apple-border shadow-apple-sm shrink-0 self-start sm:self-auto">
          {viewModes.map((item) => {
            const isActive = viewMode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setViewMode(item.id)}
                className={`relative touch-target-expand px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors z-10 ${
                  isActive
                    ? 'text-apple-label'
                    : 'text-apple-label-tertiary hover:text-apple-label'
                }`}
                title={`${item.label} view`}
                aria-label={`${item.label} view`}
              >
                {/* Sliding background indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeViewTab"
                    className="absolute inset-0 bg-apple-chip rounded-full shadow-apple-sm -z-10 border border-apple-border/50"
                    transition={springs.smooth}
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scope Bar: Dedicated full-width horizontal category filter row with sliding active pill */}
      <div className="relative w-full pt-0.5">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All Footprints Pill */}
          <motion.button
            type="button"
            whileTap={microinteractions.chipTap}
            onClick={() => setSelectedCategory('all')}
            className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'text-white'
                : 'text-apple-label-secondary hover:text-apple-label bg-apple-well border border-apple-border'
            }`}
          >
            {selectedCategory === 'all' && (
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-apple-blue rounded-full -z-10 shadow-sm"
                transition={springs.smooth}
              />
            )}
            All Footprints ({totalProfiles})
          </motion.button>

          {/* Dynamic Platform Categories */}
          {categories.map((cat) => {
            const token = getCategoryToken(cat);
            const isSelected = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                type="button"
                whileTap={microinteractions.chipTap}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? 'text-white'
                    : 'text-apple-label-secondary hover:text-apple-label bg-apple-well border border-apple-border'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-apple-blue rounded-full -z-10 shadow-sm"
                    transition={springs.smooth}
                  />
                )}
                {token.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Query match badge */}
      {filterQuery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={springs.smooth}
          className="text-[11px] text-apple-label-secondary font-mono flex items-center gap-1.5 pt-1 border-t border-apple-border/50"
        >
          <span>Showing</span>
          <strong className="text-apple-blue font-bold">{filteredCount}</strong>
          <span>of {totalProfiles} profiles matching &ldquo;{filterQuery}&rdquo;</span>
        </motion.div>
      )}
    </div>
  );
};
