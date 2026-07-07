/** Number formatting shared by any layer that displays scores. */

const UNITS = ['K', 'M', 'B', 'T', 'Qa', 'Qi'];

/**
 * Format a number compactly for display:
 * 950 → "950", 12_340 → "12.3K", 5_600_000 → "5.6M", -2000 → "-2K".
 * One decimal below 100 of a unit, none above; trailing ".0" is dropped.
 */
export function formatNumber(n: number): string {
  const abs = Math.abs(n);
  if (abs < 1000) return String(Math.trunc(n));
  let value = abs;
  let unit = '';
  for (const u of UNITS) {
    value /= 1000;
    unit = u;
    if (value < 1000) break;
  }
  const digits = value >= 100 ? 0 : 1;
  const text = value.toFixed(digits).replace(/\.0$/, '');
  return (n < 0 ? '-' : '') + text + unit;
}
