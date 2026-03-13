import assetPath from "@routes/AssetPathHandler";
import { type JSX } from "react";
import "./SectionImage.css";

/**
 * Props for the SectionImage component.
 * This component displays an image with optional caption and click behavior.
 */
interface SectionImageProps {
  /** Path to the image file */
  imagePath: string;
  /** Optional caption text to display under the image */
  caption?: string;
  /** Optional alt text for the image */
  altText?: string;
  /** Optional width for the image */
  widthPercent?: number | string;
  /** Optional height for the image */
  heightPercent?: number | string;
  /** Optional flag to disable clicking on the image */
  disableClick?: boolean;
}

/**
 * SectionImage component to display an image with optional caption and click behavior.
 * The image can be styled with width and height percentages, and clicking can be disabled.
 *
 * @param props - The properties for the SectionImage component.
 * @returns JSX.Element - The rendered section image with optional caption.
 */
export default function SectionImage(props: SectionImageProps): JSX.Element {
  // Handle image click behavior
  const handleImageClick = (): void => {
    if (!props.disableClick) {
      window.open(assetPath(props.imagePath), "_blank");
    }
  };

  return (
    <div className="section-image-container section-image-wrapper">
      <img
        src={assetPath(props.imagePath)}
        alt={props.altText || props.caption || "Section image"}
        className="section-image"
        style={{
          width:
            typeof props.widthPercent === "number"
              ? `${props.widthPercent}%`
              : props.widthPercent || "90%",
          height:
            typeof props.heightPercent === "number"
              ? `${props.heightPercent}%`
              : props.heightPercent || "auto",
          cursor: props.disableClick ? "default" : "pointer"
        }}
        onClick={handleImageClick}
      />
      {props.caption && <figcaption>{props.caption}</figcaption>}
    </div>
  );
}
