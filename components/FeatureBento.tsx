'use client';

import React from 'react';
import { Zap, Network, History, Download, ShieldCheck, Database, ArrowUpRight } from 'lucide-react';

export const FeatureBento: React.FC = () => {
  return (
    <section className="space-y-6 pt-6 sm:pt-12">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border">
          Engine Architecture
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-apple-label">
          Built for High-Velocity Digital Investigation
        </h2>
        <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
          Engineered from the ground up for open-source investigators, security researchers, and developers.
        </p>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
        {/* Large Feature Card: Real-time Streaming */}
        <div className="md:col-span-2 apple-card rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 flex flex-col justify-between border border-apple-border relative overflow-hidden group">
          <div className="space-y-3 z-10">
            <div className="w-10 h-10 rounded-[12px] bg-apple-blue/15 text-apple-blue flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-apple-label tracking-tight">
                Concurrent SSE Streaming Telemetry
              </h3>
              <p className="text-xs sm:text-sm text-apple-label-secondary max-w-md leading-relaxed">
                Probe up to 700+ platform endpoints simultaneously. Hits stream back instantly over Server-Sent Events with millisecond-accurate telemetry as platforms confirm registration.
              </p>
            </div>
          </div>

          {/* Interactive Visual Element: Simulated Stream */}
          <div className="mt-5 pt-4 border-t border-apple-border grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-[12px] bg-apple-well/80 border border-apple-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
              <span className="text-apple-label font-medium truncate">github.com</span>
              <span className="text-[10px] text-apple-green ml-auto">120ms</span>
            </div>
            <div className="p-2.5 rounded-[12px] bg-apple-well/80 border border-apple-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
              <span className="text-apple-label font-medium truncate">gitlab.com</span>
              <span className="text-[10px] text-apple-green ml-auto">184ms</span>
            </div>
            <div className="p-2.5 rounded-[12px] bg-apple-well/80 border border-apple-border hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
              <span className="text-apple-label font-medium truncate">x.com</span>
              <span className="text-[10px] text-apple-green ml-auto">210ms</span>
            </div>
          </div>
        </div>

        {/* Small Feature Card: Zero Paywalls */}
        <div className="apple-card rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 flex flex-col justify-between border border-apple-border group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[12px] bg-apple-green/15 text-apple-green flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-apple-label tracking-tight">
                100% Free & Open OSINT
              </h3>
              <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
                Zero signups, credit counters, or gated results. Direct access to public platform endpoints with no subscription paywalls.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-apple-border flex items-center justify-between text-xs font-medium text-apple-green">
            <span>Unlimited Lookups</span>
            <span className="text-[10px] font-mono uppercase bg-apple-green/10 px-2 py-0.5 rounded-full">
              No API Keys
            </span>
          </div>
        </div>

        {/* Small Feature Card: Multimodal Views */}
        <div className="apple-card rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 flex flex-col justify-between border border-apple-border group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[12px] bg-apple-purple/15 text-apple-purple flex items-center justify-center shadow-sm">
              <Network className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-apple-label tracking-tight">
                Tri-Modal Visual Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
                Seamlessly pivot between high-density Masonry Cards, force-directed Relationship Graphs, and chronological Presence Timelines.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-apple-border flex items-center gap-1.5 text-xs text-apple-label-secondary font-mono">
            <span className="px-2 py-0.5 rounded-full bg-apple-well border border-apple-border">Grid</span>
            <span className="px-2 py-0.5 rounded-full bg-apple-well border border-apple-border">Graph</span>
            <span className="px-2 py-0.5 rounded-full bg-apple-well border border-apple-border">Timeline</span>
          </div>
        </div>

        {/* Medium Feature Card: Data Portability */}
        <div className="md:col-span-2 apple-card rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 flex flex-col justify-between border border-apple-border group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-[12px] bg-apple-orange/15 text-apple-orange flex items-center justify-center shadow-sm">
              <Download className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-apple-label tracking-tight">
                Instant Structured Intelligence Export
              </h3>
              <p className="text-xs sm:text-sm text-apple-label-secondary max-w-lg leading-relaxed">
                Export all confirmed profiles with canonical URLs, discovered bio fragments, avatar assets, and timestamps in standardized JSON or spreadsheet-ready CSV.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-apple-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-apple-label bg-apple-well px-2.5 py-1 rounded-full border border-apple-border flex items-center gap-1">
              <span>.json</span>
              <span className="text-[10px] text-apple-label-secondary">Structured Schema</span>
            </span>
            <span className="text-xs font-mono text-apple-label bg-apple-well px-2.5 py-1 rounded-full border border-apple-border flex items-center gap-1">
              <span>.csv</span>
              <span className="text-[10px] text-apple-label-secondary">Excel / Sheets ready</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
