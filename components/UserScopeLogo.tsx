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
        {/* Premium Multi-Stop Smooth Gradient (Seamless, No Hard Facet Angles) */}
        <linearGradient id="prem-scope-bg" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1488ff" />
          <stop offset="28%" stopColor="#0066ff" />
          <stop offset="65%" stopColor="#3428e8" />
          <stop offset="100%" stopColor="#211082" />
        </linearGradient>

        {/* Soft Ambient Radial Specular Glow */}
        <radialGradient id="prem-scope-glow" cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </radialGradient>

        {/* Soft Icon Elevation Shadow */}
        <filter id="prem-scope-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2.2" floodColor="#070a24" floodOpacity="0.38" />
        </filter>

        {/* Smooth Continuous Apple Squircle Clip (Without Sharp Corners) */}
        <clipPath id="squircle-smooth-clip">
          <rect x="0" y="0" width="100" height="100" rx="26" ry="26" />
        </clipPath>
      </defs>

      {/* Clipped Smooth Squircle Body */}
      <g clipPath="url(#squircle-smooth-clip)">
        <rect x="0" y="0" width="100" height="100" fill="url(#prem-scope-bg)" />
        <rect x="0" y="0" width="100" height="100" fill="url(#prem-scope-glow)" />

        {/* Reticle and User Silhouette (Clean, Centered, Perfectly Balanced) */}
        <g filter="url(#prem-scope-shadow)">
          {/* Target Reticle Ring */}
          <circle cx="50" cy="50" r="21" stroke="#ffffff" strokeWidth="3.5" fill="none" />

          {/* Crosshair Ticks */}
          <line x1="50" y1="18.5" x2="50" y2="29.5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="70.5" x2="50" y2="81.5" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="18.5" y1="50" x2="29.5" y2="50" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="70.5" y1="50" x2="81.5" y2="50" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

          {/* User Head */}
          <circle cx="50" cy="43.5" r="7" fill="#ffffff" />

          {/* User Shoulders */}
          <path d="M 36 66.5 C 36 57.5, 41.5 54.5, 50 54.5 C 58.5 54.5, 64 57.5, 64 66.5 C 64 67.2, 36 67.2, 36 66.5 Z" fill="#ffffff" />
        </g>
      </g>
    </svg>
  );
};
