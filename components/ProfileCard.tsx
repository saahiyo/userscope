'use client';

import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, ChevronDown, ChevronUp, MapPin, Mail, Calendar, Sparkles } from 'lucide-react';
import { DiscoveredProfile } from '@/lib/osint/types';
import { decodeHtmlEntities } from '@/lib/utils/text';
import { getCategoryToken } from '@/lib/theme/categoryTokens';

interface ProfileCardProps {
  profile: DiscoveredProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const extraEntries = profile.extraFields ? Object.entries(profile.extraFields) : [];
  const categoryToken = getCategoryToken(profile.category);

  return (
    <div className="@container w-full">
      <div className="apple-card apple-card-interactive rounded-apple-card p-4 sm:p-5 flex flex-col group relative overflow-hidden transition-all">
        <div className="space-y-4">
          {/* Banner if available */}
          {profile.bannerUrl && (
            <div className="h-16 w-full -mt-4 sm:-mt-5 -mx-4 sm:-mx-5 mb-2 overflow-hidden rounded-t-apple-card relative border-b border-apple-border">
              <img
                src={profile.bannerUrl}
                alt="Profile banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Top Header Row: Platform Name, Category Tag, & Outbound Link */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wider uppercase text-apple-label">
                {profile.platform}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border shadow-sm ${categoryToken.badgeClass}`}
              >
                {categoryToken.label}
              </span>
            </div>

            {/* Apple Action Capsule Button */}
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target-expand inline-flex items-center gap-1.5 px-3.5 py-1.5 min-h-[36px] rounded-full bg-apple-blue/15 hover:bg-apple-blue text-apple-blue hover:text-white border border-apple-blue/25 text-xs font-semibold transition-all duration-150 active:scale-95 shadow-sm"
              title={`Open ${profile.platform} profile`}
              aria-label={`Open ${profile.platform} profile`}
            >
              <span>Open</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Container-adaptive content area: stacks vertically on small containers, flexes horizontally on @md+ */}
          <div className="@md:flex @md:items-start @md:gap-5 space-y-3 @md:space-y-0">
            {/* Identity Row: Apple Squircle Avatar, Names, Handle */}
            <div className="flex items-start gap-3.5 @md:w-64 shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || profile.username}
                  className="w-12 h-12 rounded-[14px] object-cover border border-white/10 shrink-0 shadow-md bg-apple-well"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-apple-well to-apple-chip border border-white/10 flex items-center justify-center font-bold text-sm text-apple-label shrink-0 shadow-md">
                  {profile.platform.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-apple-label truncate tracking-tight">
                  {decodeHtmlEntities(profile.displayName) || profile.username}
                </h3>
                <p className="text-xs font-mono text-apple-label-secondary truncate">
                  @{profile.username}
                </p>

                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-apple-green">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Verified profile</span>
                </div>
              </div>
            </div>

            {/* Middle & Right Section in wide containers: Bio & Discovered Attributes */}
            <div className="flex-1 space-y-3 min-w-0">
              {/* Bio Snippet */}
              {profile.bio && (
                <p className="text-xs text-apple-label-secondary line-clamp-3 leading-relaxed">
                  {decodeHtmlEntities(profile.bio)}
                </p>
              )}

              {/* Social Metrics */}
              {(profile.followers !== undefined || profile.following !== undefined || profile.posts !== undefined) && (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <div className="flex items-center gap-3.5 px-3 py-1.5 rounded-[12px] apple-tile text-xs text-apple-label-secondary w-full @sm:w-auto">
                    {profile.followers !== undefined && (
                      <span>
                        <strong className="text-apple-label font-semibold">{profile.followers}</strong> <span className="text-[11px] text-apple-label-tertiary">followers</span>
                      </span>
                    )}
                    {profile.following !== undefined && (
                      <span>
                        <strong className="text-apple-label font-semibold">{profile.following}</strong> <span className="text-[11px] text-apple-label-tertiary">following</span>
                      </span>
                    )}
                    {profile.posts !== undefined && (
                      <span>
                        <strong className="text-apple-label font-semibold">{profile.posts}</strong> <span className="text-[11px] text-apple-label-tertiary">posts</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Key Discovered Attributes (Location, Email, Join Date) */}
              {(profile.location || profile.email || profile.joinedDate) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-apple-label-secondary">
                  {profile.location && (
                    <div className="flex items-center gap-1.5 truncate max-w-full">
                      <MapPin className="w-3.5 h-3.5 text-apple-blue shrink-0" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-1.5 truncate font-mono max-w-full">
                      <Mail className="w-3.5 h-3.5 text-apple-orange shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                  )}
                  {profile.joinedDate && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-apple-label-tertiary shrink-0" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Raw Metadata Accordion */}
        <div className="mt-4 pt-3 border-t border-apple-border">
          {extraEntries.length > 0 ? (
            <div>
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="touch-target-expand w-full flex items-center justify-between text-xs text-apple-label-secondary hover:text-apple-label transition-colors font-medium py-1.5"
              >
                <span>Raw metadata ({extraEntries.length})</span>
                {showTechnicalDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showTechnicalDetails && (
                <div className="mt-2 p-3 apple-tile rounded-[12px] text-xs space-y-1.5 font-mono text-apple-label-secondary animate-fade-in">
                  {extraEntries.map(([key, val]) => (
                    <div key={key} className="flex justify-between items-start gap-2">
                      <span className="text-apple-label-tertiary">{key}:</span>
                      <span className="text-apple-label text-right break-all">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-apple-label-tertiary">
              Verified via public API
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
