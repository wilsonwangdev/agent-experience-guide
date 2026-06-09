import { test as base, expect } from '@playwright/test';

export const test = base;
export { expect };

export const ENGLISH_PAGES = [
  '/',
  '/docs/00-what-is-ax',
  '/docs/01-discovery',
  '/docs/02-identity',
  '/docs/03-auth-and-access',
  '/docs/04-integration',
  '/docs/05-errors-and-recovery',
  '/docs/06-agent-native-architecture',
  '/docs/06b-end-user-experience',
  '/docs/07-anti-patterns',
  '/docs/08-checklist',
  '/docs/references',
];

export const CHINESE_PAGES = ENGLISH_PAGES.map(p => p === '/' ? '/zh' : `/zh${p}`);

export const STATIC_FILES = [
  '/llms.txt',
  '/AGENTS.md',
  '/auth.md',
  '/robots.txt',
  '/capabilities.json',
  '/SUMMARY.md',
  '/sitemap.xml',
];
