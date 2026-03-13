import { useScrollPosition } from "@/hooks/useWindowEvents.ts";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import AnimatedScrollArrows from "./AnimatedScrollArrows";
import "./ScrollDownHint.css";

/**
 * ScrollDownHint component properties interface
 */
interface ScrollDownHintProps {
  /** Optional target element to scroll to. If not provided, scrolls down by viewport height */
  targetId?: string;
  /** Custom scroll offset in pixels */
  scrollOffset?: number;
  /** Hide the component when user scrolls */
  hideOnScroll?: boolean;
}

/**
 * Handles the click event for the scroll hint button.
 * Scrolls to a specific element or down by one viewport height.
 *
 * @param props - The properties for the ScrollDownHint component.
 * @param setIsVisible - State setter to control visibility of the hint
 */
const handleClick = (
  props: ScrollDownHintProps,
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  // If hideOnScroll is enabled, start fade out immediately
  if (props.hideOnScroll) {
    setIsVisible(false);
  }

  if (props.targetId) {
    // Scroll to specific element
    const element = document.getElementById(props.targetId);
    if (element) {
      const elementPosition = element.offsetTop - (props.scrollOffset || 0);
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  } else {
    // Scroll down by one viewport height
    const scrollDistance = window.innerHeight - (props.scrollOffset || 0);
    window.scrollTo({
      top: window.pageYOffset + scrollDistance,
      behavior: "smooth"
    });
  }
};

/**
 * ScrollDownHint component that displays a hint button
 * with animated arrows encouraging users to scroll down
 */
export default function ScrollDownHint(props: ScrollDownHintProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScrollPosition();

  // Handle scroll detection using the hook
  useEffect(() => {
    if (!props.hideOnScroll) return;

    if (scrollY > 50) {
      // Threshold to detect meaningful scroll down
      setIsVisible(false);
    } else {
      // Show again when scrolled back to top
      setIsVisible(true);
    }
  }, [scrollY, props.hideOnScroll]);

  // Don't render component completely but instead use CSS for visibility
  return (
    // This button will be visible only when isVisible is true
    <button
      className={`scroll-down-hint ${!isVisible ? "fade-out" : "fade-in"}`}
      onClick={() => handleClick(props, setIsVisible)}
      aria-label="Scroll down to see more content"
      type="button"
    >
      {/* Text content */}
      <span>Scroll down</span>
      {/* Animated arrows indicating scroll direction */}
      <AnimatedScrollArrows />
    </button>
  );
}
