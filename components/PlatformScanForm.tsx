'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { springs, microinteractions } from '@/lib/motion';

interface PlatformScanFormProps {
  platformName: string;
  platformSlug: string;
  sampleUsers: string[];
}

export const PlatformScanForm: React.FC<PlatformScanFormProps> = ({
  platformName,
  platformSlug,
  sampleUsers,
}) => {
  const [handle, setHandle] = useState('');
  const [scanAll, setScanAll] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#scan') {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleScan = (target?: string) => {
    const q = (target || handle).trim().replace(/^@/, '');
    if (!q) return;
    const targetUrl = scanAll
      ? `/?q=${encodeURIComponent(q)}`
      : `/?q=${encodeURIComponent(q)}&platform=${encodeURIComponent(platformSlug)}`;
    router.push(targetUrl);
  };

  return (
    <div
      id="scan"
      className="apple-card rounded-[22px] sm:rounded-[26px] p-5 sm:p-7 border border-apple-border space-y-4 shadow-apple-md scroll-mt-24"
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-apple-label-secondary">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span>Interactive Reconnaissance</span>
        </div>
        <h2 className="text-base sm:text-xl font-bold text-apple-label tracking-tight">
          Scan any handle on {platformName}
        </h2>
        <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
          Enter a handle to probe {platformName}&apos;s public registry in real time with passive reconnaissance.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleScan();
        }}
        className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-apple-label-tertiary font-mono text-sm pointer-events-none">
            @
          </span>
          <input
            ref={inputRef}
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder={`e.g. ${sampleUsers[0] || 'username'}`}
            className="w-full pl-8 pr-4 py-3 rounded-full bg-apple-well focus:bg-apple-card border border-apple-border focus:border-apple-blue/50 text-sm text-apple-label placeholder:text-apple-label-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all font-mono"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={microinteractions.buttonTap}
          transition={springs.snappy}
          className="px-6 py-3 rounded-full bg-apple-label text-apple-bg font-semibold text-xs sm:text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-apple-sm shrink-0 cursor-pointer"
        >
          <span>{scanAll ? 'Scan All 692+ Platforms' : `Scan ${platformName}`}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-apple-label-secondary hover:text-apple-label select-none">
          <input
            type="checkbox"
            checked={scanAll}
            onChange={(e) => setScanAll(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-apple-blue cursor-pointer"
          />
          <span>Also probe all 692+ other platforms simultaneously</span>
        </label>
      </div>

      {sampleUsers.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-medium text-apple-label-tertiary mr-1">
            Try sample targets:
          </span>
          {sampleUsers.map((user) => (
            <button
              key={user}
              type="button"
              onClick={() => handleScan(user)}
              className="px-2.5 py-1 rounded-full bg-apple-well hover:bg-apple-chip border border-apple-border text-[11px] font-mono text-apple-label-secondary hover:text-apple-label transition-colors"
            >
              @{user}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
