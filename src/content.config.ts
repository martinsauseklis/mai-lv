import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The articles. Same files Keystatic writes, read back with a schema so a typo
 * in a date is a build error rather than a broken page.
 *
 * Three fields, deliberately. There were five while this doubled as a gated
 * newsletter archive — a send date, a separate web-publish date and an industry
 * tag. The list is for product access now, so an article is just an article.
 */
const raksti = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/raksti' }),
  schema: z.object({
    virsraksts: z.string(),
    kopsavilkums: z.string(),
    datums: z.coerce.date(),
  }),
});

export const collections = { raksti };
