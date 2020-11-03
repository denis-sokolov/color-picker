import { Color, colorFromRgb, colorFromHsl, colorFromLch } from "@lib/color";
import {} from "d3-color";
import { keyword2rgb } from "@csstools/convert-colors";

export function parse(rawInput: string): Color | "unparsable" {
  const lch = rawInput
    .toLowerCase()
    .match(
      /^\s*lch\s*\(\s*([0-9.]+)\s*%\s+([0-9.]+)\s+([0-9.]+)(\s+([0-9.]+\s*%?))?\s*\)\s*$/
    );

  try {
    if (lch) {
      const o = lch[5] || "100%";
      const opacity = o.endsWith("%")
        ? Number(o.replace(/%$/, "")) / 100
        : Number(o);
      return colorFromLch(
        Number(lch[1]),
        Number(lch[2]),
        Number(lch[3]),
        opacity
      );
    }
  } catch (err) {}

  const input = rawInput.replace(/[\s;]/g, "").toLowerCase();

  const hexShort = input.match(/^#?\s*([a-f0-9]{3})([0-9a-f])?$/);
  if (hexShort) {
    return colorFromRgb(
      parseInt(hexShort[1][0].repeat(2), 16),
      parseInt(hexShort[1][1].repeat(2), 16),
      parseInt(hexShort[1][2].repeat(2), 16),
      parseInt((hexShort[2] || "f").repeat(2), 16) / 255
    );
  }

  const hexLong = input.match(/^#?\s*([a-f0-9]{6})([0-9a-f]{2})?$/);
  if (hexLong) {
    return colorFromRgb(
      parseInt(hexLong[1].substr(0, 2), 16),
      parseInt(hexLong[1].substr(2, 2), 16),
      parseInt(hexLong[1].substr(4, 2), 16),
      parseInt(hexLong[2] || "ff", 16) / 255
    );
  }

  const rgb = input.match(
    /^rgba?\(([0-9.]+),([0-9.]+),([0-9.]+)(,[0-9.]+%?)?\)$/
  );
  if (rgb)
    try {
      const o = (rgb[4] || "100%").replace(/,/g, "");
      const opacity = o.endsWith("%")
        ? Number(o.replace(/%$/, "")) / 100
        : Number(o);
      console.log("r", rgb);
      return colorFromRgb(
        Number(rgb[1]),
        Number(rgb[2]),
        Number(rgb[3]),
        opacity
      );
    } catch (err) {}

  const hsl = input.match(
    /^hsla?\(([0-9.]+),([0-9.]+)%,([0-9.]+)%(,[0-9.]+%?)?\)$/
  );
  try {
    if (hsl) {
      const o = (hsl[4] || "100%").replace(/,/g, "");
      const opacity = o.endsWith("%")
        ? Number(o.replace(/%$/, "")) / 100
        : Number(o);
      return colorFromHsl(
        Number(hsl[1]),
        Number(hsl[2]) / 100,
        Number(hsl[3]) / 100,
        opacity
      );
    }
  } catch (err) {}

  const keyword = keyword2rgb(rawInput);
  if (keyword)
    return colorFromRgb(
      keyword[0] * 2.55,
      keyword[1] * 2.55,
      keyword[2] * 2.55
    );

  const inputForRgbHsl = rawInput.replace(
    /(\d%?)(?:\s+|\s*\/\s*)(\d)/g,
    "$1,$2"
  );
  if (rawInput !== inputForRgbHsl) return parse(inputForRgbHsl);

  return "unparsable";
}
