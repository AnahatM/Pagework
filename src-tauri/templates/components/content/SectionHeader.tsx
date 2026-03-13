import LinkButton from "@components/ui/LinkButton";
import { type JSX } from "react";
import "./SectionHeader.css";

/**
 * SectionHeader component props interface.
 */
interface SectionHeaderProps {
  /** The main title of the section. */
  title: string;
  /** Optional subtitle for the section. */
  subtitle?: string;
  /** Optional pre-heading text for the section shown above the title. */
  preHeading?: string;
  /** Optional URL for a main link button for the section. */
  linkButtonUrl?: string;
  /** Optional text for the main link button. */
  linkButtonText?: string;
  /** Optional alignment for the section header text. Defaults to "left". */
  align?: "left" | "center";
  /** This setting forces the linkButton to be shown below the title/subtitle always. */
  linkButtonAlwaysBelow?: boolean;
}

/**
 * SectionHeader component for displaying a section header with optional elements.
 *
 * @param props - The props for the component.
 * @returns The rendered SectionHeader component.
 */
export default function SectionHeader(props: SectionHeaderProps): JSX.Element {
  const hasLinkButton = props.linkButtonUrl && props.linkButtonText;
  const alignment = props.align || "left"; // Default to "left" if not specified

  return (
    <div
      className={`section-header ${alignment} ${!hasLinkButton ? "no-link-button" : ""} ${
        props.linkButtonAlwaysBelow ? "link-button-always-below" : ""
      }`}
    >
      <div className="section-header-main" style={{ textAlign: alignment }}>
        {props.preHeading && <h3 className="section-header-preheading">{props.preHeading}</h3>}
        <h2 className="section-header-title">{props.title}</h2>
        {props.subtitle && <p className="section-header-subtitle">{props.subtitle}</p>}
      </div>

      <div className="section-header-actions">
        {hasLinkButton && (
          <LinkButton
            href={props.linkButtonUrl!}
            linktext={props.linkButtonText!}
            backgroundType="primary"
            outlineType="none"
            openInNewTab={false}
            fontType="display"
          />
        )}
      </div>
    </div>
  );
}
