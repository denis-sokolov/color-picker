import { hsl2lch, rgb2hsl } from "@csstools/convert-colors";
import { Color, ColorClass } from "./class";

export type { Color } from "./class";

/**
 * Parameter bounds: 0-~130, 0-~150, 0-360, 0-1
 */
export function colorFromLch(
  lightness: number,
  chroma: number,
  hue: number,
  opacity?: number
): Color {
  return new ColorClass({
    c: chroma,
    h: hue,
    l: lightness,
    opacity: opacity ?? 1,
  });
}

/**
 * Parameter bounds: 0-360, 0-1, 0-1, 0-1
 */
export function colorFromHsl(
  hue: number,
  saturation: number,
  lightness: number,
  opacity?: number
): Color {
  const [l, c, h] = hsl2lch(hue, saturation * 100, lightness * 100);
  return colorFromLch(l, c, h, opacity);
}

/**
 * Parameter bounds: 0-255, 0-255, 0-255, 0-1
 */
export function colorFromRgb(
  r: number,
  g: number,
  b: number,
  opacity?: number
): Color {
  const [h, s, l] = rgb2hsl(r / 2.55, g / 2.55, b / 2.55);
  return colorFromHsl(h, s / 100, l / 100, opacity);
}
