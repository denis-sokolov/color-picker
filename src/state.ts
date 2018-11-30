import color, { parse, Changes } from "./color";

const lessHue = (h: number) => h - 40;
const moreHue = (h: number) => h + 40;
const lessSaturation = (s: number) => s - 30;
const moreSaturation = (s: number) => s + 30;
const lessLightness = (l: number) => l - 20;
const moreLightness = (l: number) => l + 20;

type Listener = () => void;

export default function makeState() {
  const state = { color: color(150, 50, 50) };
  const listeners: Listener[] = [];

  const change = function(changes: Changes) {
    state.color = state.color.withChanges(changes);
    listeners.forEach(f => f());
  };

  return {
    hex: () => state.color.hex(),
    hsl: () => state.color.hslString(),
    hue: () => state.color.hue,
    lessHueHex: () =>
      state.color.withChanges({ hue: lessHue(state.color.hue) }).hex(),
    lessLightnessHex: () =>
      state.color
        .withChanges({ lightness: lessLightness(state.color.lightness) })
        .hex(),
    lessSaturationHex: () =>
      state.color
        .withChanges({ saturation: lessSaturation(state.color.saturation) })
        .hex(),
    moreHueHex: () =>
      state.color.withChanges({ hue: moreHue(state.color.hue) }).hex(),
    moreLightnessHex: () =>
      state.color
        .withChanges({ lightness: moreLightness(state.color.lightness) })
        .hex(),
    moreSaturationHex: () =>
      state.color
        .withChanges({ saturation: moreSaturation(state.color.saturation) })
        .hex(),
    lightness: () => state.color.lightness,
    onChange: (f: Listener) => listeners.push(f),
    rgb: () => state.color.rgbString(),
    saturation: () => state.color.saturation,
    set: (color: string) => {
      const parsed = parse(color);
      if (parsed === "unparsable") return;
      change(parsed);
    },
    setHue: (hue: number) => change({ hue }),
    setLightness: (lightness: number) => change({ lightness }),
    setLessHue: () => change({ hue: lessHue(state.color.hue) }),
    setLessLightness: () =>
      change({ lightness: lessLightness(state.color.lightness) }),
    setLessSaturation: () =>
      change({ saturation: lessSaturation(state.color.saturation) }),
    setMoreHue: () => change({ hue: moreHue(state.color.hue) }),
    setMoreLightness: () =>
      change({ lightness: moreLightness(state.color.lightness) }),
    setMoreSaturation: () =>
      change({ saturation: moreSaturation(state.color.saturation) }),
    setSaturation: (saturation: number) => change({ saturation })
  };
}
