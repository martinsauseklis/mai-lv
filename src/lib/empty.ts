/**
 * Is there anything worth rendering?
 *
 * Clearing a section in Keystatic leaves the fields present but blank. Without a
 * check the section still renders — a border-top, 88px of padding and nothing in
 * it. So every block on the page asks this first, and disappears entirely when
 * the answer is no.
 *
 * Blank strings, empty arrays, arrays of blanks and objects whose every field is
 * blank all count as empty. A number stays — 0 is a real price ("Bez maksas").
 */
export function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.every(isEmpty);
  if (typeof v === 'object') return Object.values(v as object).every(isEmpty);
  return false; // numbers, booleans — present on purpose
}

/** True when at least one of these has content. Use to decide a whole section. */
export function hasContent(...values: unknown[]): boolean {
  return values.some((v) => !isEmpty(v));
}

/** Drop the blank entries a half-filled Keystatic list leaves behind. */
export function clean<T>(list: T[] | undefined | null): T[] {
  return (list ?? []).filter((item) => !isEmpty(item));
}
