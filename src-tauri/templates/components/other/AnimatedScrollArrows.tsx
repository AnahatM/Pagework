import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { JSX } from "react";
import "./AnimatedScrollArrows.css";

/**
 * AnimatedScrollArrows component that displays animated downward-pointing arrows
 * to indicate scrollable content below
 */
export default function AnimatedScrollArrows(): JSX.Element {
  return (
    <div className="animated-scroll-arrows">
      <FontAwesomeIcon icon={faChevronDown} className="arrow-icon arrow-1" />
      <FontAwesomeIcon icon={faChevronDown} className="arrow-icon arrow-2" />
      <FontAwesomeIcon icon={faChevronDown} className="arrow-icon arrow-3" />
    </div>
  );
}
