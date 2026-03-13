import InvisibleSection from "@components/layouts/InvisibleSection";
import TextParagraph from "@components/ui/TextParagraph";
import { type JSX } from "react";
import BaseHeader, { type BaseHeaderProps } from "./BaseHeader";
import "./HeaderDescriptionAndImages.css";

/**
 * Interface for the HeaderDescriptionAndImages component props.
 */
interface HeaderDescriptionAndImagesProps extends BaseHeaderProps {
  /** Description text */
  descriptionText?: string;
  /** Array of image URLs or paths */
  imageUrls?: string[];
  /** Alt text prefix for images (will be suffixed with image number) */
  imageAltTextPrefix?: string;
  /** Whether images should be placed above (true) or below (false) the header and description */
  imagesAbove?: boolean;
  /** Whether or not to blur content background */
  blurContentBackground?: boolean;
  /** Maximum width for each image in pixels */
  maxImageWidth?: number;
  /** Gap between images in rem */
  imageGap?: number;
}

/**
 * HeaderDescriptionAndImages Component
 *
 * A flexible base component that displays a header, description text, and a horizontal row of images.
 * The images can be positioned either above or below the header and description content.
 * Images wrap to the next row if they don't fit horizontally.
 *
 * @param {HeaderDescriptionAndImagesProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function HeaderDescriptionAndImages(
  props: HeaderDescriptionAndImagesProps
): JSX.Element {
  const {
    descriptionText,
    imageUrls = [],
    imageAltTextPrefix = "Image",
    imagesAbove = false,
    blurContentBackground,
    maxImageWidth = 200,
    imageGap = 1,
    ...baseHeaderProps
  } = props;

  // Render the images row
  const renderImagesRow = (): JSX.Element | null => {
    if (!imageUrls || imageUrls.length === 0) return null;

    return (
      <div
        className="header-description-images-row"
        style={{
          gap: `${imageGap}rem`
        }}
      >
        {imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`${imageAltTextPrefix} ${index + 1}`}
            className="header-description-image"
            style={{
              maxWidth: `${maxImageWidth}px`
            }}
            onClick={() => window.open(imageUrl, "_blank")}
          />
        ))}
      </div>
    );
  };

  // Render the header and description content
  const renderHeaderAndDescription = (): JSX.Element => (
    <div className="header-description-content">
      <BaseHeader
        preHeadingText={baseHeaderProps.preHeadingText}
        titleText={baseHeaderProps.titleText}
        subtitleText={baseHeaderProps.subtitleText}
        authorDateText={baseHeaderProps.authorDateText}
        linkButtonUrl={baseHeaderProps.linkButtonUrl}
        linkButtonText={baseHeaderProps.linkButtonText}
        showTechStackLabels={baseHeaderProps.showTechStackLabels}
        techStackLabels={baseHeaderProps.techStackLabels}
      />

      {descriptionText && (
        <InvisibleSection>
          <TextParagraph text={descriptionText} spaceAfter={false} maxWidth={800} />
        </InvisibleSection>
      )}
    </div>
  );

  return (
    <InvisibleSection blur={blurContentBackground}>
      <div className="header-description-images-container">
        {imagesAbove && renderImagesRow()}
        {renderHeaderAndDescription()}
        {!imagesAbove && renderImagesRow()}
      </div>
    </InvisibleSection>
  );
}
