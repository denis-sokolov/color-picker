import React from "react";
import type { Color } from "@lib/color";
import { Checkerboard } from "@lib/Checkerboard";
import "./styles.css";
import { CopyMe } from "../CopyMe";

type Props = {
  color: Color;
};

export function ColorDisplay(props: Props) {
  const { color } = props;
  return (
    <div className="color-display">
      <CopyMe contents={color.asPrettyLch()}>
        <div className="main-format">{color.asPrettyLch()}</div>
      </CopyMe>
      <div style={{ height: 0 }} />
      <div className="other-formats">
        <CopyMe contents={color.asPrettyHex().ignoringPrecision}>
          {color.asPrettyHex().ignoringPrecision}
        </CopyMe>
        <CopyMe contents={color.asPrettyRgb().ignoringPrecision}>
          {color.asPrettyRgb().ignoringPrecision}
        </CopyMe>
        <CopyMe contents={color.asPrettyHsl().ignoringPrecision}>
          {color.asPrettyHsl().ignoringPrecision}
        </CopyMe>
      </div>
      <div style={{ height: 16 }} />
      <div
        className="outside-rgb"
        style={{
          visibility: color.rgb.precise ? "hidden" : undefined,
        }}
      >
        Color outside sRGB, showing a less saturated approximation
      </div>
      <div style={{ height: 8 }} />
      <Checkerboard>
        <div
          className="color"
          style={{ backgroundColor: color.asCss().ignoringPrecision }}
        ></div>
      </Checkerboard>
    </div>
  );
}
