import React from "react";
import { RiFileCopy2Line } from "react-icons/ri";
import "./styles.css";

type Props = {
  children: React.ReactNode;
  contents: string;
};

export function CopyMe(props: Props) {
  const { children, contents } = props;
  return (
    <button
      className="copyme"
      onClick={async function (e) {
        const el = e.target as HTMLButtonElement;
        el.style.opacity = "0";
        setTimeout(function () {
          el.style.opacity = "1";
        }, 50);
        navigator.clipboard.writeText(contents);
      }}
    >
      {children}
      <div className="icon">
        <RiFileCopy2Line />
      </div>
    </button>
  );
}
