import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { allArticles } from '../lib/articles';

// Public pieces only — the feed must respect the same gate as the site.
export async function GET(context: APIContext) {
  const raksti = await allArticles();
  return rss({
    title: 'mai.lv',
    description: 'MI risinājumi, kas palīdzēs atgūt tavu laiku.',
    site: context.site!,
    items: raksti.map((r) => ({
      title: r.data.virsraksts,
      description: r.data.kopsavilkums,
      pubDate: r.data.datums,
      link: `/raksti/${r.id}/`,
    })),
    customData: '<language>lv</language>',
  });
}
