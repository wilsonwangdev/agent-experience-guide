import { test, expect, ENGLISH_PAGES, CHINESE_PAGES, STATIC_FILES } from './helpers';

test.describe('Routing — all pages return 200', () => {
  for (const path of ENGLISH_PAGES) {
    test(`GET ${path} returns 200`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    });
  }

  for (const path of CHINESE_PAGES) {
    test(`GET ${path} returns 200`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    });
  }

  test('GET /nonexistent returns 404', async ({ page }) => {
    const res = await page.goto('/nonexistent');
    expect(res?.status()).toBe(404);
  });

  test('GET /zh/nonexistent returns 404', async ({ page }) => {
    const res = await page.goto('/zh/nonexistent');
    expect(res?.status()).toBe(404);
  });

  test('no trailing slashes in page URLs', async ({ page }) => {
    const paths = ['/zh', '/docs/01-discovery', '/zh/docs/01-discovery'];
    for (const p of paths) {
      await page.goto(p);
      const url = page.url();
      if (!url.endsWith('/')) return;
      expect(url).not.toMatch(/\/$/);
    }
  });
});

test.describe('Static files', () => {
  test('GET /llms.txt returns 200 with text/plain', async ({ page }) => {
    const res = await page.goto('/llms.txt');
    expect(res?.status()).toBe(200);
    const contentType = res?.headers()?.['content-type'] || '';
    expect(contentType).toMatch(/text\/plain/);
  });

  for (const path of STATIC_FILES) {
    test(`GET ${path} returns 200`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    });
  }

  test('GET /capabilities.json returns valid JSON', async ({ request }) => {
    const res = await request.get('/capabilities.json');
    expect(res.status()).toBe(200);
    const contentType = res.headers()?.['content-type'] || '';
    expect(contentType).toMatch(/application\/json/);
    const body = await res.text();
    expect(() => JSON.parse(body)).not.toThrow();
  });

  test('GET /sitemap.xml returns valid XML with urlset', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const contentType = res.headers()?.['content-type'] || '';
    expect(contentType).toMatch(/(application\/xml|text\/xml)/);
    const body = await res.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('<loc>');
  });
});

test.describe('Language switching', () => {
  test('EN link active on English page', async ({ page }) => {
    await page.goto('/');
    const enLink = page.locator('.lang-link').filter({ hasText: 'EN' });
    await expect(enLink).toHaveClass(/active/);
  });

  test('中文 link active on Chinese page', async ({ page }) => {
    await page.goto('/zh');
    const zhLink = page.locator('.lang-link').filter({ hasText: '中文' });
    await expect(zhLink).toHaveClass(/active/);
  });

  test('click 中文 on English landing → navigates to /zh', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang-link').filter({ hasText: '中文' }).click();
    await expect(page).toHaveURL(/\/zh\/?$/);
  });

  test('click EN on Chinese landing → navigates to /', async ({ page }) => {
    await page.goto('/zh');
    await page.locator('.lang-link').filter({ hasText: 'EN' }).click();
    await expect(page).toHaveURL('/');
  });

  test('click 中文 on EN doc page → navigates to /zh/docs/ version', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    await page.locator('.lang-link').filter({ hasText: '中文' }).click();
    await expect(page).toHaveURL('/zh/docs/01-discovery');
  });

  test('click EN on ZH doc page → navigates to /docs/ version', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    await page.locator('.lang-link').filter({ hasText: 'EN' }).click();
    await expect(page).toHaveURL('/docs/01-discovery');
  });

  test('content differs between EN and ZH titles', async ({ page }) => {
    await page.goto('/');
    const enTitle = await page.title();
    await page.goto('/zh');
    const zhTitle = await page.title();
    expect(enTitle).not.toBe(zhTitle);
  });
});

test.describe('Navigation — top nav clicks', () => {
  test('logo link on EN page navigates to /', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    await page.locator('.logo').click();
    await expect(page).toHaveURL('/');
  });

  test('logo link on ZH page navigates to /zh', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    await page.locator('.logo').click();
    await expect(page).toHaveURL(/\/zh\/?$/);
  });

  test('Guide nav link on EN doc page works', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    await page.locator('.main-nav').locator('a', { hasText: 'Guide' }).click();
    await expect(page).toHaveURL('/docs/00-what-is-ax');
  });

  test('Checklist nav link on EN doc page works', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    await page.locator('.main-nav').locator('a', { hasText: 'Checklist' }).click();
    await expect(page).toHaveURL('/docs/08-checklist');
  });

  test('References nav link on EN doc page works', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    await page.locator('.main-nav').locator('a', { hasText: 'References' }).click();
    await expect(page).toHaveURL('/docs/references');
  });

  test('指南 nav link on ZH doc page works', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    await page.locator('.main-nav').locator('a', { hasText: '指南' }).click();
    await expect(page).toHaveURL('/zh/docs/00-what-is-ax');
  });

  test('检查清单 nav link on ZH doc page works', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    await page.locator('.main-nav').locator('a', { hasText: '检查清单' }).click();
    await expect(page).toHaveURL('/zh/docs/08-checklist');
  });

  test('参考资料 nav link on ZH doc page works', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    await page.locator('.main-nav').locator('a', { hasText: '参考资料' }).click();
    await expect(page).toHaveURL('/zh/docs/references');
  });
});

test.describe('Navigation — sidebar clicks', () => {
  test('clicking sidebar link on EN page navigates correctly', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const link = page.locator('.sidebar-link', { hasText: 'Identity' });
    await link.click();
    await expect(page).toHaveURL('/docs/02-identity');
  });

  test('clicking sidebar link on ZH page navigates correctly', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    const link = page.locator('.sidebar-link', { hasText: '身份' });
    await link.click();
    await expect(page).toHaveURL('/zh/docs/02-identity');
  });

  test('sidebar current page is highlighted', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const active = page.locator('.sidebar-link.active');
    await expect(active).toBeVisible();
    const href = await active.getAttribute('href');
    expect(href).toBe('/docs/01-discovery');
  });

  test('every sidebar link on EN page returns 200', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const links = page.locator('.sidebar-list .sidebar-link');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
    }
  });

  test('every sidebar link on ZH page returns 200', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    const links = page.locator('.sidebar-list .sidebar-link');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
    }
  });
});

test.describe('Navigation — footer links', () => {
  test('all internal footer links on EN landing return 200', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('.site-footer nav a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href!.startsWith('http')) continue;
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
    }
  });

  test('all internal footer links on ZH landing return 200', async ({ page }) => {
    await page.goto('/zh');
    const links = page.locator('.site-footer nav a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href!.startsWith('http')) continue;
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
    }
  });

  test('external footer links (GitHub) point to valid URLs', async ({ page }) => {
    await page.goto('/');
    const issuesLink = page.locator('.site-footer nav a', { hasText: 'Issues' });
    await expect(issuesLink).toBeVisible();
    const href = await issuesLink.getAttribute('href');
    expect(href).toContain('github.com/wilsonwangdev/agent-experience-guide');
  });
});

test.describe('Navigation — landing page content links', () => {
  test('EN landing "Start reading" link works', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href="/docs/00-what-is-ax"]');
    await link.first().click();
    await expect(page).toHaveURL('/docs/00-what-is-ax');
  });

  test('ZH landing "开始阅读" link works', async ({ page }) => {
    await page.goto('/zh');
    const link = page.locator('a[href="/zh/docs/00-what-is-ax"]');
    await link.first().click();
    await expect(page).toHaveURL('/zh/docs/00-what-is-ax');
  });

  test('EN landing six-stage links all work', async ({ page }) => {
    await page.goto('/');
    const stageLinks = [
      '/docs/01-discovery',
      '/docs/02-identity',
      '/docs/03-auth-and-access',
      '/docs/04-integration',
      '/docs/05-errors-and-recovery',
      '/docs/06b-end-user-experience',
    ];
    for (const href of stageLinks) {
      const res = await page.request.get(href);
      expect(res.status()).toBe(200);
    }
  });

  test('ZH landing six-stage links all work', async ({ page }) => {
    await page.goto('/zh');
    const stageLinks = [
      '/zh/docs/01-discovery',
      '/zh/docs/02-identity',
      '/zh/docs/03-auth-and-access',
      '/zh/docs/04-integration',
      '/zh/docs/05-errors-and-recovery',
      '/zh/docs/06b-end-user-experience',
    ];
    for (const href of stageLinks) {
      const res = await page.request.get(href);
      expect(res.status()).toBe(200);
    }
  });
});

test.describe('Agent mode toggle', () => {
  test('mode toggle button exists and is visible', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-mode-toggle]');
    await expect(toggle).toBeVisible();
  });

  test('default mode is human', async ({ page }) => {
    await page.goto('/');
    const mode = await page.locator('html').getAttribute('data-mode');
    expect(mode).toBe('human');
  });

  test('click toggle switches to agent mode', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-mode-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'agent');
  });

  test('click toggle twice reverts to human mode', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-mode-toggle]');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'agent');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'human');
  });

  test('agent summary hidden in human mode, visible in agent mode', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const summary = page.locator('.agent-summary');
    await expect(summary).toBeHidden();
    await page.locator('[data-mode-toggle]').click();
    await expect(summary).toBeVisible();
  });

  test('sidebar visible in human mode, hidden in agent mode', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
    await page.locator('[data-mode-toggle]').click();
    await expect(sidebar).toBeHidden();
  });

  test('mode persists via localStorage after reload', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-mode-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'agent');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'agent');
  });

  test('mode toggle works on Chinese page', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    await page.locator('[data-mode-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'agent');
    const summary = page.locator('.agent-summary');
    await expect(summary).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  for (const path of ENGLISH_PAGES) {
    test(`EN ${path} has lang="en"`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  }

  for (const path of CHINESE_PAGES) {
    test(`ZH ${path} has lang="zh"`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
    });
  }

  for (const path of [...ENGLISH_PAGES, ...CHINESE_PAGES]) {
    test(`${path} has a title`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });
  }

  test('landing page has meta description', async ({ page }) => {
    await page.goto('/');
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content');
    const content = await desc.getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('doc page has meta description', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content');
  });

  test('skip-to-content link exists', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const skip = page.locator('.skip-to-content');
    await expect(skip).toBeAttached();
    const href = await skip.getAttribute('href');
    expect(href).toBe('#main-content');
  });

  test('main landmark exists on every page', async ({ page }) => {
    for (const path of [...ENGLISH_PAGES, ...CHINESE_PAGES]) {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('mode toggle is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-mode-toggle]');
    await toggle.focus();
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'agent');
  });

  test('language links are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    const enLink = page.locator('.lang-link').filter({ hasText: 'EN' });
    await enLink.focus();
    await expect(enLink).toBeFocused();
  });

  test('heading hierarchy is correct on landing', async ({ page }) => {
    await page.goto('/');
    const h1s = await page.locator('h1').count();
    expect(h1s).toBe(1);
  });

  test('heading hierarchy is correct on doc page', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const h1s = await page.locator('.prose h1').count();
    expect(h1s).toBe(1);
  });
});

test.describe('SEO meta tags', () => {
  test('EN page has og:title', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });

  test('EN page has og:description', async ({ page }) => {
    await page.goto('/');
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDesc).toBeTruthy();
  });

  test('EN page has canonical URL', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain('/docs/01-discovery');
  });

  test('EN page has alternate hreflang to ZH', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const alternate = await page.locator('link[rel="alternate"][hreflang="zh"]').getAttribute('href');
    expect(alternate).toBeTruthy();
    expect(alternate).toContain('/zh');
  });

  test('ZH page has alternate hreflang to EN', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    const alternate = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href');
    expect(alternate).toBeTruthy();
    expect(alternate).not.toContain('/zh');
  });
});

test.describe('Agent summary content', () => {
  test('EN doc shows stage badge in agent mode', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    await page.locator('[data-mode-toggle]').click();
    const stage = page.locator('.agent-stage');
    await expect(stage).toBeVisible();
    expect(await stage.textContent()).toContain('Stage');
  });

  test('ZH doc shows stage badge in agent mode', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    await page.locator('[data-mode-toggle]').click();
    const stage = page.locator('.agent-stage');
    await expect(stage).toBeVisible();
  });

  test('EN doc shows key concepts tags in agent mode', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    await page.locator('[data-mode-toggle]').click();
    const tags = page.locator('.agent-tag');
    await expect(tags.first()).toBeVisible();
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });

  test('agent nav shows prev/next links', async ({ page }) => {
    await page.goto('/docs/02-identity');
    await page.locator('[data-mode-toggle]').click();
    const nav = page.locator('.agent-nav');
    await expect(nav).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('landing page loads under 1000ms', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(1000);
  });

  test('doc page loads under 1000ms', async ({ page }) => {
    const start = Date.now();
    await page.goto('/docs/01-discovery');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(1000);
  });

  test('no console errors on landing page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('no console errors on doc page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/docs/01-discovery');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('no console errors on Chinese landing', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/zh');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('CSS is loaded (no unstyled content)', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const bodyColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(bodyColor).toBeTruthy();
    expect(bodyColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});

test.describe('Structure', () => {
  test('EN sidebar has correct number of links', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const links = page.locator('.sidebar-list .sidebar-link');
    const count = await links.count();
    expect(count).toBe(ENGLISH_PAGES.length - 1);
  });

  test('ZH sidebar has correct number of links', async ({ page }) => {
    await page.goto('/zh/docs/01-discovery');
    const links = page.locator('.sidebar-list .sidebar-link');
    const count = await links.count();
    expect(count).toBe(CHINESE_PAGES.length - 1);
  });

  test('EN landing heading says Agent Experience Guide', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Agent Experience Guide' })).toBeVisible();
  });

  test('ZH landing heading says 智能体体验指南', async ({ page }) => {
    await page.goto('/zh');
    await expect(page.getByRole('heading', { name: '智能体体验指南' })).toBeVisible();
  });

  test('doc pages have h1 matching frontmatter title', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const h1 = page.locator('.prose h1');
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text).toContain('Discovery');
  });

  test('doc pages have h2 sections', async ({ page }) => {
    await page.goto('/docs/01-discovery');
    const h2s = page.locator('.prose h2');
    const count = await h2s.count();
    expect(count).toBeGreaterThan(0);
  });
});