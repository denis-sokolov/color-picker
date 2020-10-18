declare module "@csstools/convert-colors" {
  type List = [number, number, number];
  export function hsl2lch(h: number, s: number, l: number): List;
  export function keyword2rgb(keyword: string): List | null;
  export function lch2hex(l: number, c: number, h: number): string;
  export function lch2hsl(l: number, c: number, h: number): List;
  export function lch2rgb(r: number, g: number, b: number): List;
  export function rgb2hsl(r: number, g: number, b: number): List;
}
