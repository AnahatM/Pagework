import type { JSX } from "react";
import "./GenericSection.css";
import SectionPanel from "./SectionPanel";
import SectionWrapper from "./SectionWrapper";

/**
 * GenericSection component that wraps its children in a styled section.
 * This is a simple layout component designed to provide a consistent structure for various sections.
 *
 * @param {Object} props - The properties for the GenericSection component.
 * @param {React.ReactNode} props.children - The content to be displayed within the section
 *
 * @returns {JSX.Element} The rendered GenericSection component.
 */
export default function GenericSection({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <SectionWrapper>
      <div className="generic-section">
        <SectionPanel>{children}</SectionPanel>
      </div>
    </SectionWrapper>
  );
}
