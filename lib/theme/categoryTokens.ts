/**
 * Centralized Category Design Tokens
 * Single source of truth for platform categories across cards, graphs, and badges.
 */

export interface CategoryToken {
  id: string;
  label: string;
  colorHex: string;
  colorRgb: string;
  badgeClass: string;
}

export const CATEGORY_TOKENS: Record<string, CategoryToken> = {
  coding: {
    id: 'coding',
    label: 'Code & Dev',
    colorHex: '#BF5AF2',
    colorRgb: '175, 82, 222',
    badgeClass: 'text-apple-purple bg-apple-purple/15 border-apple-purple/30',
  },
  development: {
    id: 'development',
    label: 'Code & Dev',
    colorHex: '#BF5AF2',
    colorRgb: '175, 82, 222',
    badgeClass: 'text-apple-purple bg-apple-purple/15 border-apple-purple/30',
  },
  social: {
    id: 'social',
    label: 'Social',
    colorHex: '#0A84FF',
    colorRgb: '10, 132, 255',
    badgeClass: 'text-apple-blue bg-apple-blue/15 border-apple-blue/30',
  },
  gaming: {
    id: 'gaming',
    label: 'Gaming',
    colorHex: '#30D158',
    colorRgb: '48, 209, 88',
    badgeClass: 'text-apple-green bg-apple-green/15 border-apple-green/30',
  },
  design: {
    id: 'design',
    label: 'Design',
    colorHex: '#FF375F',
    colorRgb: '255, 45, 85',
    badgeClass: 'text-apple-pink bg-apple-pink/15 border-apple-pink/30',
  },
  art: {
    id: 'art',
    label: 'Art & Creative',
    colorHex: '#FF375F',
    colorRgb: '255, 45, 85',
    badgeClass: 'text-apple-pink bg-apple-pink/15 border-apple-pink/30',
  },
  creative: {
    id: 'creative',
    label: 'Art & Creative',
    colorHex: '#FF375F',
    colorRgb: '255, 45, 85',
    badgeClass: 'text-apple-pink bg-apple-pink/15 border-apple-pink/30',
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    colorHex: '#64D2FF',
    colorRgb: '48, 176, 199',
    badgeClass: 'text-apple-teal bg-apple-teal/15 border-apple-teal/30',
  },
  crypto: {
    id: 'crypto',
    label: 'Crypto & Web3',
    colorHex: '#64D2FF',
    colorRgb: '48, 176, 199',
    badgeClass: 'text-apple-teal bg-apple-teal/15 border-apple-teal/30',
  },
  music: {
    id: 'music',
    label: 'Music & Audio',
    colorHex: '#FF9F0A',
    colorRgb: '255, 149, 0',
    badgeClass: 'text-apple-orange bg-apple-orange/15 border-apple-orange/30',
  },
  security: {
    id: 'security',
    label: 'Security & Intel',
    colorHex: '#FF453A',
    colorRgb: '255, 59, 48',
    badgeClass: 'text-apple-red bg-apple-red/15 border-apple-red/30',
  },
  tech: {
    id: 'tech',
    label: 'Tech',
    colorHex: '#0A84FF',
    colorRgb: '10, 132, 255',
    badgeClass: 'text-apple-blue bg-apple-blue/15 border-apple-blue/30',
  },
  video: {
    id: 'video',
    label: 'Video & Media',
    colorHex: '#FF375F',
    colorRgb: '255, 45, 85',
    badgeClass: 'text-apple-pink bg-apple-pink/15 border-apple-pink/30',
  },
  communication: {
    id: 'communication',
    label: 'Messaging',
    colorHex: '#30D158',
    colorRgb: '48, 209, 88',
    badgeClass: 'text-apple-green bg-apple-green/15 border-apple-green/30',
  },
  nsfw: {
    id: 'nsfw',
    label: 'Adult (18+)',
    colorHex: '#8E8E93',
    colorRgb: '142, 142, 147',
    badgeClass: 'text-apple-label-secondary bg-apple-chip border-apple-border',
  },
  misc: {
    id: 'misc',
    label: 'General',
    colorHex: '#8E8E93',
    colorRgb: '142, 142, 147',
    badgeClass: 'text-apple-label-secondary bg-apple-chip border-apple-border',
  },
};

const DEFAULT_CATEGORY_TOKEN: CategoryToken = {
  id: 'other',
  label: 'Other',
  colorHex: '#FF9F0A',
  colorRgb: '255, 149, 0',
  badgeClass: 'text-apple-orange bg-apple-orange/15 border-apple-orange/30',
};

export function getCategoryToken(category?: string): CategoryToken {
  if (!category) return DEFAULT_CATEGORY_TOKEN;
  const key = category.trim().toLowerCase();
  if (key.includes('nsfw') || key.includes('adult')) return CATEGORY_TOKENS['nsfw'];
  if (key.includes('tech') || key.includes('cloud')) return CATEGORY_TOKENS['tech'];
  if (key.includes('video') || key.includes('stream')) return CATEGORY_TOKENS['video'];
  if (key.includes('comm') || key.includes('message')) return CATEGORY_TOKENS['communication'];
  if (key.includes('dev') || key.includes('code')) return CATEGORY_TOKENS['coding'];
  return CATEGORY_TOKENS[key] || {
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    colorHex: '#8E8E93',
    colorRgb: '142, 142, 147',
    badgeClass: 'text-apple-label-secondary bg-apple-chip border-apple-border',
  };
}
