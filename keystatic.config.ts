import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Keystatic runs as a local admin at /keystatic during `pnpm dev` and writes
 * plain files into src/content/. Content stays in git — no database, no server.
 *
 * The home page is split into ONE SINGLETON PER SECTION rather than a single
 * long form. Keystatic can navigate between entries but not within one, so this
 * is what puts every section in the left sidebar and keeps each form short.
 *
 * Prices are stored as integers with an optional prefix. The € and the thousands
 * separator are applied when rendering, so a price is typed as 1290 and can never
 * drift into "€1290" / "1290 EUR" / "€1 290" depending on who typed it.
 */

const teksts = (label: string) => fields.text({ label });
const rinda = (label: string) => fields.text({ label, multiline: true });

/** Every section carries its own visible heading, editable and never assumed. */
const virsraksts = teksts('Sadaļas virsraksts');

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'mai.lv' },
    navigation: {
      Sākumlapa: [
        'hero', 'problemas', 'gaita', 'cenas', 'garantija',
        'sistemas', 'pieradijumi', 'kamnav', 'buj', 'nosleguma',
      ],
      'Pārējās lapas': ['privacy', 'kopigi'],
      Saturs: ['raksti'],
    },
  },

  singletons: {
    hero: singleton({
      label: '1 · Virsraksts',
      path: 'src/content/lapas/sakums/hero',
      format: { data: 'json' },
      schema: {
        virsraksts: teksts('Virsraksts'),
        apaksvirsraksts: rinda('Apakšvirsraksts'),
        ctaTeksts: teksts('Pogas teksts'),
        ctaSaite: teksts('Pogas saite'),
        otraPogaTeksts: teksts('Otrās pogas teksts'),
        otraPogaSaite: teksts('Otrās pogas saite'),
        mikroTeksts: rinda('Sīkais teksts zem pogas'),
      },
    }),

    problemas: singleton({
      label: '2 · Problēmu uzskaite',
      path: 'src/content/lapas/sakums/problemas',
      format: { data: 'json' },
      schema: {
        virsraksts,
        ievads: rinda('Noslēdzošais teikums'),
        punkti: fields.array(rinda('Problēma'), {
          label: 'Problēmas', itemLabel: (p) => p.value.slice(0, 70),
        }),
      },
    }),

    gaita: singleton({
      label: '3 · Darba gaita',
      path: 'src/content/lapas/sakums/gaita',
      format: { data: 'json' },
      schema: {
        virsraksts,
        soli: fields.array(
          fields.object({
            nr: teksts('Numurs'),
            nosaukums: teksts('Nosaukums'),
            apraksts: rinda('Apraksts'),
          }),
          { label: 'Soļi', itemLabel: (p) => `${p.fields.nr.value} · ${p.fields.nosaukums.value}` },
        ),
      },
    }),

    cenas: singleton({
      label: '4 · Cenas',
      path: 'src/content/lapas/sakums/cenas',
      format: { data: 'json' },
      schema: {
        virsraksts,
        ievads: rinda('Ievads'),
        piezime: rinda('Piezīme zem cenām'),
        limeni: fields.array(
          fields.object({
            nosaukums: teksts('Nosaukums'),
            cena: fields.integer({
              label: 'Cena',
              description: 'Tikai skaitlis. Eiro zīmi un atstarpi pieliek lapa pati.',
              validation: { min: 0 },
            }),
            cenasPrefikss: fields.select({
              label: 'Priekšā',
              options: [
                { label: '(nekas)', value: '' },
                { label: 'no', value: 'no' },
              ],
              defaultValue: '',
            }),
            ilgums: teksts('Zem cenas (ilgums vai periods)'),
            kam: rinda('Kam tas ir'),
            izcelt: fields.checkbox({ label: 'Izcelt', defaultValue: false }),
            pogasTeksts: teksts('Pogas teksts (tukšs = bez pogas)'),
            pogasSaite: teksts('Pogas saite'),
            sanem: fields.array(teksts('Punkts'), {
              label: 'Ko saņem', itemLabel: (p) => p.value.slice(0, 60),
            }),
          }),
          { label: 'Līmeņi', itemLabel: (p) => `${p.fields.nosaukums.value} — €${p.fields.cena.value ?? ''}` },
        ),
      },
    }),

    garantija: singleton({
      label: '5 · Garantija',
      path: 'src/content/lapas/sakums/garantija',
      format: { data: 'json' },
      schema: { virsraksts, teksts: rinda('Teksts') },
    }),

    sistemas: singleton({
      label: '6 · Sistēmu josla',
      path: 'src/content/lapas/sakums/sistemas',
      format: { data: 'json' },
      schema: { ievads: teksts('Ievads'), saraksts: teksts('Sistēmas') },
    }),

    pieradijumi: singleton({
      label: '7 · Pierādījumi',
      path: 'src/content/lapas/sakums/pieradijumi',
      format: { data: 'json' },
      schema: {
        virsraksts,
        ievads: rinda('Ievads'),
        punkti: fields.array(rinda('Punkts'), {
          label: 'Punkti', itemLabel: (p) => p.value.slice(0, 70),
        }),
      },
    }),

    kamnav: singleton({
      label: '8 · Kam nav domāts',
      path: 'src/content/lapas/sakums/kamnav',
      format: { data: 'json' },
      schema: {
        virsraksts,
        punkti: fields.array(rinda('Punkts'), {
          label: 'Punkti', itemLabel: (p) => p.value.slice(0, 70),
        }),
      },
    }),

    buj: singleton({
      label: '9 · Jautājumi un atbildes',
      path: 'src/content/lapas/sakums/buj',
      format: { data: 'json' },
      schema: {
        virsraksts,
        jautajumi: fields.array(
          fields.object({ jautajums: teksts('Jautājums'), atbilde: rinda('Atbilde') }),
          { label: 'Jautājumi', itemLabel: (p) => p.fields.jautajums.value },
        ),
      },
    }),

    nosleguma: singleton({
      label: '10 · Noslēgums',
      path: 'src/content/lapas/sakums/nosleguma',
      format: { data: 'json' },
      schema: {
        virsraksts,
        teksts: rinda('Teksts'),
        ctaTeksts: teksts('Pogas teksts'),
        ctaSaite: teksts('Pogas saite'),
      },
    }),


    /**
     * The privacy policy is one long piece of prose, not a set of slots, so it
     * gets a markdown body like an article rather than a field per paragraph —
     * headings, lists, bold and links are part of the text and have to survive
     * editing. `extension: 'md'` because Astro renders .md on its own; .mdoc
     * would need an integration we do not have.
     */
    privacy: singleton({
      label: 'Privātuma politika',
      path: 'src/content/lapas/privacy',
      format: { contentField: 'body' },
      schema: {
        heading: teksts('Virsraksts'),
        effectiveFrom: fields.text({
          label: 'Spēkā no',
          description: 'Visa rindiņa zem virsraksta, piemēram: Spēkā no 2026. gada 6. augusta',
        }),
        // Headings start at 2 — the page's only h1 is the field above.
        body: fields.markdoc({
          label: 'Teksts',
          extension: 'md',
          options: { heading: [2, 3] },
        }),
      },
    }),

    kopigi: singleton({
      label: 'Izvēlne un kājene',
      path: 'src/content/lapas/kopigi',
      format: { data: 'json' },
      schema: {
        vardzime: teksts('Vārdzīme'),
        navSakums: teksts('Izvēlne — sākums'),
        navRaksti: teksts('Izvēlne — raksti'),
        kajene: teksts('Kājene'),
        privatumsSaite: teksts('Privātuma saites teksts'),

        // Web3Forms' access key is an alias for the destination e-mail, not a
        // secret — it is meant to sit in client-side HTML. Keeping it here means
        // the form can be switched off, or pointed somewhere else, without a
        // code change.
        formaAtslega: fields.text({
          label: 'Saziņas formas atslēga (Web3Forms)',
          description: 'Tukšs = forma netiek rādīta vispār.',
        }),
        formaVirsraksts: teksts('Formas virsraksts'),
        formaIevads: rinda('Formas ievads'),
        formaEpastaLauks: teksts('E-pasta lauka nosaukums'),
        formaZinasLauks: teksts('Ziņas lauka nosaukums'),
        formaPoga: teksts('Formas pogas teksts'),
        formaPeciesuti: rinda('Teksts pēc nosūtīšanas'),
        vestkopaSmalkais: rinda('Sīkais teksts zem vēstkopas formas'),
      },
    }),
  },

  collections: {
    raksti: collection({
      label: 'Raksti',
      slugField: 'virsraksts',
      path: 'src/content/raksti/*',
      format: { contentField: 'saturs' },
      schema: {
        virsraksts: fields.slug({ name: { label: 'Virsraksts' } }),
        kopsavilkums: rinda('Kopsavilkums'),
        // isRequired, because the build schema demands a date and Keystatic
        // would otherwise happily save a file that then fails the build.
        datums: fields.date({ label: 'Datums', validation: { isRequired: true } }),
        // extension: 'md' — Keystatic defaults to .mdoc, which Astro cannot
        // render without @astrojs/markdoc. Without this every article created
        // here is written to a file the site silently ignores.
        saturs: fields.markdoc({ label: 'Saturs', extension: 'md' }),
      },
    }),
  },
});
