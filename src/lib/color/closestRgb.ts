import { rgb as d3Rgb, lch as d3Lch, HCLColor } from "d3-color";
import { clamp } from "./clamp";

function clampChroma(color: HCLColor): HCLColor {
  if (color.displayable()) return color;

  const result = d3Lch(color.l, 0, color.h);
  if (!result.displayable()) return result;

  let left = 0;
  let right = color.c;
  let delta = 0.01;
  while (right - left > delta) {
    result.c = (left + right) / 2;
    if (result.displayable()) left = result.c;
    else right = result.c;
  }

  return result;
}

export function closestRgb(l: number, c: number, h: number) {
  // https://github.com/d3/d3-color/issues/33
  const colorNew = clampChroma(d3Lch(l, c, h));
  const rgb = d3Rgb(colorNew);
  return {
    r: clamp(rgb.r, 0, 255),
    g: clamp(rgb.g, 0, 255),
    b: clamp(rgb.b, 0, 255),
    chromaAdjustment: Math.abs(c - colorNew.c),
  };
}
