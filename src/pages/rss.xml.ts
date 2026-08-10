import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publicArticles } from '../lib/articles';

// Public pieces only — the feed must respect the same gate as the site.
export async function GET(context: APIContext) {
  const raksti = await publicArticles();
  return rss({
    title: 'mai.lv',
    description: 'MI risinājumi, kas palīdzēs atgūt Jūsu laiku.',
    site: context.site!,
    items: raksti.map((r) => ({
      title: r.data.virsraksts,
      description: r.data.kopsavilkums,
      pubDate: r.data.publicetsTimekli,
      link: `/raksti/${r.id}/`,
    })),
    customData: '<language>lv</language>',
  });
}
