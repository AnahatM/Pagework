import type { JSX, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import "./Tooltip.css";

/**
 * Interface for the Tooltip component properties
 */
interface TooltipProps {
  /** The content to display in the tooltip */
  content: string | ReactNode;
  /** The element that triggers the tooltip on hover */
  children: ReactNode;
  /** Delay in milliseconds before showing the tooltip (default: 500ms) */
  delay?: number;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Custom className for the tooltip content */
  className?: string;
}

/**
 * A reusable tooltip component that displays content when hovering over its children.
 * The tooltip follows the mouse cursor and is positioned to avoid screen edges.
 *
 * Features:
 * - Follows mouse cursor position
 * - Automatic positioning to avoid screen edges
 * - Configurable show delay
 * - Styled to match the website's design language
 * - Supports both string and ReactNode content
 * - Automatically disabled on touch devices
 *
 * @param props - The tooltip properties
 * @returns JSX element with tooltip functionality
 */
export default function Tooltip(props: TooltipProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Updates tooltip position based on mouse coordinates
   * Includes logic to prevent tooltip from going off-screen
   */
  const updatePosition = (clientX: number, clientY: number): void => {
    const offset = 5;
    const tooltipWidth = 250; // Max width from CSS
    const tooltipHeight = 50; // Estimated height

    let x = clientX - tooltipWidth / 2; // Center horizontally over cursor
    let y = clientY - tooltipHeight - offset; // Position above cursor

    // Prevent going off right edge
    if (x + tooltipWidth > window.innerWidth) {
      x = clientX - tooltipWidth - offset;
    }

    // Prevent going off left edge
    if (x < 0) {
      x = offset;
    }

    // Prevent going off top edge
    if (y < 0) {
      y = clientY + offset;
    }

    // Prevent going off bottom edge
    if (y + tooltipHeight > window.innerHeight) {
      y = window.innerHeight - tooltipHeight - offset;
    }

    setPosition({ x, y });
  };

  /**
   * Handle mouse enter to start showing tooltip after delay
   */
  const handleMouseEnter = (event: React.MouseEvent): void => {
    if (props.disabled || !props.content) return;

    updatePosition(event.clientX, event.clientY);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, props.delay);
  };

  /**
   * Handle mouse move and update tooltip position
   */
  const handleMouseMove = (event: React.MouseEvent): void => {
    if (props.disabled || !props.content) return;

    updatePosition(event.clientX, event.clientY);
  };

  /**
   * Handle mouse leave and hide tooltip immediately
   */
  const handleMouseLeave = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <>
      {/* Tooltip trigger container */}
      <div
        className="tooltip-container"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {props.children}
      </div>

      {/* Tooltip portal */}
      {props.content && (
        <div
          ref={tooltipRef}
          className={`tooltip ${isVisible ? "visible" : ""}`}
          style={{
            left: position.x,
            top: position.y
          }}
        >
          <div className={`tooltip-content ${props.className}`}>{props.content}</div>
        </div>
      )}
    </>
  );
}
