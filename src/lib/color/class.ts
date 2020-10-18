import { rgb2hsl } from "@csstools/convert-colors";
import { closestRgb } from "./closestRgb";
import { clamp } from "./clamp";
import { Imprecise, makeApproximate, makePrecise } from "./imprecise";

export type Color = ColorClass;

function normalizeHue(h: number) {
  h = h % 360;
  if (h < 0) h = (360 + h) % 360;
  return h;
}

function round(number: number) {
  const coef = 1;
  return Math.round(number * coef) / coef;
}

export class ColorClass {
  /**
   * 0 to 100-130 (in theory to infinity)
   */
  public readonly luminance: number;
  /**
   * 0 to 110-150 (in theory to infinity)
   */
  public readonly chroma: number;
  /**
   * 0-359
   */
  public readonly hue: number;
  /**
   * 0-1
   */
  public readonly opacity: number;
  public readonly rgb: Imprecise<{ r: number; g: number; b: number }>;

  constructor(params: { l: number; c: number; h: number; opacity: number }) {
    if (params.l < 0) throw new Error(`Unexpected luminance ${params.l}`);
    if (params.c < 0) throw new Error(`Unexpected chroma ${params.c}`);
    this.luminance = params.l;
    this.chroma = params.c;
    this.hue = normalizeHue(params.h);
    this.opacity = params.opacity;

    const t = closestRgb(this.luminance, this.chroma, this.hue);
    this.rgb =
      t.chromaAdjustment === 0
        ? makePrecise({ r: t.r, g: t.g, b: t.b })
        : makeApproximate({ r: t.r, g: t.g, b: t.b });
  }

  public asCss() {
    return this.rgb.map(({ r, g, b }) =>
      [
        this.opacity < 1 ? `rgba(` : `rgb(`,
        `${r}, ${g}, ${b}`,
        this.opacity < 1 ? `, ${this.opacity}` : ``,
        `)`,
      ].join("")
    );
  }

  public asPrettyHex() {
    const pad = (s: string) => (s.length === 1 ? "0" + s : s);
    return this.rgb.map(({ r, g, b }) =>
      [
        "#",
        pad(round(r).toString(16)),
        // "-",
        pad(round(g).toString(16)),
        // "-",
        pad(round(b).toString(16)),
        // "-",
        this.opacity < 1 ? pad(round(this.opacity * 255).toString(16)) : ``,
      ].join("")
    );
  }

  public asPrettyLch() {
    return [
      `lch(`,
      `${round(this.luminance)}%`,
      ` ${round(this.chroma)}`,
      ` ${round(this.hue)}`,
      this.opacity < 1 ? ` / ${this.opacity}` : "",
      `)`,
    ].join("");
  }

  public asPrettyHsl() {
    // Tried d3-color, but https://github.com/d3/d3-color/issues/83
    return this.rgb.map(({ r, g, b }) => {
      const [h, s, l] = rgb2hsl(r / 2.55, g / 2.55, b / 2.55);
      const hasAlpha = round(this.opacity) < 1;
      const res = [
        hasAlpha ? "hsla" : "hsl",
        `(`,
        `${round(h) % 360},`,
        ` ${round(clamp(s, 0, 100))}%,`,
        ` ${round(clamp(l, 0, 100))}%`,
        hasAlpha ? `, ${this.opacity}` : "",
        `)`,
      ].join("");
      return res;
    });
  }

  public asPrettyRgb() {
    return this.rgb.map(({ r, g, b }) =>
      [
        this.opacity < 1 ? `rgba(` : `rgb(`,
        `${round(r)}, ${round(g)}, ${round(b)}`,
        this.opacity < 1 ? `, ${this.opacity}` : ``,
        `)`,
      ].join("")
    );
  }

  public withChroma(chroma: number) {
    return new ColorClass({
      c: chroma,
      h: this.hue,
      l: this.luminance,
      opacity: this.opacity,
    });
  }

  public withHue(hue: number) {
    return new ColorClass({
      c: this.chroma,
      h: hue,
      l: this.luminance,
      opacity: this.opacity,
    });
  }

  public withLuminance(luminance: number) {
    return new ColorClass({
      c: this.chroma,
      h: this.hue,
      l: luminance,
      opacity: this.opacity,
    });
  }
}
