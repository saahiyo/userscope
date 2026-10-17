'use client';

import React from 'react';
import { ShieldCheck, Github, ExternalLink } from 'lucide-react';
import { UserScopeLogo } from '@/components/UserScopeLogo';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-apple-border bg-apple-well/40 py-10 pb-safe text-xs text-apple-label-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <UserScopeLogo size={28} className="w-7 h-7 shadow-sm" />
              <span className="font-semibold text-sm text-apple-label tracking-tight">UserScope</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-apple-well text-apple-label-secondary border border-apple-border">
                OSINT Studio
              </span>
            </div>
            <p className="text-xs text-apple-label-secondary max-w-sm leading-relaxed">
              Real-time open-source intelligence reconnaissance tool. Query public usernames and digital footprints across 700+ public ecosystems with zero paywalls.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-medium text-apple-green">
              <span className="w-2 h-2 rounded-full bg-apple-green animate-pulse" />
              <span>All 692 Recon Engines Active</span>
            </div>
          </div>

          {/* Quick Technical Links */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-apple-label uppercase tracking-wider">Resources</p>
            <ul className="space-y-1.5 text-xs text-apple-label-secondary">
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-apple-label transition-colors"
                >
                  Robots Directives
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-apple-label transition-colors"
                >
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-apple-label transition-colors"
                >
                  llms.txt Specification
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-apple-label uppercase tracking-wider">Ethics & Privacy</p>
            <ul className="space-y-1.5 text-xs text-apple-label-secondary">
              <li>No search query logs kept</li>
              <li>Passive public queries only</li>
              <li>Zero credential storage</li>
              <li>MIT Open-Source Software</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-apple-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-apple-label-tertiary">
          <p>© {new Date().getFullYear()} UserScope. All rights reserved.</p>
          <p>Strictly for ethical reconnaissance, security validation, and identity defense.</p>
        </div>
      </div>
    </footer>
  );
};
