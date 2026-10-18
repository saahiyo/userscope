'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

export function resolveFaviconUrl(options: {
  src?: string;
  url?: string;
  domain?: string;
  name?: string;
}): string | null {
  if (options.src && options.src.trim()) return options.src;

  let domain = options.domain;
  if (!domain && options.url) {
    try {
      if (!options.url.startsWith('mailto:')) {
        const formatted = options.url.startsWith('http') ? options.url : `https://${options.url}`;
        const u = new URL(formatted);
        domain = u.hostname.replace(/^www\./, '');
      }
    } catch {
      // ignore invalid URLs
    }
  }

  if (domain && domain !== 'web' && domain.includes('.')) {
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`;
  }

  return null;
}

interface PlatformFaviconProps {
  src?: string;
  url?: string;
  domain?: string;
  name?: string;
  alt?: string;
  className?: string;
  fallbackSize?: number;
}

export const PlatformFavicon: React.FC<PlatformFaviconProps> = ({
  src,
  url,
  domain,
  name,
  alt = 'Platform icon',
  className = 'w-5 h-5 object-contain',
  fallbackSize = 18,
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = resolveFaviconUrl({ src, url, domain, name });

  if (hasError || !resolvedSrc) {
    return <Globe className="text-apple-label-tertiary opacity-70" size={fallbackSize} />;
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};

