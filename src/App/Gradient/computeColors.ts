import { Color, colorFromLch } from "@lib/color";

export function computeColor(from: Color, to: Color, coef: number) {
  const color = colorFromLch(
    from.lightness + (to.lightness - from.lightness) * coef,
    from.chroma + (to.chroma - from.chroma) * coef,
    from.hue + (to.hue - from.hue) * coef,
    from.opacity + (to.opacity - from.opacity) * coef
  );
  return color;
}

export function computeColors(from: Color, to: Color, steps: number) {
  return Array.from(new Array(steps + 1)).map((_, i) => {
    return computeColor(from, to, i / steps);
  });
}
