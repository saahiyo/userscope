import React from 'react';

interface UserScopeLogoProps {
  size?: number;
  className?: string;
}

export const UserScopeLogo: React.FC<UserScopeLogoProps> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      aria-label="UserScope Logo"
    >
      <defs>
        {/* Base Gradient: Vibrant Azure Blue to Deep Royal Violet */}
        <linearGradient id="scope-bg-grad" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#006aff" />
          <stop offset="42%" stopColor="#0052e6" />
          <stop offset="78%" stopColor="#3020c8" />
          <stop offset="100%" stopColor="#49139e" />
        </linearGradient>

        {/* Diagonal Facet Light: Apple-style Refraction */}
        <linearGradient id="scope-facet-grad" x1="40" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1e105e" stopOpacity="0.5" />
        </linearGradient>

        {/* Glass Ambient Specular Sheen */}
        <linearGradient id="scope-sheen" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="65%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        {/* 45-degree Soft Long Shadow from Icon */}
        <linearGradient id="scope-cast-shadow" x1="50" y1="50" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </linearGradient>

        {/* Icon Drop Shadow */}
        <filter id="scope-icon-elevation" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.32" />
        </filter>

        {/* Squircle Clip Mask */}
        <clipPath id="scope-squircle-clip">
          <rect x="0" y="0" width="100" height="100" rx="22.5" />
        </clipPath>
      </defs>

      {/* Clipped Squircle Container */}
      <g clipPath="url(#scope-squircle-clip)">
        {/* Background Base */}
        <rect x="0" y="0" width="100" height="100" fill="url(#scope-bg-grad)" />

        {/* Top-right to bottom-right diagonal faceted planes */}
        <path d="M 50 0 L 100 0 L 100 70 L 65 100 L 40 100 Z" fill="url(#scope-facet-grad)" />
        <path d="M 68 0 L 100 0 L 100 40 Z" fill="#ffffff" opacity="0.06" />

        {/* Ambient Glass Sheen */}
        <rect x="0" y="0" width="100" height="100" fill="url(#scope-sheen)" />

        {/* Diagonal Cast Shadow from Icon towards bottom-right */}
        <path d="M 50 50 L 85 85 L 65 100 L 35 100 L 50 50 Z" fill="url(#scope-cast-shadow)" opacity="0.6" />

        {/* Reticle and User Silhouette */}
        <g filter="url(#scope-icon-elevation)">
          {/* Outer Target Ring */}
          <circle cx="50" cy="50" r="21.5" stroke="#ffffff" strokeWidth="3.6" fill="none" />

          {/* Crosshair Ticks */}
          <line x1="50" y1="18" x2="50" y2="30" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="50" y1="70" x2="50" y2="82" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="18" y1="50" x2="30" y2="50" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" />
          <line x1="70" y1="50" x2="82" y2="50" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" />

          {/* User Head Circle */}
          <circle cx="50" cy="43.5" r="7.2" fill="#ffffff" />

          {/* User Shoulders / Bust */}
          <path d="M 35.5 67 C 35.5 57.5, 41.5 54, 50 54 C 58.5 54, 64.5 57.5, 64.5 67 C 64.5 67.8, 35.5 67.8, 35.5 67 Z" fill="#ffffff" />
        </g>
      </g>
    </svg>
  );
};
