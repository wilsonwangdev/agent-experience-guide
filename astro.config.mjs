import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ax.wilsonhandbook.online',
  srcDir: './src',
  publicDir: './public',
  output: 'static',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});