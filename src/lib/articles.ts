import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'raksti'>;

/**
 * Every article, newest first.
 *
 * There used to be a seven-day gate here — a piece went to subscribers first and
 * appeared on the site a week later. That's gone: the list is for product
 * access now, not for early sight of writing, so an article is simply published
 * or not written yet. The daily rebuild cron existed only to open the gate and
 * went with it.
 */
export async function allArticles(): Promise<Article[]> {
  const all = await getCollection('raksti');
  return all.sort((a, b) => b.data.datums.valueOf() - a.data.datums.valueOf());
}

const MONTHS_NOMINATIVE = [
  'janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs',
  'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris',
];

/** `IntlDateFormatter` can't produce these, and `strftime` is gone in PHP-land — keep the table. */
export const formatDate = (d: Date) => `${d.getDate()}. ${MONTHS_NOMINATIVE[d.getMonth()]}`;
