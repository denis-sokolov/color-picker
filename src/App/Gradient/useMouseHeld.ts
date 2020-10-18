import { useEffect, useRef, useState } from "react";

export function useMouseHeld() {
  const [isHeld, setIsHeld] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const el = ref.current;
  useEffect(
    function () {
      if (!el) return;
      const down = () => setIsHeld(true);
      const up = () => setIsHeld(false);
      el.addEventListener("mousedown", down);
      document.addEventListener("mouseup", up);
      return () => {
        el.removeEventListener("mousedown", down);
        document.removeEventListener("mouseup", up);
      };
    },
    [el]
  );
  return [ref, isHeld] as const;
}
