'use client';

import React from 'react';
import { Loader2, Radio } from 'lucide-react';

interface ScanProgressProps {
  checkedCount: number;
  totalCount: number;
  hitsCount: number;
  timeElapsed: number;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  checkedCount,
  totalCount,
  hitsCount,
  timeElapsed,
}) => {
  const percentage = totalCount > 0 ? Math.min(100, Math.round((checkedCount / totalCount) * 100)) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-apple-card border border-apple-border rounded-apple-lg p-3.5 shadow-apple-sm space-y-2 animate-fade-in">
      <div className="flex items-center justify-between text-xs text-apple-label-secondary">
        <span className="flex items-center gap-2 font-medium text-apple-label">
          <Radio className="w-3.5 h-3.5 text-apple-blue animate-pulse" />
          <span>Active Registry Sweep...</span>
        </span>
        <span className="font-mono text-apple-label-tertiary">
          <strong className="text-apple-label font-semibold">{checkedCount}</strong> / {totalCount} scanned
          <span className="mx-1.5 opacity-40">·</span>
          <strong className="text-apple-blue font-semibold">{hitsCount} hits</strong>
          <span className="mx-1.5 opacity-40">·</span>
          {timeElapsed}s
        </span>
      </div>

      <div className="w-full bg-apple-well h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-apple-blue h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
