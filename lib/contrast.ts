/**
 * WCAG 2.1 contrast ratio utilities.
 * Spec: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

/** Convert a single 8-bit channel (0–255) to its linearised value. */
function linearise(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Parse a hex string (#RGB, #RRGGBB) into [r, g, b] (0–255). */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Relative luminance of a hex colour (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
}

/**
 * WCAG contrast ratio between two hex colours.
 * Returns a value in [1, 21].
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Map a contrast ratio to a WCAG level for normal text.
 * ≥ 7   → AAA
 * ≥ 4.5 → AA
 * < 4.5 → Fail
 */
export function getWcagLevel(ratio: number): "AAA" | "AA" | "Fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "Fail";
}
