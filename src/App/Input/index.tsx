import React from "react";
import { Color, colorFromString } from "@lib/color";
import "./styles.css";

type Props = {
  color: Color;
  onChangeColor: (c: Color) => void;
};

export function Input(props: Props) {
  const { color, onChangeColor } = props;
  return (
    <div className="input">
      <input
        autoFocus
        onInput={(e) => {
          const el = e.target;
          if (!(el instanceof HTMLInputElement)) return;
          const parsed = colorFromString(el.value);
          if (parsed !== "unparsable") onChangeColor(parsed);
        }}
        onFocus={(e) => e.target.select()}
        placeholder={color.asPrettyHsl().approximation}
      />
    </div>
  );
}
