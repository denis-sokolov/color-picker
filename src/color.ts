import { normal } from "color-blend";
import {
  hex as fromHex,
  hsl as fromHsl,
  keyword as fromKeyword,
  rgb as fromRgb
} from "color-convert";

export type Changes = {
  hue?: number;
  saturation?: number;
  lightness?: number;
};

export type Color = ReturnType<typeof color>;

// Apparently, npm package color does little of use.
// Besides, writing our own parser is fun and we can accept more forms.
export function parse(
  rawInput: string
): { color: Color; opacity: number } | "unparsable" {
  const fromTriplet = (triplet: [number, number, number]) =>
    color(triplet[0], triplet[1], triplet[2]);

  const input = rawInput.replace(/[\s;]/g, "").toLowerCase();

  const hexShort = input.match(/^#?\s*([a-f0-9]{3})([0-9a-f])?$/);
  if (hexShort) {
    return {
      color: fromTriplet(fromHex.hsl(hexShort[1])),
      opacity: parseInt((hexShort[2] || "f").repeat(2), 16) / 255
    };
  }

  const hexLong = input.match(/^#?\s*([a-f0-9]{6})([0-9a-f]{2})?$/);
  if (hexLong) {
    return {
      color: fromTriplet(fromHex.hsl(hexLong[1])),
      opacity: parseInt(hexLong[2] || "ff", 16) / 255
    };
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
      return {
        color: fromTriplet(
          fromRgb.hsl([Number(rgb[1]), Number(rgb[2]), Number(rgb[3])])
        ),
        opacity: opacity
      };
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
      return {
        color: color(Number(hsl[1]), Number(hsl[2]), Number(hsl[3])),
        opacity: opacity
      };
    }
  } catch (err) {}

  try {
    return {
      color: fromTriplet(fromKeyword.hsl(input as any)),
      opacity: 1
    };
  } catch (err) {}

  const inputForRgbHsl = rawInput.replace(
    /(\d%?)(?:\s+|\s*\/\s*)(\d)/g,
    "$1,$2"
  );
  if (rawInput !== inputForRgbHsl) return parse(inputForRgbHsl);

  return "unparsable";
}

export default function color(
  hue: number,
  saturation: number,
  lightness: number
) {
  if (typeof hue !== "number") throw new Error("Invalid hue");
  if (typeof saturation !== "number") throw new Error("Invalid saturation");
  if (typeof lightness !== "number") throw new Error("Invalid lightness");

  const clamp = (min: number, max: number, x: number) =>
    Math.min(max, Math.max(min, x));

  hue = ((hue % 360) + 360) % 360;
  saturation = clamp(0, 100, saturation);
  lightness = clamp(0, 100, lightness);

  const triplet: [number, number, number] = [hue, saturation, lightness];

  return {
    hex: () => "#" + fromHsl.hex(triplet).toLowerCase(),
    hslString: () => `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    hue,
    saturation,
    lightness,
    rgb: () => fromHsl.rgb(triplet),
    rgbString: () => {
      const r = fromHsl.rgb(triplet);
      return `rgb(${r[0]}, ${r[1]}, ${r[2]})`;
    },
    withChanges: (changes: Changes) =>
      color(
        changes.hue === undefined ? hue : changes.hue,
        changes.saturation === undefined ? saturation : changes.saturation,
        changes.lightness === undefined ? lightness : changes.lightness
      )
  };
}

export function colorOnBackground(
  color: Color,
  opacity: number,
  background: Color
): Color {
  const { r, g, b, a } = normal(
    {
      r: background.rgb()[0],
      g: background.rgb()[1],
      b: background.rgb()[2],
      a: 1
    },
    { r: color.rgb()[0], g: color.rgb()[1], b: color.rgb()[2], a: opacity }
  );
  if (a < 0.999) throw new Error(`Unexpected a ${a}`);
  const parsed = parse(`rgb(${r}, ${g}, ${b})`);
  if (parsed === "unparsable")
    throw new Error(`Unexpected unparsable ${r}, ${g}, ${b}`);
  return parsed.color;
}
