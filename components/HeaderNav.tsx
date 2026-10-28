'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { UserScopeLogo } from '@/components/UserScopeLogo';
import { springs, microinteractions, easings } from '@/lib/motion';

import Link from 'next/link';

interface HeaderNavProps {
  onExport?: (format: 'json' | 'csv') => void;
  hasResults?: boolean;
  isScanning?: boolean;
  totalPlatforms?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onExport,
  hasResults = false,
  isScanning = false,
  totalPlatforms,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled
          ? 'bg-apple-bg/85 dark:bg-[#090a0c]/85 border-b border-apple-border shadow-apple-sm'
          : 'bg-apple-bg/70 dark:bg-[#090a0c]/70 border-b border-apple-border/50'
      }`}
    >
      {/* Subtle top sheen highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 dark:via-white/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Identity - Native Apple App Icon & Typography */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snappy}
            className="cursor-pointer"
          >
            <UserScopeLogo size={36} className="w-8 h-8 sm:w-9 sm:h-9 shadow-sm" />
          </motion.div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-sm sm:text-base md:text-lg tracking-tight text-apple-label leading-tight group-hover:text-apple-blue transition-colors">
                UserScope
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border leading-none">
                OSINT Studio
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-apple-label-tertiary hidden sm:block leading-tight mt-0.5">
              Public Profile Reconnaissance
            </p>
          </div>
        </Link>

        {/* Center / Right Controls: Directory, Engine Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Platform Directory Link */}
          <Link
            href="/platforms"
            className="px-3 py-1.5 rounded-full bg-apple-well/80 hover:bg-apple-chip text-xs font-medium text-apple-label-secondary hover:text-apple-label border border-apple-border transition-all shadow-apple-sm flex items-center gap-1.5 active:scale-95"
          >
            <span>Directory</span>
          </Link>

          {/* Engine Status Indicator */}
        {totalPlatforms !== undefined && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-well text-xs font-mono text-apple-label-secondary border border-apple-border">
            <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-apple-orange animate-ping' : 'bg-apple-green'}`} />
            <span>{totalPlatforms} Platforms Listed</span>
          </div>
        )}

          {/* Export Action Menu with Spring Enter & Tactile Taps */}
          <AnimatePresence>
            {hasResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 8 }}
                transition={springs.popover}
                className="flex items-center gap-1 bg-apple-well p-1 rounded-full border border-apple-border"
              >
                <motion.button
                  type="button"
                  whileTap={microinteractions.buttonTap}
                  whileHover={{ scale: 1.03 }}
                  transition={springs.snappy}
                  onClick={() => onExport?.('json')}
                  className="touch-target-expand px-2.5 py-1 text-xs font-medium text-apple-label-secondary hover:text-apple-label rounded-full hover:bg-apple-chip transition-colors flex items-center gap-1 shadow-apple-sm"
                  title="Export JSON report"
                >
                  <Download className="w-3 h-3" />
                  <span>JSON</span>
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={microinteractions.buttonTap}
                  whileHover={{ scale: 1.03 }}
                  transition={springs.snappy}
                  onClick={() => onExport?.('csv')}
                  className="touch-target-expand px-2.5 py-1 text-xs font-medium text-apple-label-secondary hover:text-apple-label rounded-full hover:bg-apple-chip transition-colors flex items-center gap-1 shadow-apple-sm"
                  title="Export CSV spreadsheet"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme Toggle Button with Tactile Spring Flip */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88, rotate: 18 }}
            transition={springs.snappy}
            onClick={toggleTheme}
            className="touch-target-expand w-9 h-9 rounded-full flex items-center justify-center text-apple-label-secondary hover:text-apple-label bg-apple-well hover:bg-apple-chip transition-colors border border-apple-border shadow-apple-sm cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle display appearance"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={springs.snappy}
              >
                {isDark ? <Sun className="w-4 h-4 text-apple-orange" /> : <Moon className="w-4 h-4 text-apple-blue" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
