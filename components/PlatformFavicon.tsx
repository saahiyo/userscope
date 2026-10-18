'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface PlatformFaviconProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSize?: number;
}

export const PlatformFavicon: React.FC<PlatformFaviconProps> = ({
  src,
  alt,
  className = 'w-5 h-5 object-contain',
  fallbackSize = 18,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <Globe className="text-apple-label-tertiary opacity-70" size={fallbackSize} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};
