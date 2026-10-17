'use client';

import React, { useState } from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs, easings } from '@/lib/motion';

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
  const [isFocused, setIsFocused] = useState(false);

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
      {/* Floating Liquid Glass Unified Search Pill with animations.dev Spring Physics */}
      <motion.form
        onSubmit={handleSubmit}
        animate={{
          scale: isFocused ? 1.012 : 1,
          boxShadow: isFocused
            ? '0 8px 36px -4px rgba(0, 113, 227, 0.28), 0 0 0 1px rgba(0, 113, 227, 0.45)'
            : '0 4px 24px -2px rgba(0, 0, 0, 0.2)',
        }}
        transition={springs.smooth}
        className="liquid-glass rounded-full p-1.5 pl-4 sm:pl-5 flex items-center gap-2 border border-apple-border transition-colors duration-200"
      >
        <motion.div
          animate={{ scale: isFocused ? 1.1 : 1, color: isFocused ? 'rgb(var(--apple-blue))' : 'rgb(var(--apple-label-tertiary))' }}
          transition={springs.snappy}
          className="shrink-0 flex items-center justify-center"
        >
          <Search className="w-4 h-4" />
        </motion.div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search username or handle..."
          className="flex-1 bg-transparent text-apple-label placeholder:text-apple-label-tertiary text-xs sm:text-sm focus:outline-none min-w-0"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />

        {/* Clear query button with spring enter/exit */}
        <AnimatePresence>
          {query && (
            <motion.button
              key="clear-btn"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              whileTap={{ scale: 0.88 }}
              transition={springs.snappy}
              type="button"
              onClick={clearQuery}
              className="touch-target-expand w-6 h-6 rounded-full flex items-center justify-center text-apple-label-tertiary hover:text-apple-label hover:bg-apple-well transition-colors shrink-0"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Primary Action Button with Tactile Spring Feel */}
        <motion.button
          type="submit"
          disabled={isLoading || !query.trim()}
          whileHover={!isLoading && query.trim() ? { scale: 1.025 } : {}}
          whileTap={!isLoading && query.trim() ? { scale: 0.94 } : {}}
          transition={springs.snappy}
          className="bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[44px] rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer whitespace-nowrap overflow-hidden relative"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <motion.div
                key="loading-spinner"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15, ease: easings.emil }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
            ) : (
              <motion.div
                key="action-text"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: easings.emil }}
                className="flex items-center gap-1.5"
              >
                <span className="sm:hidden">Scan</span>
                <span className="hidden sm:inline">Investigate</span>
                <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.form>
    </div>
  );
};
