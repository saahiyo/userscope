'use client';

import React from 'react';
import { Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { springs } from '@/lib/motion';

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
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={springs.smooth}
      className="w-full max-w-2xl mx-auto bg-apple-card border border-apple-border rounded-apple-lg p-3.5 shadow-apple-sm space-y-2"
    >
      <div className="flex items-center justify-between text-xs text-apple-label-secondary">
        <span className="flex items-center gap-2 font-medium text-apple-label">
          <Radio className="w-3.5 h-3.5 text-apple-blue animate-pulse" />
          <span>Active Registry Sweep...</span>
        </span>
        <span className="font-mono text-apple-label-tertiary">
          <strong className="text-apple-label font-semibold">{checkedCount}</strong> / {totalCount} scanned
          <span className="mx-1.5 opacity-40">·</span>
          <motion.strong
            key={hitsCount}
            initial={{ scale: 1.3, color: 'rgb(var(--apple-green))' }}
            animate={{ scale: 1, color: 'rgb(var(--apple-blue))' }}
            transition={springs.bouncy}
            className="font-semibold inline-block"
          >
            {hitsCount} hits
          </motion.strong>
          <span className="mx-1.5 opacity-40">·</span>
          {timeElapsed}s
        </span>
      </div>

      <div className="w-full bg-apple-well h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="bg-apple-blue h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={springs.smooth}
        />
      </div>
    </motion.div>
  );
};
