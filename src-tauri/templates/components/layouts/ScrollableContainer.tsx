import AnimatedScrollArrows from "@components/other/AnimatedScrollArrows";
import "@components/other/ScrollDownHint.css";
import { type JSX, type ReactNode, useEffect, useRef, useState } from "react";
import "./ScrollableContainer.css";

interface ScrollableContainerProps {
  /** Content to display inside the scrollable container */
  children: ReactNode;
  /** Maximum height of the container (e.g., "500px", "80vh") */
  maxHeight?: string;
  /** Enable border around the container */
  enableBorder?: boolean;
  /** Show scroll hint when content overflows */
  showScrollHint?: boolean;
}

/**
 * ScrollableContainer component creates a vertically scrollable area with a custom height.
 * Content that exceeds the specified height will be accessible via scrollbar.
 *
 * @param props - The props for the component
 * @returns The rendered component
 */
export default function ScrollableContainer({
  children,
  maxHeight = "600px",
  enableBorder = true,
  showScrollHint = true
}: ScrollableContainerProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!showScrollHint) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = (): void => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const hasOverflow = scrollHeight > clientHeight;

      setShowHint(isAtTop && hasOverflow);
    };

    // Check initial overflow state
    handleScroll();

    // Add scroll listener
    container.addEventListener("scroll", handleScroll);

    // Add resize observer to check overflow on content changes
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [showScrollHint, children]);

  const handleHintClick = (): void => {
    if (!containerRef.current) return;
    const scrollDistance = containerRef.current.clientHeight * 0.8;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollTop + scrollDistance,
      behavior: "smooth"
    });
  };

  const classNames = ["scrollable-container", enableBorder ? "with-border" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={containerRef} className={classNames} style={{ maxHeight }}>
      {children}
      {showScrollHint && showHint && (
        <button
          className="scroll-down-hint scroll-hint-container fade-in"
          onClick={handleHintClick}
          aria-label="Scroll down to see more content"
          type="button"
        >
          <span>Scroll down</span>
          <AnimatedScrollArrows />
        </button>
      )}
    </div>
  );
}
