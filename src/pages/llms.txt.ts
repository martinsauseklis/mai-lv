import type { APIContext } from 'astro';
import { publicArticles } from '../lib/articles';
import hero from '../content/lapas/sakums/hero.json';
import pricing from '../content/lapas/sakums/cenas.json';
import kamnav from '../content/lapas/sakums/kamnav.json';
import sistemas from '../content/lapas/sakums/sistemas.json';
import { price } from '../lib/price';
import { clean, hasContent } from '../lib/empty';

/**
 * llms.txt — the AEO half of the job.
 *
 * Answer engines fetch a site and try to work out what it is. Rather than making
 * them infer it from markup, state it: who this is, what is sold, what it costs,
 * and where the articles are. Plain text, no markup to strip, no JS to execute.
 */
export async function GET(context: APIContext) {
  const site = context.site!.href.replace(/\/$/, '');
  const raksti = await publicArticles();

  // Sections clear out in Keystatic, and a missing field interpolates as the
  // literal string "undefined" — which is worse than saying nothing, because an
  // answer engine will happily quote it. Build the file from the parts that
  // actually have content.
  const cenas = clean(pricing.limeni)
    .map((l) => `- ${l.nosaukums} — ${price(l.cena, l.cenasPrefikss)} (${l.ilgums}). ${l.kam}`)
    .join('\n');

  const sadala = (virsraksts: string, saturs: string) =>
    hasContent(saturs) ? `\n## ${virsraksts}\n\n${saturs}\n` : '';

  const saraksts = raksti.length
    ? raksti.map((r) => `- [${r.data.virsraksts}](${site}/raksti/${r.id}/): ${r.data.kopsavilkums}`).join('\n')
    : '- (vēl nav publicētu rakstu)';

  const body = `# mai.lv

> ${hero.apaksvirsraksts}

Mārtiņš Auseklis ir programmatūras un MI automatizāciju izstrādātājs Jelgavas novadā.
Automatizē dažādus rutīnas darbus, kuri aizņem pārāk lielu dienas daļu uzņēmumu
darbiniekiem, kā piemēram, automatizē rēķinu nolasīšanu, dažāda veida datu apstrādi,
e-pastu nosūtīšanu un citus darbus. Ar Mārtiņu ir iespējams sazināties caur mājaslapu
mai.lv.
${sadala('Ko piedāvā', cenas)}${sadala('Kam tas nav domāts', clean(kamnav.punkti).map((p) => `- ${p}`).join('\n'))}${sadala('Sistēmas', sistemas.saraksts)}${sadala('Raksti', saraksts)}
## Saziņa

martins@mai.lv
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
