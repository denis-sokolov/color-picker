import React from "react";
import type { Color } from "@lib/color";
import { Checkerboard } from "@lib/Checkerboard";
import "./styles.css";
import { computeColor, computeColors } from "./computeColors";
import { useMouseHeld } from "./useMouseHeld";

type Props = {
  from: Color;
  markAtRatio?: number;
  onChange: (color: Color) => void;
  to: Color;
};

const steps = 30;

export function Gradient(props: Props) {
  const { from, markAtRatio, onChange, to } = props;
  const [ref, isMouseHeld] = useMouseHeld();
  const colors = computeColors(from, to, steps);

  function processMouse(e: React.MouseEvent) {
    const container = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - container.x) / container.width;
    const color = computeColor(from, to, ratio);
    onChange(color);
  }

  return (
    <div className="gradient">
      {markAtRatio && (
        <div className="mark-scale">
          <div
            className="mark"
            style={{
              left: 100 * markAtRatio + "%",
            }}
          >
            ↓
          </div>
        </div>
      )}
      <Checkerboard>
        <div
          className="gradient-itself"
          onClick={processMouse}
          onMouseMove={function (e) {
            if (!isMouseHeld) return;
            processMouse(e);
          }}
          ref={ref}
          style={{
            background: [
              `linear-gradient(90deg,`,
              colors
                .map((c, i) => {
                  return (
                    c.asCss().ignoringPrecision + " " + (i * 100) / steps + "%"
                  );
                })
                .join(","),
              `)`,
            ].join(""),
          }}
        />
      </Checkerboard>
      <div className="outside-control">
        {colors.map(function (color, i) {
          const prev: Color | undefined = colors[i - 1];
          const next: Color | undefined = colors[i + 1];
          return (
            <div
              key={i}
              className={`step ${
                color.rgb.precise ? "inside-rgb" : "outside-rgb"
              }`}
              style={{
                flex: prev && next ? 1 : 0.5,
              }}
              title={
                color.rgb.precise
                  ? undefined
                  : "This color is outside sRGB color space and is not supported by the browsers at this time. The color picker will find the closest approximation."
              }
            />
          );
        })}
      </div>
    </div>
  );
}
