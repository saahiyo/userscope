'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const GuideQuickScan: React.FC<{ initialHandle?: string }> = ({ initialHandle = '' }) => {
  const [handle, setHandle] = useState(initialHandle);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = handle.trim();
    if (!trimmed) return;
    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-apple-card via-apple-well/60 to-apple-card border border-apple-border/80 shadow-apple-md">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-lg bg-apple-blue/10 text-apple-blue">
          <Sparkles className="w-4 h-4" />
        </span>
        <h4 className="text-sm font-semibold text-apple-label tracking-tight">
          Try It Yourself: Live Username Audit
        </h4>
      </div>
      <p className="text-xs text-apple-label-secondary mb-4 leading-relaxed">
        Check availability or trace existing public profiles across 650+ platforms with real-time streaming results.
      </p>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-label-tertiary" />
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Enter alias (e.g. quantum-dev, secops)..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-apple-bg border border-apple-border text-xs sm:text-sm text-apple-label placeholder:text-apple-label-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue/40 transition-all font-mono"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-apple-blue hover:bg-apple-blue/90 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition-all"
        >
          <span>Run Scan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </form>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-apple-label-tertiary">
        <ShieldCheck className="w-3.5 h-3.5 text-apple-green" />
        <span>100% free • No registration or login • Streams live over SSE</span>
      </div>
    </div>
  );
};
