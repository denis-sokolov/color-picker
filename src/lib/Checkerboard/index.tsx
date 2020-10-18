import React from "react";
import "./styles.css";

type Props = {
  children: React.ReactNode;
};

export function Checkerboard(props: Props) {
  const { children } = props;
  return <div className="checkerboard">{children}</div>;
}
