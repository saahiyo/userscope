'use client';

import React from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';

interface SearchPillProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchPill: React.FC<SearchPillProps> = ({
  query,
  setQuery,
  onSearch,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch();
    }
  };

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-1 sm:px-0">
      {/* Floating Liquid Glass Unified Search Pill */}
      <form
        onSubmit={handleSubmit}
        className="liquid-glass rounded-full p-1.5 pl-4 sm:pl-5 flex items-center gap-2 shadow-apple-card shadow-[0_4px_30px_rgba(0,0,0,0.25)] dark:shadow-[0_0_50px_-10px_rgba(10,132,255,0.25)] border border-apple-border focus-within:ring-2 focus-within:ring-apple-blue/40 focus-within:border-apple-blue transition-all"
      >
        <Search className="w-4 h-4 text-apple-label-tertiary shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search username or handle..."
          className="flex-1 bg-transparent text-apple-label placeholder:text-apple-label-tertiary text-xs sm:text-sm focus:outline-none min-w-0"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />

        {/* Clear query button */}
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="touch-target-expand w-6 h-6 rounded-full flex items-center justify-center text-apple-label-tertiary hover:text-apple-label hover:bg-apple-well transition-colors shrink-0"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Primary Action Button (Apple System Blue) */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[44px] rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all duration-150 active:scale-95 shadow-sm cursor-pointer whitespace-nowrap"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="sm:hidden">Scan</span>
              <span className="hidden sm:inline">Investigate</span>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
