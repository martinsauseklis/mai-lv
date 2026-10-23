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

Mārtiņš Auseklis izstrādā mākslīgā intelekta risinājumus, kas palīdz cilvēkiem mācīties
un apgūt jaunas prasmes. Tie noder gan gatavojoties eksāmeniem un izprotot mācību vielu
latviešu valodā, gan regulāri pilnveidojot savas prasmes.

Mārtiņa mērķis ir padarīt mācīšanos ar MI drošu, saprotamu un pieejamu arī tiem, kuri
nevēlas iedziļināties tehniskajās detaļās, bet vēlas saprast vienu — vai mākslīgais
intelekts patiešām palīdz mācīties un apgūt ko jaunu.

## Raksti

${saraksts}

## Saziņa

martins@mai.lv
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
