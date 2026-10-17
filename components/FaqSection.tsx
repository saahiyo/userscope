'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What is UserScope and what is it used for?',
      answer:
        'UserScope is an open-source intelligence (OSINT) reconnaissance platform. It allows security researchers, penetration testers, and developers to determine where a specific handle or alias exists across 700+ public online platforms in real time.',
    },
    {
      question: 'How does real-time Server-Sent Events (SSE) scanning work?',
      answer:
        'When you initiate a scan, UserScope dispatches concurrent, asynchronous workers against public API endpoints. As soon as a platform verifies handle existence, the hit is streamed directly to your browser over an SSE connection in sub-second latency.',
    },
    {
      question: 'Is querying public handles legal and safe?',
      answer:
        'Yes. UserScope solely performs passive, unauthenticated queries against public endpoints that are open to the internet. It never accesses private communications, breaks authentication, or bypasses access controls.',
    },
    {
      question: 'Does UserScope store, track, or sell searched usernames?',
      answer:
        'No. UserScope does not maintain query databases or track user searches. The tool operates client-side streaming directly to your active browser session with complete investigative privacy.',
    },
    {
      question: 'Can I export the gathered reconnaissance intelligence?',
      answer:
        'Yes. With one click, you can export all discovered profiles, verified URLs, avatar links, and metadata into standardized JSON or a spreadsheet-compatible CSV file.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="space-y-6 pt-8 sm:pt-14 pb-4">
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border">
          Knowledge Base
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-apple-label">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-apple-label-secondary leading-relaxed">
          Everything you need to know about UserScope architecture, privacy, and public data queries.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="apple-card rounded-[16px] sm:rounded-[18px] border border-apple-border overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-apple-label hover:bg-apple-card-hover transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-apple-label-secondary shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-apple-label-secondary leading-relaxed border-t border-apple-border/50 animate-fade-in">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
