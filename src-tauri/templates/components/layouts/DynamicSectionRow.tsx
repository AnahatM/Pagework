import { type JSX } from "react";
import "./DynamicSectionRow.css";
import SectionPanel from "./SectionPanel";
import SectionWrapper from "./SectionWrapper";

/**
 * DynamicSectionRowProps interface defines the properties for the DynamicSectionRow component.
 */
interface DynamicSectionRowProps {
  /** Array of content for each section */
  sections: React.ReactNode[];
  /** Gap between sections in pixels (default: 20) */
  gap?: number;
  /** Minimum width for each section in pixels (default: 280) */
  minSectionWidth?: number;
  /** Whether all sections should have equal width (default: true) */
  equalWidth?: boolean;
  /** Breakpoint for when sections should wrap vertically in pixels (default: 720) */
  responsiveBreakpoint?: number;
}

/**
 * DynamicSectionRow component to display any number of sections horizontally.
 * Sections will wrap to new rows when screen space is insufficient.
 * Each section behaves like a normal section and can contain any content.
 *
 * @param {DynamicSectionRowProps} props - The properties for the DynamicSectionRow component.
 * @returns {JSX.Element} The rendered DynamicSectionRow component.
 */
export default function DynamicSectionRow(props: DynamicSectionRowProps): JSX.Element {
  const {
    sections,
    gap = 20,
    minSectionWidth = 280,
    equalWidth = true,
    responsiveBreakpoint = 720
  } = props;

  // Filter out any null/undefined sections
  const validSections = sections.filter((section) => section !== null && section !== undefined);

  if (validSections.length === 0) {
    return <></>;
  }

  // Create CSS custom properties for dynamic styling
  const cssVariables = {
    "--section-count": validSections.length,
    "--gap-size": `${gap}px`,
    "--min-section-width": `${minSectionWidth}px`,
    "--responsive-breakpoint": `${responsiveBreakpoint}px`
  } as React.CSSProperties;

  return (
    <SectionWrapper>
      <div
        className={`dynamic-section-row ${equalWidth ? "equal-width" : ""}`}
        style={cssVariables}
      >
        {validSections.map((section, index) => (
          <SectionPanel key={index} className="dynamic-section-panel">
            {section}
          </SectionPanel>
        ))}
      </div>
    </SectionWrapper>
  );
}
