'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs } from '@/lib/motion';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC<{ platformCount: number }> = ({ platformCount }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What is UserScope and what is it used for?',
      answer:
        `UserScope is an open-source intelligence platform for checking usernames across ${platformCount} listed public platforms.`,
    },
    {
      question: 'How does real-time Server-Sent Events (SSE) scanning work?',
      answer:
        'When you start a scan, UserScope sends the username to its server, checks public platform endpoints, and streams results to your browser as checks complete.',
    },
    {
      question: 'What does UserScope check?',
      answer:
        'UserScope checks public profile endpoints without logging in to target accounts or accessing private communications. Use the tool only where permitted by applicable law and platform terms.',
    },
    {
      question: 'How are searched usernames handled?',
      answer:
        'Searches are sent to UserScope’s server for processing and streamed to your browser. The app does not provide saved search history; infrastructure log retention depends on the service operator.',
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

      {/* Accordion List with animations.dev Auto-Height Expansion */}
      <div className="max-w-3xl mx-auto space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="apple-card rounded-[16px] sm:rounded-[18px] border border-apple-border overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-apple-label hover:bg-apple-card-hover transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={springs.snappy}
                  className="shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-apple-label-secondary" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springs.expand}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-apple-label-secondary leading-relaxed border-t border-apple-border/50">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
