import type React from "react";
import type { JSX } from "react";
import "./InvisibleSection.css";
import SectionPanel from "./SectionPanel";
import SectionWrapper from "./SectionWrapper";

/**
 * Props for the InvisibleSection component.
 */
interface InvisibleSectionProps {
  /** The content to be displayed within the section */
  children: React.ReactNode;
  /** Whether to blur the background */
  blur?: boolean;
  /** Add additional styles to the section */
  style?: React.CSSProperties;
}

/**
 * InvisibleSection component that wraps its children in a invisible section.
 * This is a simple layout component designed to provide a consistent structure for various sections.
 *
 * @param {Object} props - The properties for the InvisibleSection component.
 * @param {React.ReactNode} props.children - The content to be displayed within the section
 *
 * @returns {JSX.Element} The rendered InvisibleSection component.
 */
export default function InvisibleSection(props: InvisibleSectionProps): JSX.Element {
  const { children, blur = false } = props;

  return (
    <SectionWrapper>
      <div style={props.style} className={`invisible-section ${blur ? "blur" : ""}`}>
        <SectionPanel>{children}</SectionPanel>
      </div>
    </SectionWrapper>
  );
}
