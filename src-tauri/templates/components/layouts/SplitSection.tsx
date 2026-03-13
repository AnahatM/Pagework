import { type JSX } from "react";
import SectionPanel from "./SectionPanel";
import SectionWrapper from "./SectionWrapper";
import "./SplitSection.css";

/**
 * SplitSectionProps interface defines the properties for the SplitSection component.
 * @property {React.ReactNode} [leftContent] - Content to be displayed in the left panel.
 * @property {React.ReactNode} [rightContent] - Content to be displayed in the right panel.
 */
interface SplitSectionProps {
  /** Content to be displayed in the left panel */
  leftContent?: React.ReactNode;
  /** Content to be displayed in the right panel */
  rightContent?: React.ReactNode;
}

/**
 * SplitSection component to display content in two panels side by side.
 * @param {SplitSectionProps} props - The properties for the SplitSection component.
 * @returns {JSX.Element} The rendered SplitSection component.
 */
export default function SplitSection(props: SplitSectionProps): JSX.Element {
  return (
    <SectionWrapper>
      <div className="split-section">
        <SectionPanel>{props.leftContent}</SectionPanel>
        <SectionPanel>{props.rightContent}</SectionPanel>
      </div>
    </SectionWrapper>
  );
}
