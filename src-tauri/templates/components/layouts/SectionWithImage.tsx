import type { JSX } from "react";
import { useState } from "react";
import SectionPanel from "./SectionPanel";
import "./SectionWithImage.css";
import SectionWrapper from "./SectionWrapper";

/**
 * Props for the SectionWithImage component.
 */
interface SectionWithImageProps {
  /** Content to be displayed within the section */
  children: React.ReactNode;
  /** URL of the image to display */
  imageUrl: string;
  /** Alt text for the image */
  altText?: string;
  /** Position of the image relative to content */
  imagePosition?: "left" | "right";
  /** Style of the image display */
  imageStyle: "floating" | "stretchToEdge";
  /** Minimum height for the image container in pixels (default: 200) */
  minImageHeight?: number;
  /** Whether to apply a tinted filter to the image (default: true) */
  tintImage?: boolean;
  /** Whether to remove the tint on hover - only works if tintImage is true (default: false) */
  removeTintOnHover?: boolean;
  /** Whether to brighten the image on hover - only works if tintImage is true and removeTintOnHover is false (default: true) */
  brightenImageOnHover?: boolean;
}

/**
 * SectionWithImage component that has content on one side and an image on the other.
 * This is a simple layout component designed to provide a consistent structure for various sections.
 *
 * @param {Object} props - The properties for the SectionWithImage component.
 * @param {React.ReactNode} props.children - The content to be displayed within the section
 * @param {string} props.imageUrl - The URL of the image to display
 * @param {string} props.altText - Alt text for the image
 * @param {"left" | "right"} props.imagePosition - Position of the image relative to content
 * @param {"floating" | "stretchToEdge"} props.imageStyle - Style of the image display
 * @param {number} props.minImageHeight - Minimum height for the image container in pixels (default: 200)
 * @param {boolean} props.tintImage - Whether to tint the image (default: true)
 * @param {boolean} props.removeTintOnHover - Whether to remove the tint on hover (default: false)
 * @param {boolean} props.brightenImageOnHover - Whether to brighten the image on hover (default: true)
 *
 * @returns {JSX.Element} The rendered SectionWithImage component.
 */
export default function SectionWithImage(props: SectionWithImageProps): JSX.Element {
  // Destructure props with default values
  const {
    children,
    imageUrl,
    altText = "Section Image",
    imagePosition = "right",
    imageStyle,
    minImageHeight = 200,
    tintImage = true,
    removeTintOnHover = false,
    brightenImageOnHover = true
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  // Set the container style based on the minimum image height
  const containerStyle = {
    minHeight: `${minImageHeight}px`
  };

  // Calculate the image filter styles based on props and hover state
  const getImageFilter = (): string => {
    const baseFilter = "grayscale(100%) sepia(20%) hue-rotate(210deg) saturate(100%)";
    const tintedFilter = `${baseFilter} brightness(90%) contrast(1.2)`;
    const brightenedFilter = `${baseFilter} brightness(110%) contrast(1.2)`;

    // If tinting is disabled, no filter effects apply
    if (!tintImage) {
      return "none";
    }

    // If hovering and removeTintOnHover is enabled, remove all filters
    if (isHovered && removeTintOnHover) {
      return "none";
    }

    // If hovering and brightenImageOnHover is enabled (and removeTintOnHover is not), brighten
    if (isHovered && brightenImageOnHover && !removeTintOnHover) {
      return brightenedFilter;
    }

    // Default tinted state
    return tintedFilter;
  };

  // Determine the inline style for the image based on the imageStyle prop
  const imageStyle_inline = {
    ...(imageStyle === "stretchToEdge" && {
      minHeight: `${minImageHeight}px`
    }),
    filter: getImageFilter(),
    transition: "filter 0.3s ease, transform 0.3s ease"
  };

  // Generate CSS classes for the image
  const imageClasses = ["section-image", `image-${imagePosition}`, `image-${imageStyle}`].join(" ");

  return (
    <SectionWrapper>
      <SectionPanel className="section-with-image">
        <div
          className={`section-with-image-content image-${imagePosition} image-${imageStyle}`}
          style={containerStyle}
        >
          {/* Render the content of the section */}
          <div className="section-text-content">{children}</div>

          {/* Render the image with the specified styles and properties */}
          <img
            src={imageUrl}
            alt={altText}
            className={imageClasses}
            style={imageStyle_inline}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </div>
      </SectionPanel>
    </SectionWrapper>
  );
}
