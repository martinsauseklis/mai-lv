import type { APIContext } from 'astro';
import { allArticles } from '../lib/articles';
import hero from '../content/lapas/sakums/hero.json';

/**
 * llms.txt — the AEO half of the job.
 *
 * Answer engines fetch a site and try to work out what it is. Rather than
 * making them infer it from markup, state it plainly: who this is, what he
 * builds, and where the writing lives. Plain text, no markup to strip, no JS.
 *
 * Worth knowing: no major AI company has committed to reading this file. It
 * costs nothing and might get adopted; the things that actually do the work are
 * server-rendered HTML, the JSON-LD, and robots.txt.
 */
export async function GET(context: APIContext) {
  const site = context.site!.href.replace(/\/$/, '');
  const raksti = await allArticles();

  const saraksts = raksti.length
    ? raksti
        .map((r) => `- [${r.data.virsraksts}](${site}/raksti/${r.id}/): ${r.data.kopsavilkums}`)
        .join('\n')
    : '- (vēl nav publicētu rakstu)';

  const body = `# mai.lv

> ${hero.apaksvirsraksts}

Mārtiņš Auseklis ir mākslīgā intelekta risinājumu entuziasts, kurš vienkāršo dažādus
ikdienas procesus ar mākslīgā intelekta palīdzību un savus risinājumus bez maksas ļauj
izmēģināt mai.lv vēstkopas abonentiem. Risinājumi aptver sadzīviskas lietas, kā pirkumu
plānošana, mājas asistenti, darāmo darbu saraksti, un tamlīdzīgi. Mārtiņa mērķis ir
padarīt mākslīgā intelekta lietošanu drošu un saprotamu tiem, kurus neinteresē tehniskās
detaļas, bet gan interesē tas, vai MI var paveikt kādu darbu pietiekami labi.

## Raksti

${saraksts}

## Saziņa

martins@mai.lv
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
