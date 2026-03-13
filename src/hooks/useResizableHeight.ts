import { useCallback, useEffect, useRef, useState } from "react";

interface UseResizableHeightOptions {
  initialHeight: number;
  minHeight: number;
  maxHeight: number;
}

export function useResizableHeight({
  initialHeight,
  minHeight,
  maxHeight,
}: UseResizableHeightOptions) {
  const [height, setHeight] = useState(initialHeight);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startY.current = e.clientY;
      startHeight.current = height;
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    },
    [height],
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      // Dragging up increases height
      const delta = startY.current - e.clientY;
      const newHeight = startHeight.current + delta;
      setHeight(Math.min(maxHeight, Math.max(minHeight, newHeight)));
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
  }, [minHeight, maxHeight]);

  return { height, onMouseDown };
}
