# mai.lv

Astro site, static output, deployed to GitHub Pages. Its one job is collecting an
early-access list for the tools Mārtiņš builds.

Three pages: the home page (hero + signup + latest articles), `/raksti`, and
`/privatums`. No server, no database — content is plain files in this repo.

## Writing

```
pnpm dev
```

Then **http://localhost:4321/keystatic** — laptop only, because Keystatic needs a
secure context and won't load over a LAN IP.

Articles are `src/content/raksti/*.md`, page copy is `src/content/lapas/*.json`.
Keystatic writes those files; committing and pushing is what publishes them.
Nothing goes live until you push.

## Deploying

Push to `main`. GitHub Actions builds and deploys — about 90 seconds. There is no
scheduled build; deploys only happen on push.

## Things that will catch you out

**Deleting an article leaves it in the build.** Astro caches the content
collection in `node_modules/.astro/data-store.json`, not in `.astro/`. After
removing a file:

```
rm -rf node_modules/.astro && pnpm build
```

The same cache is why a newly created article sometimes doesn't appear in dev —
restart the dev server. CI is unaffected; it builds from a fresh checkout.

**The preview card is generated, not hand-drawn.** `public/og.png` comes from
`tools/og-card.html` via `bash tools/og-card.sh`, rendered by headless Chrome
because the brand faces are woff2 and Pillow can't read those. Change the text
there and re-run, then update `og:image:alt` in `src/layouts/Base.astro` to match.

**Markdown gets no classes.** Every element an article can contain needs a
`:global()` rule in `src/pages/raksti/[...id].astro`. Anything missed falls back
to browser defaults, which on a dark background reads as broken.

**Latvian diacritics need the latin-ext subset.** Both fonts load `latin` and
`latin-ext`; dropping the second turns every macron into a blank box.

## Third parties

Signup is EmailOctopus, the contact form posts to Web3Forms, mail is Hostinger,
DNS is at dns.lv. Full map lives in the chief-of-staff repo at
`store/products/mai-lv-stack.md`.
