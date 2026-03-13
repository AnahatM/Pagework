import { useCallback, useEffect, useRef, useState } from "react";

interface UseResizablePanelOptions {
  /** Initial width in px */
  initialWidth: number;
  /** Minimum width in px */
  minWidth: number;
  /** Maximum width in px */
  maxWidth: number;
  /** Which side the drag handle is on */
  side: "left" | "right";
}

export function useResizablePanel({
  initialWidth,
  minWidth,
  maxWidth,
  side,
}: UseResizablePanelOptions) {
  const [width, setWidth] = useState(initialWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width],
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      const newWidth =
        side === "left"
          ? startWidth.current + delta
          : startWidth.current - delta;
      setWidth(Math.min(maxWidth, Math.max(minWidth, newWidth)));
    }

    function onMouseUp() {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [minWidth, maxWidth, side]);

  return { width, onMouseDown };
}
