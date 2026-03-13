import React, { type JSX } from "react";
import "./SectionWrapper.css";

/**
 * SectionWrapper component that provides a full-width section container
 * to center its content. Useful for creating consistent layouts across pages.
 *
 * @param {Object} props - The properties for the SectionWrapper component.
 * @param {React.ReactNode} props.children - The content to be wrapped inside the section.
 *
 * @returns {JSX.Element} The rendered section wrapper with centered content.
 */
export default function SectionWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    // Full width section container to center content
    <div className="section-wrapper">
      <div className="section-content">{children}</div>
    </div>
  );
}
