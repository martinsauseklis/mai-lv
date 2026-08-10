// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

/**
 * Static output on purpose: no server, no database, free hosting, and every page
 * is complete HTML before a crawler or an answer engine ever asks for it.
 *
 * Keystatic is loaded in DEV ONLY. Its admin route is server-rendered, so leaving
 * it in would force a server adapter and turn the whole site into something that
 * needs hosting. Editing happens locally — including from the phone, through the
 * remote session on this machine — and the built site stays plain files.
 */
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://mai.lv',
  // The privacy page sends <meta robots="noindex">, so listing it in the sitemap
  // asks Google to index a page that then refuses. Leaving it out makes the two
  // agree, instead of it showing up in Search Console as an error.
  integrations: [
    sitemap({ filter: (page) => !page.includes('/privatums') }),
    ...(isDev ? [react(), keystatic()] : []),
  ],
  build: { inlineStylesheets: 'auto' },

  vite: {
    /**
     * Pre-bundle React explicitly.
     *
     * Keystatic's admin is the only thing on the site that uses React, and it
     * reaches it through a dynamic import inside node_modules — which Vite's
     * dependency scanner does not crawl. So React never lands in .vite/deps,
     * those chunks 504, hydration dies, and /keystatic renders a WHITE PAGE
     * WITH NO ERROR ON THE PAGE ITSELF. The only clue is one console line
     * blaming the parent module rather than the missing chunk.
     *
     * Listing them here makes the pre-bundling deterministic instead of
     * dependent on discovery order, so clearing .vite can never resurrect it.
     */
    optimizeDeps: { include: ['react', 'react-dom/client'] },
  },
});
