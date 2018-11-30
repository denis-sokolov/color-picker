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
export function parse(rawInput: string): Color | "unparsable" {
  const fromTriplet = (triplet: [number, number, number]) =>
    color(triplet[0], triplet[1], triplet[2]);

  const input = rawInput.replace(/[\s;]/g, "").toLowerCase();

  const hexShort = input.match(/^#?\s*([a-f0-9]{3})[0-9a-f]?$/);
  if (hexShort) return fromTriplet(fromHex.hsl(hexShort[1]));

  const hexLong = input.match(/^#?\s*([a-f0-9]{6})([0-9a-f]{2})?$/);
  if (hexLong) return fromTriplet(fromHex.hsl(hexLong[1]));

  const rgb = input.match(
    /^rgba?\(([0-9.]+),([0-9.]+),([0-9.]+)(?:,[0-9.]+%?)?\)$/
  );
  if (rgb)
    try {
      return fromTriplet(
        fromRgb.hsl([Number(rgb[1]), Number(rgb[2]), Number(rgb[3])])
      );
    } catch (err) {}

  const hsl = input.match(
    /^hsla?\(([0-9.]+),([0-9.]+)%,([0-9.]+)%(?:,[0-9.]+%?)?\)$/
  );
  try {
    if (hsl) return color(Number(hsl[1]), Number(hsl[2]), Number(hsl[3]));
  } catch (err) {}

  try {
    return fromTriplet(fromKeyword.hsl(input as any));
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
