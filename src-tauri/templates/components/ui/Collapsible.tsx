import { useState, type JSX, type ReactNode } from "react";
import "./Collapsible.css";

/**
 * Props for the Collapsible component
 */
interface CollapsibleProps {
  /** The title text displayed in the collapsible header */
  title: string;
  /** The content to show/hide when expanded/collapsed */
  children: ReactNode;
  /** Whether the collapsible should be expanded by default. Defaults to false */
  defaultExpanded?: boolean;
  /** Additional CSS class names to apply to the root element */
  className?: string;
}

/**
 * A collapsible component that shows a title with horizontal lines on either side
 * and can be expanded to reveal child content.
 *
 * @example
 * ```tsx
 * <Collapsible title="Settings" defaultExpanded={false}>
 *   <div>Your settings content here</div>
 * </Collapsible>
 * ```
 *
 * Features:
 * - Accessible with proper ARIA attributes
 * - Keyboard navigation support
 * - Smooth expand/collapse animation
 * - Customizable styling via className prop
 * - No background or padding applied to children
 * - Title positioned between horizontal lines
 */
export default function Collapsible({
  title,
  children,
  defaultExpanded = false,
  className = ""
}: CollapsibleProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`collapsible ${className}`}>
      <div className="collapsible-header-container">
        <div className="collapsible-line-left" />
        <button
          className={`collapsible-header ${isExpanded ? "expanded" : "collapsed"}`}
          onClick={toggleExpanded}
          type="button"
          aria-expanded={isExpanded}
          aria-controls="collapsible-content"
          aria-labelledby="collapsible-title"
        >
          <h3 id="collapsible-title" className="collapsible-title">
            {title}
          </h3>
          <span className={`collapsible-icon ${isExpanded ? "expanded" : ""}`}>
            {isExpanded ? "−" : "+"}
          </span>
        </button>
        <div className="collapsible-line-right" />
      </div>
      {isExpanded && (
        <div
          id="collapsible-content"
          className="collapsible-content"
          role="region"
          aria-labelledby="collapsible-title"
        >
          {children}
        </div>
      )}
    </div>
  );
}
