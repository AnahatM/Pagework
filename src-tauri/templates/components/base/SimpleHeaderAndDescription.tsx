import SectionImage from "@components/content/SectionImage";
import InvisibleSection from "@components/layouts/InvisibleSection";
import TextParagraph from "@components/ui/TextParagraph";
import { type JSX } from "react";
import BaseHeader, { type BaseHeaderProps } from "./BaseHeader";
import "./SimpleHeaderAndDescription.css";

/**
 * Interface for the SimpleHeaderAndDescription component props.
 */
interface SimpleHeaderAndDescriptionProps extends BaseHeaderProps {
  /** Description text */
  descriptionText?: string;
  /** Image path for the left-side image (can be local path or URL) */
  imagePath: string;
  /** Alt text for the image */
  imageAltText?: string;
  /** Whether or not to blur content background */
  blurContentBackground?: boolean;
  /** Whether the image is a URL (true) or local asset path (false) */
  isImageUrl?: boolean;
}

/**
 * SimpleHeaderAndDescription component to display an image on the left with header and description on the right.
 * It shows a pre-heading, title, subtitle, optional link button, and description text.
 *
 * @param props - The properties for the SimpleHeaderAndDescription component.
 * @returns JSX.Element - The rendered simple header and description layout.
 */
export default function SimpleHeaderAndDescription(
  props: SimpleHeaderAndDescriptionProps
): JSX.Element {
  return (
    <>
      <InvisibleSection blur={props.blurContentBackground}>
        <div className="simple-header-description-container">
          {/* Left side - Image */}
          <div className="simple-header-description-image">
            {props.isImageUrl ? (
              <img
                src={props.imagePath}
                alt={props.imageAltText || props.titleText || "Article image"}
                className="simple-header-description-url-image"
                onClick={() => window.open(props.imagePath, "_blank")}
              />
            ) : (
              <SectionImage
                imagePath={props.imagePath}
                altText={props.imageAltText || props.titleText || "Article image"}
                widthPercent="100%"
                heightPercent="auto"
              />
            )}
          </div>

          {/* Right side - Header and Description */}
          <div className="simple-header-description-content">
            <BaseHeader
              preHeadingText={props.preHeadingText}
              titleText={props.titleText}
              subtitleText={props.subtitleText}
              authorDateText={props.authorDateText}
              linkButtonUrl={props.linkButtonUrl}
              linkButtonText={props.linkButtonText}
              showTechStackLabels={props.showTechStackLabels}
              techStackLabels={props.techStackLabels}
            />

            {props.descriptionText && (
              <InvisibleSection>
                <TextParagraph text={props.descriptionText} spaceAfter={false} maxWidth={800} />
              </InvisibleSection>
            )}
          </div>
        </div>
      </InvisibleSection>
    </>
  );
}
