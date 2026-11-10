import { HomeClient } from '@/components/HomeClient';
import { PLATFORM_COUNT, SCAN_RULE_COUNT } from '@/lib/osint/platformDirectory';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://userscope.space';

export default function Home() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is UserScope and what is it used for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `UserScope is an open-source intelligence platform for checking usernames across ${PLATFORM_COUNT} listed public platforms.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How does real-time Server-Sent Events (SSE) scanning work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When you start a scan, UserScope sends the username to its server, checks public platform endpoints, and streams results to your browser as checks complete.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does UserScope check?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'UserScope checks public profile endpoints without logging in to target accounts or accessing private communications. Use the tool only where permitted by applicable law and platform terms.',
        },
      },
      {
        '@type': 'Question',
        name: 'How are searched usernames handled?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Searches are sent to UserScope’s server for processing and streamed to your browser. The app does not provide saved search history; infrastructure log retention depends on the service operator.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I export the gathered reconnaissance intelligence?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. With one click, you can export all discovered profiles, verified URLs, avatar links, and metadata into standardized JSON or a spreadsheet-compatible CSV file.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient platformCount={PLATFORM_COUNT} scanRuleCount={SCAN_RULE_COUNT} />
    </>
  );
}
