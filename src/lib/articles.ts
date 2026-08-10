import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'raksti'>;

/** Everything, newest first — includes pieces still inside the gate. */
export async function allArticles(): Promise<Article[]> {
  const all = await getCollection('raksti');
  return all.sort((a, b) => b.data.nosutits.valueOf() - a.data.nosutits.valueOf());
}

/** Public only. This is what decides whether a page is generated at all. */
export async function publicArticles(): Promise<Article[]> {
  const today = new Date();
  return (await allArticles()).filter((r) => r.data.publicetsTimekli <= today);
}

export function isPublished(r: Article, now = new Date()): boolean {
  return r.data.publicetsTimekli <= now;
}

const MONTHS_LOCATIVE = [
  'janvārī', 'februārī', 'martā', 'aprīlī', 'maijā', 'jūnijā',
  'jūlijā', 'augustā', 'septembrī', 'oktobrī', 'novembrī', 'decembrī',
];
const MONTHS_NOMINATIVE = [
  'janvāris', 'februāris', 'marts', 'aprīlis', 'maijs', 'jūnijs',
  'jūlijs', 'augusts', 'septembris', 'oktobris', 'novembris', 'decembris',
];

export const formatDate = (d: Date) => `${d.getDate()}. ${MONTHS_NOMINATIVE[d.getMonth()]}`;
export const formatDateLocative = (d: Date) => `${d.getDate()}. ${MONTHS_LOCATIVE[d.getMonth()]}`;
