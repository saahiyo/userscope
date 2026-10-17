'use client';

import React from 'react';
import { Search, LayoutGrid, ListFilter, Network, History, X } from 'lucide-react';
import { getCategoryToken } from '@/lib/theme/categoryTokens';

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
  return (
    <div className="w-full apple-card rounded-apple-card p-3 sm:p-4 space-y-3.5 border border-apple-border shadow-apple-card animate-fade-in">
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
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-apple-chip text-apple-label-secondary hover:text-apple-label flex items-center justify-center transition-colors"
              title="Clear filter"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* View Mode Segmented Control */}
        <div className="inline-flex p-1 rounded-full bg-apple-well border border-apple-border shadow-apple-sm shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`touch-target-expand px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-apple-chip text-apple-label shadow-apple-sm'
                : 'text-apple-label-tertiary hover:text-apple-label'
            }`}
            title="Grid view"
            aria-label="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`touch-target-expand px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-apple-chip text-apple-label shadow-apple-sm'
                : 'text-apple-label-tertiary hover:text-apple-label'
            }`}
            title="List view"
            aria-label="List view"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('graph')}
            className={`touch-target-expand px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'graph'
                ? 'bg-apple-chip text-apple-label shadow-apple-sm'
                : 'text-apple-label-tertiary hover:text-apple-label'
            }`}
            title="Interactive Relationship Graph"
            aria-label="Interactive Relationship Graph"
          >
            <Network className="w-3.5 h-3.5 text-apple-blue" />
            <span>Graph</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`touch-target-expand px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'timeline'
                ? 'bg-apple-chip text-apple-label shadow-apple-sm'
                : 'text-apple-label-tertiary hover:text-apple-label'
            }`}
            title="Chronological Presence Timeline"
            aria-label="Chronological Presence Timeline"
          >
            <History className="w-3.5 h-3.5 text-apple-purple" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* Scope Bar: Dedicated full-width horizontal category filter row */}
      <div className="relative w-full pt-0.5">
        <div
          data-lenis-prevent
          className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All Footprints Pill */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'apple-chip text-apple-label-secondary hover:text-apple-label hover:border-apple-border'
            }`}
          >
            All Footprints ({totalProfiles})
          </button>

          {/* Dynamic Platform Categories */}
          {categories.map((cat) => {
            const token = getCategoryToken(cat);
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isSelected
                    ? 'bg-apple-blue text-white shadow-sm'
                    : 'apple-chip text-apple-label-secondary hover:text-apple-label hover:border-apple-border'
                }`}
              >
                {token.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Query match badge */}
      {filterQuery && (
        <div className="text-[11px] text-apple-label-secondary font-mono flex items-center gap-1.5 pt-1 border-t border-apple-border/50">
          <span>Showing</span>
          <strong className="text-apple-blue font-bold">{filteredCount}</strong>
          <span>of {totalProfiles} profiles matching &ldquo;{filterQuery}&rdquo;</span>
        </div>
      )}
    </div>
  );
};
