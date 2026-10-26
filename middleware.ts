import { createDualmarkMiddleware } from '@dualmark/nextjs';

export default createDualmarkMiddleware({
  siteUrl: 'https://userscope.space',
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
