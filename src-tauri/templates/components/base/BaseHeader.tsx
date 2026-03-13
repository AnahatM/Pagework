import SectionHeader from "@components/content/SectionHeader";
import InvisibleSection from "@components/layouts/InvisibleSection";
import LinkButton from "@components/ui/LinkButton";
import TextParagraph from "@components/ui/TextParagraph";
import FlexRow from "@components/utils/FlexRow";
import SizedBox from "@components/utils/SizedBox";
import React, { type JSX } from "react";
import "./HeaderAndContent.css";

/**
 * Interface for the BaseHeader component props.
 */
export interface BaseHeaderProps {
  /** Pre-heading Text */
  preHeadingText?: string;
  /** Title Text */
  titleText?: string;
  /** Subtitle Text */
  subtitleText?: string;
  /** Author-Date Text */
  authorDateText?: string;
  /** Link Button URL */
  linkButtonUrl?: string;
  /** Link Button Text */
  linkButtonText?: string;
  /** Show Tech Stack Labels */
  showTechStackLabels?: boolean;
  /** Tech Stack Labels */
  techStackLabels?: React.ReactNode[];
}

/**
 * Base Header component to display a header
 * It can be used to show a pre-heading, title, subtitle, and an optional link button.
 *
 * @param props - The properties for the BaseHeader component.
 * @returns JSX.Element - The rendered header and content.
 */
export default function BaseHeader(props: BaseHeaderProps): JSX.Element {
  return (
    <>
      <InvisibleSection blur>
        <SectionHeader
          preHeading={props.preHeadingText}
          title={props.titleText || ""}
          subtitle={props.subtitleText}
        />
        <FlexRow justifyContent="space-between" alignItems="center" flexDirection="row" fullWidth>
          <TextParagraph text={props.authorDateText || ""} fullWidth={false} />
          <LinkButton
            linktext={props.linkButtonText || ""}
            href={props.linkButtonUrl || "/"}
            backgroundType="primary"
            fontType="display"
            openInNewTab
          />
        </FlexRow>
        {props.showTechStackLabels && props.techStackLabels && <SizedBox height={20} />}
        {props.showTechStackLabels && props.techStackLabels && (
          <FlexRow justifyContent="flex-start" alignItems="center" gap={10} fullWidth>
            <TextParagraph text="Developed with " fullWidth={false} />
            {props.techStackLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </FlexRow>
        )}
      </InvisibleSection>
    </>
  );
}
