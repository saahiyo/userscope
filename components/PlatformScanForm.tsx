'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  ShieldCheck,
  Globe,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs, microinteractions } from '@/lib/motion';
import { DiscoveredProfile, SearchStreamEvent } from '@/lib/osint/types';
import { PlatformFavicon } from '@/components/PlatformFavicon';

interface PlatformScanFormProps {
  platformName: string;
  platformSlug: string;
  sampleUsers: string[];
  domain?: string;
  urlPattern?: string;
  faviconUrl?: string;
}

type ScanStatus = 'idle' | 'scanning' | 'found' | 'not_found' | 'error';

export const PlatformScanForm: React.FC<PlatformScanFormProps> = ({
  platformName,
  platformSlug,
  sampleUsers,
  domain,
  urlPattern,
  faviconUrl,
}) => {
  const [handle, setHandle] = useState('');
  const [scanAll, setScanAll] = useState(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scannedHandle, setScannedHandle] = useState('');
  const [foundProfile, setFoundProfile] = useState<DiscoveredProfile | null>(null);
  const [timeElapsedMs, setTimeElapsedMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#scan') {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleScan = (target?: string) => {
    const q = (target || handle).trim().replace(/^@/, '');
    if (!q) return;

    // If user explicitly checked multi-platform probe, route to home scanner
    if (scanAll) {
      router.push(`/?q=${encodeURIComponent(q)}`);
      return;
    }

    // Close any previous stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setScannedHandle(q);
    setScanStatus('scanning');
    setFoundProfile(null);
    setErrorMessage(null);
    setTimeElapsedMs(null);

    const startTime = Date.now();
    let hitProfile: DiscoveredProfile | null = null;

    const streamUrl = `/api/search/stream?username=${encodeURIComponent(q)}&platform=${encodeURIComponent(platformSlug)}`;
    const eventSource = new EventSource(streamUrl);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const payload: SearchStreamEvent = JSON.parse(event.data);

        if (payload.type === 'hit' && payload.profile) {
          hitProfile = payload.profile;
          setFoundProfile(payload.profile);
          if (payload.timeElapsedMs) {
            setTimeElapsedMs(payload.timeElapsedMs);
          }
        }

        if (payload.type === 'complete') {
          eventSource.close();
          const elapsed = payload.timeElapsedMs || (Date.now() - startTime);
          setTimeElapsedMs(elapsed);
          if (hitProfile) {
            setScanStatus('found');
          } else {
            setScanStatus('not_found');
          }
        } else if (payload.type === 'error') {
          eventSource.close();
          setErrorMessage(payload.message || 'Scan probe encountered an error');
          setScanStatus('error');
        }
      } catch (err) {
        console.error('Failed to parse SSE payload', err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      if (!hitProfile) {
        setErrorMessage('Network or server connection interrupted');
        setScanStatus('error');
      }
    };
  };

  const cancelScan = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setScanStatus('idle');
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resolvedCheckedUrl = urlPattern
    ? urlPattern.replace('{username}', scannedHandle)
    : `https://${domain || platformSlug}.com/${scannedHandle}`;

  return (
    <div
      id="scan"
      className="apple-card rounded-[22px] sm:rounded-[26px] p-5 sm:p-7 border border-apple-border space-y-5 shadow-apple-md scroll-mt-24"
    >
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-apple-label-secondary">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span>Interactive Reconnaissance</span>
        </div>
        <h2 className="text-base sm:text-xl font-bold text-apple-label tracking-tight">
          Scan any handle on {platformName}
        </h2>
        <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
          Probe {platformName}&apos;s public registry in real time with passive reconnaissance — directly on this page.
        </p>
      </div>

      {/* Input Form */}
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
            disabled={scanStatus === 'scanning'}
            placeholder={`e.g. ${sampleUsers[0] || 'username'}`}
            className="w-full pl-8 pr-4 py-3 rounded-full bg-apple-well focus:bg-apple-card border border-apple-border focus:border-apple-blue/50 text-sm text-apple-label placeholder:text-apple-label-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all font-mono disabled:opacity-50"
          />
        </div>

        <motion.button
          type="submit"
          disabled={scanStatus === 'scanning'}
          whileHover={{ scale: scanStatus === 'scanning' ? 1 : 1.02 }}
          whileTap={scanStatus === 'scanning' ? undefined : microinteractions.buttonTap}
          transition={springs.snappy}
          className="px-6 py-3 rounded-full bg-apple-label text-apple-bg font-semibold text-xs sm:text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-apple-sm shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {scanStatus === 'scanning' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-apple-bg" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <span>{scanAll ? 'Scan All 692+ Platforms' : `Scan ${platformName}`}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      {/* Scan Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs">
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-apple-label-secondary hover:text-apple-label select-none">
          <input
            type="checkbox"
            checked={scanAll}
            onChange={(e) => setScanAll(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-apple-blue cursor-pointer"
          />
          <span>Redirect to main page to scan all 692+ platforms simultaneously</span>
        </label>
      </div>

      {/* Sample Targets */}
      {sampleUsers.length > 0 && scanStatus !== 'scanning' && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-medium text-apple-label-tertiary mr-1">
            Try sample targets:
          </span>
          {sampleUsers.map((user) => (
            <button
              key={user}
              type="button"
              onClick={() => {
                setHandle(user);
                handleScan(user);
              }}
              className="px-2.5 py-1 rounded-full bg-apple-well hover:bg-apple-chip border border-apple-border text-[11px] font-mono text-apple-label-secondary hover:text-apple-label transition-colors cursor-pointer"
            >
              @{user}
            </button>
          ))}
        </div>
      )}

      {/* Live Scan Results Section */}
      <AnimatePresence mode="wait">
        {scanStatus === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
            className="p-4 sm:p-5 rounded-[18px] bg-apple-well/90 border border-apple-border space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-apple-blue/10 border border-apple-blue/30 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 text-apple-blue animate-spin" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-apple-label">
                    Probing {platformName} for <span className="font-mono text-apple-blue">@{scannedHandle}</span>
                  </p>
                  <p className="text-[11px] text-apple-label-tertiary font-mono">
                    Checking {domain || platformName} endpoint passively...
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={cancelScan}
                className="px-3 py-1 rounded-full bg-apple-card hover:bg-apple-chip border border-apple-border text-xs text-apple-label-secondary hover:text-apple-label transition-colors"
              >
                Cancel
              </button>
            </div>
            <div className="w-full bg-apple-chip/50 h-1 rounded-full overflow-hidden">
              <div className="bg-apple-blue h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </motion.div>
        )}

        {scanStatus === 'found' && foundProfile && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
            className="p-4 sm:p-6 rounded-[20px] bg-apple-well border border-apple-green/40 space-y-4 shadow-sm"
          >
            {/* Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-apple-border/70 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-apple-green">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Public Account Detected on {platformName}</span>
              </div>
              {timeElapsedMs !== null && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-apple-green/10 text-apple-green border border-apple-green/20">
                  {timeElapsedMs}ms latency
                </span>
              )}
            </div>

            {/* Profile Identity Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-[14px] bg-apple-card border border-apple-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {foundProfile.avatarUrl ? (
                    <img
                      src={foundProfile.avatarUrl}
                      alt={`${foundProfile.username} avatar`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <PlatformFavicon
                      src={faviconUrl}
                      domain={domain}
                      alt={platformName}
                      className="w-6 h-6 object-contain"
                      fallbackSize={22}
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-apple-label font-mono truncate">
                      @{foundProfile.username}
                    </span>
                    {foundProfile.verified && (
                      <span className="px-1.5 py-0.2 rounded-full bg-apple-blue/15 text-apple-blue text-[10px] font-semibold">
                        Verified
                      </span>
                    )}
                  </div>
                  {foundProfile.displayName && (
                    <p className="text-xs text-apple-label-secondary truncate">
                      {foundProfile.displayName}
                    </p>
                  )}
                  {foundProfile.bio && (
                    <p className="text-xs text-apple-label-tertiary line-clamp-2 mt-0.5 max-w-md">
                      {foundProfile.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Direct Link Action */}
              <a
                href={foundProfile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-apple-label text-apple-bg font-semibold text-xs hover:opacity-95 transition-opacity inline-flex items-center justify-center gap-1.5 shadow-apple-sm shrink-0"
              >
                <span>Open Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Profile URL Box */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-[12px] bg-apple-card border border-apple-border text-xs font-mono">
              <span className="text-apple-label truncate select-all">
                {foundProfile.profileUrl}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(foundProfile.profileUrl)}
                className="inline-flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-md bg-apple-well hover:bg-apple-chip text-apple-label transition-colors shrink-0 cursor-pointer"
                title="Copy profile link"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-apple-green" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-apple-label-tertiary" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Escalation CTA */}
            <div className="pt-2 border-t border-apple-border/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <Link
                href={`/?q=${encodeURIComponent(scannedHandle)}`}
                className="inline-flex items-center gap-1.5 text-apple-blue hover:underline font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Search @{scannedHandle} across all 692+ other platforms</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setScanStatus('idle');
                  setFoundProfile(null);
                  inputRef.current?.focus();
                }}
                className="text-[11px] text-apple-label-secondary hover:text-apple-label transition-colors inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Scan another handle</span>
              </button>
            </div>
          </motion.div>
        )}

        {scanStatus === 'not_found' && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
            className="p-4 sm:p-5 rounded-[20px] bg-apple-well border border-apple-border space-y-3.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-apple-border/70 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-apple-label">
                <XCircle className="w-4 h-4 text-apple-label-tertiary shrink-0" />
                <span>No Public Account Found on {platformName}</span>
              </div>
              {timeElapsedMs !== null && (
                <span className="text-[11px] font-mono text-apple-label-tertiary">
                  Checked in {timeElapsedMs}ms
                </span>
              )}
            </div>

            <p className="text-xs text-apple-label-secondary leading-relaxed">
              No active public profile for <strong className="text-apple-label font-mono">@{scannedHandle}</strong> was returned by {platformName}&apos;s public registry endpoint.
            </p>

            <div className="p-2.5 rounded-[12px] bg-apple-card border border-apple-border font-mono text-xs text-apple-label-tertiary truncate">
              <span className="opacity-60">Tested endpoint: </span>
              <span className="text-apple-label select-all">{resolvedCheckedUrl}</span>
            </div>

            {/* Escalation CTA */}
            <div className="pt-2 border-t border-apple-border/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <Link
                href={`/?q=${encodeURIComponent(scannedHandle)}`}
                className="inline-flex items-center gap-1.5 text-apple-blue hover:underline font-medium"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Probe other 692+ registries for @{scannedHandle}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setScanStatus('idle');
                  inputRef.current?.focus();
                }}
                className="text-[11px] text-apple-label-secondary hover:text-apple-label transition-colors inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try another handle</span>
              </button>
            </div>
          </motion.div>
        )}

        {scanStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springs.snappy}
            className="p-4 sm:p-5 rounded-[20px] bg-apple-well border border-apple-red/40 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-apple-red">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Probe Interrupted</span>
            </div>
            <p className="text-xs text-apple-label-secondary">
              {errorMessage || 'Unable to complete probe against this platform.'}
            </p>
            <button
              type="button"
              onClick={() => handleScan(scannedHandle)}
              className="px-3.5 py-1.5 rounded-full bg-apple-card hover:bg-apple-chip border border-apple-border text-xs font-semibold text-apple-label transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Probe</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
