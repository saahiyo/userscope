const { withDualmark } = require('@dualmark/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon.svg',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/platforms/arduino',
        destination: '/platforms/arduino-forum',
        permanent: true,
      },
      {
        source: '/platforms/arduino-2',
        destination: '/platforms/arduino-project-hub',
        permanent: true,
      },
      {
        source: '/platforms/freelancehunt-2',
        destination: '/platforms/freelancehunt-freelancer',
        permanent: true,
      },
      {
        source: '/platforms/meta-wiki',
        destination: '/platforms/meta-wiki-wikimedia',
        permanent: true,
      },
      {
        source: '/platforms/mastodonbooks-net',
        destination: '/platforms/mastodonbooks-net-mastodon-instance',
        permanent: true,
      },
      {
        source: '/platforms/wikidata',
        destination: '/platforms',
        permanent: true,
      },
      {
        source: '/platforms/wikipedia',
        destination: '/platforms',
        permanent: true,
      },
      {
        source: '/platforms/archive-org',
        destination: '/platforms',
        permanent: true,
      },
    ];
  },
};

module.exports = withDualmark(nextConfig, {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space',
});
