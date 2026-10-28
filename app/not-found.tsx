'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Radio, 
  Search, 
  ArrowRight, 
  Compass, 
  Home, 
  Terminal, 
  ShieldAlert, 
  Sparkles, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { HeaderNav } from '@/components/HeaderNav';
import { LandingFooter } from '@/components/LandingFooter';
import { springs, microinteractions } from '@/lib/motion';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export default function NotFound() {
  const router = useRouter();
  const isReducedMotion = useReducedMotion();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg text-apple-label antialiased relative overflow-x-clip selection:bg-apple-blue/20 selection:text-apple-blue">
      {/* Liquid Glass Header */}
      <HeaderNav />

      {/* Background Ambient Radar Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(10, 132, 255, 0.15) 0%, transparent 70%), radial-gradient(circle, rgba(140, 140, 145, 0.15) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 32px 32px',
        }}
        aria-hidden="true"
      />

      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center text-center space-y-10">
        {/* Animated Radar Beacon Reticle */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Radar Rings */}
          <div 
            className={`absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-apple-blue/20 ${
              isReducedMotion ? '' : 'animate-ping opacity-20'
            }`}
            style={{ animationDuration: '3s' }}
          />
          <div 
            className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-apple-blue/30 ${
              isReducedMotion ? '' : 'animate-pulse'
            }`}
          />
          <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-dashed border-apple-blue/40" />

          {/* Central Beacon Hub */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springs.smooth}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-apple-hero bg-apple-well/90 border border-apple-blue/40 backdrop-blur-xl shadow-apple-glow flex flex-col items-center justify-center gap-1 relative z-10"
          >
            <Radio className="w-8 h-8 sm:w-9 sm:h-9 text-apple-blue animate-pulse" />
            <span className="text-[9px] font-mono font-bold tracking-widest text-apple-blue uppercase">
              LOST SIGNAL
            </span>
          </motion.div>
        </div>

        {/* Hero Title & Telemetry Status */}
        <div className="space-y-3.5 max-w-xl mx-auto">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.snappy}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-red/10 border border-apple-red/25 text-apple-red text-xs font-mono font-semibold shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-apple-red animate-ping" />
            <span>ERR_TARGET_NOT_LOCATED · HTTP 404</span>
          </motion.div>

          {/* Giant Typography Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springs.smooth}
            className="space-y-2"
          >
            <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-apple-label via-apple-label to-apple-label-secondary">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-apple-label">
              Target Vector Outside Monitored Grid
            </h2>
            <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed max-w-lg mx-auto">
              The platform route, dossier endpoint, or OSINT entity you requested does not exist on our servers, has been quarantined, or was relocated.
            </p>
          </motion.div>
        </div>

        {/* Quick Search Recovery Bar */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.1 }}
          className="w-full max-w-md relative group"
        >
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-4 text-apple-label-tertiary group-focus-within:text-apple-blue transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search handle or return to radar (e.g. torvalds)..."
              className="w-full pl-11 pr-24 py-3 bg-apple-card border border-apple-border rounded-full text-xs sm:text-sm text-apple-label placeholder:text-apple-label-tertiary shadow-apple-card focus:outline-none focus:border-apple-blue/60 focus:ring-2 focus:ring-apple-blue/20 transition-all font-mono"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3.5 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span>Scan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.form>

        {/* Interactive Tactical Navigation Tiles (Apple Bento Style) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl text-left"
        >
          {/* Tile 1: Home Radar */}
          <Link
            href="/"
            className="apple-card rounded-apple-lg p-4 border border-apple-border hover:border-apple-border-strong hover:scale-[1.02] transition-all flex flex-col justify-between group shadow-apple-card"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-apple-sm bg-apple-blue/10 border border-apple-blue/20 flex items-center justify-center text-apple-blue group-hover:scale-105 transition-transform">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-apple-label group-hover:text-apple-blue transition-colors flex items-center justify-between">
                  <span>Radar Overview</span>
                  <ChevronRight className="w-3.5 h-3.5 text-apple-label-tertiary group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-[11px] text-apple-label-secondary mt-0.5 leading-relaxed">
                  Username reconnaissance across public platforms.
                </p>
              </div>
            </div>
          </Link>

          {/* Tile 2: Platform Directory */}
          <Link
            href="/platforms"
            className="apple-card rounded-apple-lg p-4 border border-apple-border hover:border-apple-border-strong hover:scale-[1.02] transition-all flex flex-col justify-between group shadow-apple-card"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-apple-sm bg-apple-purple/10 border border-apple-purple/20 flex items-center justify-center text-apple-purple group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-apple-label group-hover:text-apple-purple transition-colors flex items-center justify-between">
                  <span>Platforms Catalog</span>
                  <ChevronRight className="w-3.5 h-3.5 text-apple-label-tertiary group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-[11px] text-apple-label-secondary mt-0.5 leading-relaxed">
                  Browse the platform directory and filter by name or category.
                </p>
              </div>
            </div>
          </Link>

          {/* Tile 3: Sample Recon Scan */}
          <Link
            href="/?q=torvalds"
            className="apple-card rounded-apple-lg p-4 border border-apple-border hover:border-apple-border-strong hover:scale-[1.02] transition-all flex flex-col justify-between group shadow-apple-card"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-apple-sm bg-apple-green/10 border border-apple-green/20 flex items-center justify-center text-apple-green group-hover:scale-105 transition-transform">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-apple-label group-hover:text-apple-green transition-colors flex items-center justify-between">
                  <span>Sample Intel Scan</span>
                  <ChevronRight className="w-3.5 h-3.5 text-apple-label-tertiary group-hover:translate-x-0.5 transition-transform" />
                </h3>
                <p className="text-[11px] text-apple-label-secondary mt-0.5 leading-relaxed">
                  Stream verified footprint telemetry for @torvalds.
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Telemetry Diagnostics Footer Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-mono text-apple-label-tertiary">
          <span className="px-2.5 py-1 rounded-full bg-apple-well border border-apple-border">
            HTTPS ENABLED
          </span>
          <span className="px-2.5 py-1 rounded-full bg-apple-well border border-apple-border">
            PUBLIC PROFILE CHECKS
          </span>
          <span className="px-2.5 py-1 rounded-full bg-apple-well border border-apple-border">
            SERVER-PROCESSED SCANS
          </span>
        </div>
      </main>

      {/* Standard Footer */}
      <LandingFooter />
    </div>
  );
}
