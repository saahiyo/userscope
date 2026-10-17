'use client';

import React from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { UserScopeLogo } from '@/components/UserScopeLogo';

interface HeaderNavProps {
  onExport: (format: 'json' | 'csv') => void;
  hasResults: boolean;
  isScanning: boolean;
  totalPlatforms: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onExport,
  hasResults,
  isScanning,
  totalPlatforms,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-transparent transition-colors duration-200 pt-safe">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Identity - Native Apple App Icon & Typography */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* UserScope Target Reticle Squircle Icon */}
          <UserScopeLogo size={36} className="w-8 h-8 sm:w-9 sm:h-9 shadow-sm" />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-sm sm:text-base md:text-lg tracking-tight text-apple-label leading-tight">
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
        </div>

        {/* Center / Right Controls: Engine Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-apple-well text-xs font-mono text-apple-label-secondary border border-apple-border">
            <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-apple-orange animate-ping' : 'bg-apple-green'}`} />
            <span>{totalPlatforms || 692} Engines Online</span>
          </div>

          {/* Export Action Menu */}
          {hasResults && (
            <div className="flex items-center gap-1 bg-apple-well p-1 rounded-full border border-apple-border">
              <button
                type="button"
                onClick={() => onExport('json')}
                className="touch-target-expand px-2.5 py-1 text-xs font-medium text-apple-label-secondary hover:text-apple-label rounded-full hover:bg-apple-chip transition-all flex items-center gap-1 shadow-apple-sm"
                title="Export JSON report"
              >
                <Download className="w-3 h-3" />
                <span>JSON</span>
              </button>
              <button
                type="button"
                onClick={() => onExport('csv')}
                className="touch-target-expand px-2.5 py-1 text-xs font-medium text-apple-label-secondary hover:text-apple-label rounded-full hover:bg-apple-chip transition-all flex items-center gap-1 shadow-apple-sm"
                title="Export CSV spreadsheet"
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="touch-target-expand w-9 h-9 rounded-full flex items-center justify-center text-apple-label-secondary hover:text-apple-label bg-apple-well hover:bg-apple-chip transition-all border border-apple-border shadow-apple-sm cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle display appearance"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
