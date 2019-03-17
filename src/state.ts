import color, { colorOnBackground, parse, Changes, Color } from "./color";

const lessHue = (h: number) => h - 40;
const moreHue = (h: number) => h + 40;
const lessSaturation = (s: number) => s - 30;
const moreSaturation = (s: number) => s + 30;
const lessLightness = (l: number) => l - 20;
const moreLightness = (l: number) => l + 20;

type State = {
  color: Color;
  textInputBackground: Color;
  textInputBackgroundShown: boolean;
  textInputColor: Color;
  textInputOpacity: number;
};

type Listener = () => void;

export default function makeState() {
  const state: State = {
    color: color(150, 50, 50),
    textInputBackground: color(0, 0, 100),
    textInputBackgroundShown: false,
    textInputColor: color(0, 0, 0),
    textInputOpacity: 1
  };
  const listeners: Listener[] = [];

  const change = function(changes: Partial<State>) {
    const newState = { ...state, ...changes };
    if (changes.textInputOpacity !== undefined)
      newState.textInputBackgroundShown = changes.textInputOpacity < 0.999;
    if (changes.textInputColor || changes.textInputBackground) {
      if (changes.color)
        throw new Error(`Can not set color and textInputColor at once`);
      newState.color = colorOnBackground(
        newState.textInputColor,
        newState.textInputOpacity,
        newState.textInputBackground
      );
    }

    Object.assign(state, newState);
    listeners.forEach(f => f());
  };

  const changeColor = function(changes: Changes) {
    change({ color: state.color.withChanges(changes) });
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
    setHue: (hue: number) => changeColor({ hue }),
    setLightness: (lightness: number) => changeColor({ lightness }),
    setLessHue: () => changeColor({ hue: lessHue(state.color.hue) }),
    setLessLightness: () =>
      changeColor({ lightness: lessLightness(state.color.lightness) }),
    setLessSaturation: () =>
      changeColor({ saturation: lessSaturation(state.color.saturation) }),
    setMoreHue: () => changeColor({ hue: moreHue(state.color.hue) }),
    setMoreLightness: () =>
      changeColor({ lightness: moreLightness(state.color.lightness) }),
    setMoreSaturation: () =>
      changeColor({ saturation: moreSaturation(state.color.saturation) }),
    setTextInputColor: (rawInput: string) => {
      const parsed = parse(rawInput);
      if (parsed === "unparsable") return;
      change({
        textInputColor: parsed.color,
        textInputOpacity: parsed.opacity
      });
    },
    setTextInputBackground: (hex: string) => {
      const res = parse(hex);
      if (res === "unparsable" || res.opacity < 0.9999)
        throw new Error(`Unexpected ${hex}`);
      change({ textInputBackground: res.color });
    },
    setSaturation: (saturation: number) => changeColor({ saturation }),
    textInputBackgroundHex: () => state.textInputBackground.hex(),
    textInputBackgroundShown: () => state.textInputBackgroundShown
  };
}
