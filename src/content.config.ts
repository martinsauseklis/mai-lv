import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The newsletter archive. Same files Keystatic writes, read back with a schema
 * so a typo in a date is a build error rather than a broken page.
 *
 * The seven-day gate lives in `publicetsTimekli`: until that date the piece is
 * listed but not linked, and no page is generated for it at all — a file that
 * exists is a URL somebody can guess, so the gate has to be real.
 */
const raksti = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/raksti' }),
  schema: z.object({
    virsraksts: z.string(),
    kopsavilkums: z.string(),
    nosutits: z.coerce.date(),
    publicetsTimekli: z.coerce.date(),
    nozare: z
      .enum(['nav', 'parvadajumi', 'vairumtirdznieciba', 'buvnieciba', 'mazumtirdznieciba'])
      .default('nav'),
  }),
});

export const collections = { raksti };
