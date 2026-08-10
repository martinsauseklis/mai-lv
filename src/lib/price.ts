/**
 * One place that decides what a price looks like.
 *
 * The CMS stores a plain integer, so nobody has to remember whether to type
 * "€1290", "1290 EUR" or "€1 290". Formatting happens here, once.
 *
 * useGrouping:'always' is deliberate — lv-LV defaults to "min2" grouping, which
 * leaves four-digit numbers unseparated (€1290 instead of €1 290). The separator
 * Intl returns is a narrow no-break space; it is normalised to a regular no-break
 * space so the price can never wrap across two lines.
 */
export function price(value: number, prefix = ''): string {
  if (!value) return 'Bez maksas';
  const formatted = new Intl.NumberFormat('lv-LV', { useGrouping: 'always' })
    .format(value)
    .replace(/[\s  ]/g, ' ');
  return `${prefix ? prefix + ' ' : ''}€${formatted}`;
}
