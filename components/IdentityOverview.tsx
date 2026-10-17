'use client';

import React, { useState, useMemo } from 'react';
import { SearchAggregatedSummary } from '@/lib/osint/types';
import { cleanDisplayName, cleanLocation } from '@/lib/utils/text';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  Image as ImageIcon, 
  MapPin, 
  Mail, 
  Tag, 
  AtSign, 
  Copy, 
  Check, 
  ExternalLink,
  X
} from 'lucide-react';
import { springs, microinteractions, easings } from '@/lib/motion';

interface IdentityOverviewProps {
  summary: SearchAggregatedSummary;
  targetUsername: string;
  totalFound: number;
  timeElapsed: number;
  firstSeen?: string;
  lastSeen?: string;
}

export const IdentityOverview: React.FC<IdentityOverviewProps> = ({
  summary,
  targetUsername,
  totalFound,
  timeElapsed,
  firstSeen = 'Jun 16, 2018',
  lastSeen = 'Aug 26, 2026',
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showAllNames, setShowAllNames] = useState(false);

  const profilePics = summary.profilePictures || [];

  // Filter out web scrapings, generic titles, and duplicates from names
  const names = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    (summary.names || []).forEach((raw) => {
      const cleaned = cleanDisplayName(raw, targetUsername);
      if (cleaned && !seen.has(cleaned.toLowerCase())) {
        seen.add(cleaned.toLowerCase());
        list.push(cleaned);
      }
    });
    return list;
  }, [summary.names, targetUsername]);

  // Clean and deduplicate locations
  const locations = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    (summary.locations || []).forEach((raw) => {
      const cleaned = cleanLocation(raw);
      if (cleaned && !seen.has(cleaned.toLowerCase())) {
        seen.add(cleaned.toLowerCase());
        list.push(cleaned);
      }
    });
    return list;
  }, [summary.locations]);

  // Clean and deduplicate emails
  const emails = useMemo(() => {
    const seen = new Set<string>();
    return (summary.emails || []).filter((e) => {
      if (!e || seen.has(e.toLowerCase())) return false;
      seen.add(e.toLowerCase());
      return true;
    });
  }, [summary.emails]);

  // Clean handles
  const usernames = useMemo(() => {
    const rawList = summary.usernames?.length > 0 ? summary.usernames : [targetUsername];
    const seen = new Set<string>();
    return rawList.filter((u) => {
      if (!u || seen.has(u.toLowerCase())) return false;
      seen.add(u.toLowerCase());
      return true;
    });
  }, [summary.usernames, targetUsername]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 1800);
  };

  const visibleNames = showAllNames ? names : names.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.smooth}
      className="w-full apple-card rounded-apple-hero p-5 sm:p-6 space-y-5 relative overflow-hidden border border-apple-border shadow-apple-card"
    >
      {/* Header Row: Target Handle & High-level Intelligence Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-apple-border gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-apple-md bg-gradient-to-br from-apple-blue/25 to-apple-blue/5 border border-apple-blue/30 flex items-center justify-center text-apple-blue shrink-0 shadow-sm">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-apple-label">
                @{targetUsername}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-apple-green/15 text-apple-green border border-apple-green/30 tracking-wider shadow-sm">
                Verified Footprint
              </span>
            </div>
            <p className="text-xs text-apple-label-secondary font-medium mt-0.5">
              Public footprint profile & digital identity anchors
            </p>
          </div>
        </div>

        {/* Telemetry pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-apple-label-secondary">
          <span className="px-3 py-1.5 rounded-full apple-tile font-medium text-apple-label shadow-sm">
            <strong className="text-apple-blue font-bold">{totalFound}</strong> profiles identified
          </span>
          <span className="px-3 py-1.5 rounded-full apple-tile shadow-sm">
            {timeElapsed}s scan
          </span>
          <span className="px-3 py-1.5 rounded-full apple-tile text-[11px] shadow-sm">
            Active {firstSeen} &rarr; {lastSeen}
          </span>
        </div>
      </div>

      {/* Discovered Profile Avatars Gallery */}
      {profilePics.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-apple-label-secondary">
            <span className="flex items-center gap-1.5 font-semibold text-apple-label">
              <ImageIcon className="w-4 h-4 text-apple-blue" />
              <span>Discovered Avatars ({profilePics.length})</span>
            </span>
            <span className="text-[11px] text-apple-label-tertiary">Select to inspect</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5">
            {profilePics.map((pic, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={springs.snappy}
                onClick={() => setSelectedImage(pic)}
                className="relative group shrink-0 focus:outline-none"
                title="View full-size photo"
              >
                <img
                  src={pic}
                  alt={`Avatar ${idx + 1}`}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-apple-md object-cover border border-white/10 group-hover:border-apple-blue group-hover:ring-2 group-hover:ring-apple-blue/30 transition-colors shadow-md bg-apple-well"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Balanced Identity Intelligence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-0.5 items-stretch">
        {/* 1. Confirmed Names / Aliases */}
        <div className="p-3.5 sm:p-4 rounded-apple-card apple-tile flex flex-col justify-between space-y-3 min-h-[110px] border border-apple-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-apple-xs bg-apple-purple/15 text-apple-purple flex items-center justify-center">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-apple-label-secondary uppercase tracking-wider">
                Display Names
              </span>
            </div>
            {names.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-purple/15 text-apple-purple font-semibold">
                {names.length}
              </span>
            )}
          </div>

          <motion.div layout className="flex-1 flex flex-col justify-center">
            {names.length > 0 ? (
              <motion.div layout className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-0.5">
                {visibleNames.map((n, idx) => (
                  <span
                    key={idx}
                    className="apple-chip px-2.5 py-1 rounded-full text-xs font-medium text-apple-label shadow-sm"
                  >
                    {n}
                  </span>
                ))}
                {names.length > 4 && (
                  <motion.button
                    type="button"
                    whileTap={microinteractions.chipTap}
                    onClick={() => setShowAllNames(!showAllNames)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-apple-blue hover:bg-apple-blue/15 border border-apple-blue/30 transition-colors"
                  >
                    {showAllNames ? 'Show less' : `+${names.length - 4} more`}
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <span className="text-xs text-apple-label-tertiary italic">
                No alternate aliases listed
              </span>
            )}
          </motion.div>
        </div>

        {/* 2. Confirmed Usernames */}
        <div className="p-3.5 sm:p-4 rounded-apple-card apple-tile flex flex-col justify-between space-y-3 min-h-[110px] border border-apple-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-apple-xs bg-apple-blue/15 text-apple-blue flex items-center justify-center">
                <AtSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-apple-label-secondary uppercase tracking-wider">
                Known Handles
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-blue/15 text-apple-blue font-semibold">
              {usernames.length}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-0.5">
              {usernames.map((u, idx) => {
                const isCopied = copiedKey === `handle-${u}`;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileTap={microinteractions.chipTap}
                    whileHover={{ scale: 1.02 }}
                    transition={springs.snappy}
                    onClick={() => handleCopy(`@${u}`, `handle-${u}`)}
                    className="apple-chip group px-2.5 py-1 rounded-full text-xs font-mono text-apple-label flex items-center gap-1.5 hover:border-apple-blue/40 shadow-sm transition-all"
                    title="Click to copy handle"
                  >
                    <span>@{u}</span>
                    <AnimatePresence mode="wait" initial={false}>
                      {isCopied ? (
                        <motion.span
                          key="copied"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={springs.bouncy}
                        >
                          <Check className="w-3 h-3 text-apple-green" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Copy className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Public Emails */}
        <div className="p-3.5 sm:p-4 rounded-apple-card apple-tile flex flex-col justify-between space-y-3 min-h-[110px] border border-apple-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-apple-xs bg-apple-orange/15 text-apple-orange flex items-center justify-center">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-apple-label-secondary uppercase tracking-wider">
                Public Emails
              </span>
            </div>
            {emails.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-orange/15 text-apple-orange font-semibold">
                {emails.length}
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {emails.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-0.5">
                {emails.map((email, idx) => {
                  const isCopied = copiedKey === `email-${email}`;
                  return (
                    <motion.button
                      key={idx}
                      type="button"
                      whileTap={microinteractions.chipTap}
                      whileHover={{ scale: 1.02 }}
                      transition={springs.snappy}
                      onClick={() => handleCopy(email, `email-${email}`)}
                      className="apple-chip group px-2.5 py-1 rounded-full text-xs font-mono text-apple-label truncate max-w-full flex items-center gap-1.5 hover:border-apple-orange/40 shadow-sm transition-all"
                      title={email}
                    >
                      <span className="truncate">{email}</span>
                      <AnimatePresence mode="wait" initial={false}>
                        {isCopied ? (
                          <motion.span
                            key="copied-email"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={springs.bouncy}
                          >
                            <Check className="w-3 h-3 text-apple-green shrink-0" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy-email"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <Copy className="w-3 h-3 opacity-40 group-hover:opacity-100 shrink-0 transition-opacity" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs text-apple-label-tertiary italic">
                No public email found
              </span>
            )}
          </div>
        </div>

        {/* 4. Discovered Locations */}
        <div className="p-3.5 sm:p-4 rounded-apple-card apple-tile flex flex-col justify-between space-y-3 min-h-[110px] border border-apple-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-apple-xs bg-apple-green/15 text-apple-green flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-apple-label-secondary uppercase tracking-wider">
                Locations
              </span>
            </div>
            {locations.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-green/15 text-apple-green font-semibold">
                {locations.length}
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {locations.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-0.5">
                {locations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="apple-chip px-2.5 py-1 rounded-full text-xs text-apple-label flex items-center gap-1 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-apple-green" />
                    <span>{loc}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-apple-label-tertiary italic">
                No location listed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal with animations.dev Spring Popover */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easings.emil }}
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 8 }}
              transition={springs.popover}
              onClick={(e) => e.stopPropagation()}
              className="apple-card rounded-apple-hero p-5 max-w-sm w-full space-y-4 text-center shadow-2xl border border-apple-border relative"
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-apple-well text-apple-label-secondary hover:text-apple-label flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={selectedImage}
                alt="Avatar Full Preview"
                className="w-48 h-48 mx-auto rounded-apple-card object-cover border border-white/10 shadow-lg bg-apple-well"
              />
              <div className="flex justify-between items-center pt-1">
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-apple-blue hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open full image</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <motion.button
                  type="button"
                  whileTap={microinteractions.buttonTap}
                  onClick={() => setSelectedImage(null)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full apple-chip text-apple-label hover:border-apple-border"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
