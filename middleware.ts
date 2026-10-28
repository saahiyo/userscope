import { createDualmarkMiddleware } from '@dualmark/nextjs';

export default createDualmarkMiddleware({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space',
  middleware: {
    injectLinkHeader: true,
  },
});

export const config = {
  matcher: [
    {
      source: '/((?!_next/|favicon.ico|md/|icon.svg|api/).*)',
      missing: [{ type: 'header', key: 'next-router-prefetch' }],
    },
  ],
};
