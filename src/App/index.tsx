import React, { useState } from "react";
import "./app.css";
import { colorFromHsl } from "@lib/color";
import { ColorDisplay } from "./ColorDisplay";
import { Gradient } from "./Gradient";
import { Input } from "./Input";

export default function App() {
  const [color, setColor] = useState(colorFromHsl(186, 0.69, 0.49, 1));
  return (
    <div className="app">
      <div className="main-column">
        <Input color={color} onChangeColor={setColor} />
        <div style={{ height: 30 }} />
        <ColorDisplay color={color} />
        <div style={{ height: 30 }} />
        <Gradient
          from={color.withLightness(0)}
          markAtRatio={color.lightness / 100}
          to={color.withLightness(100)}
          onChange={setColor}
        />
        <div style={{ height: 12 }} />
        <Gradient
          from={color.withChroma(0)}
          markAtRatio={color.chroma / 110}
          to={color.withChroma(110)}
          onChange={setColor}
        />
        <div style={{ height: 12 }} />

        <Gradient
          from={color.withHue(0)}
          markAtRatio={color.hue / 359}
          to={color.withHue(359)}
          onChange={setColor}
        />

        <div style={{ height: 200 }} />

        <div className="footer">
          <a href="https://learnui.design/tools/gradient-generator.html">
            HCL gradients
          </a>
          <a href="https://colors-v1.sokolov.cc/">
            HSL color picker
          </a>{" "}
          <a href="https://github.com/denis-sokolov/color-picker">GitHub</a>
        </div>
      </div>
    </div>
  );
}
