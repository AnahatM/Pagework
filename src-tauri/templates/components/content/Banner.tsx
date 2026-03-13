import { useTheme } from "@/hooks/useTheme";
import ScrollDownHint from "@components/other/ScrollDownHint";
import type { JSX } from "react";
import "./Banner.css";

/**
 * This interface defines the properties for the Banner component.
 */
interface BannerProps {
  /** Generic image URL that can be used as a fallback */
  imageUrl?: string;
  /** Light theme image URL */
  lightImageUrl?: string;
  /** Dark theme image URL */
  darkImageUrl?: string;
  /** Alt text for the image */
  altText: string;
  /** Optional maximum height for the image in pixels */
  maxHeightPx?: number;
  /** Optional children elements to render inside the banner */
  children?: JSX.Element | JSX.Element[];
  /** Optional properties for scroll hint functionality */
  showScrollHint?: boolean;
  /** Identifier of the target element to scroll to when hint is clicked */
  scrollHintTargetId?: string;
  /** Whether to hide the scroll hint when the user scrolls */
  hideScrollHintOnScroll?: boolean;
  /** Inline Styling Overrides */
  style?: React.CSSProperties;
}

/**
 * Determines the appropriate image URL based on the current theme.
 *
 * @param props - The properties for the Banner component.
 * @param isDarkMode - Boolean indicating if dark mode is active.
 *
 * @returns {string} The URL of the image to be displayed.
 */
const determineImageUrl = (props: BannerProps, isDarkMode: boolean): string => {
  // If both light and dark images are provided, use the appropriate one
  if (props.lightImageUrl && props.darkImageUrl)
    return isDarkMode ? props.darkImageUrl : props.lightImageUrl;

  // If only one theme-specific image is provided, use it as default
  if (props.lightImageUrl) return props.lightImageUrl;
  if (props.darkImageUrl) return props.darkImageUrl;

  // Fall back to the generic imageUrl
  if (props.imageUrl) return props.imageUrl;

  // This should not happen if the component is used correctly
  throw new Error("Banner component requires at least one image URL");
};

/**
 * Renders a banner with a themed image and optional scroll hint.
 *
 * @param props - The properties for the Banner component.
 *
 * @returns {JSX.Element} The banner rendered as a JSX element.
 */
export default function Banner(props: BannerProps): JSX.Element {
  // Use the custom hook to determine if dark mode is active
  const isDarkMode = useTheme();

  // If we have both light and dark images, use smooth transition approach
  if (props.lightImageUrl && props.darkImageUrl) {
    return (
      // Overall container for the banner
      <div className="banner-container" style={props.style}>
        {/* Light theme image */}
        <img
          className={`banner-image banner-image-light ${!isDarkMode ? "visible" : ""}`}
          src={props.lightImageUrl}
          alt={props.altText}
          style={props.maxHeightPx ? { maxHeight: `${props.maxHeightPx}px` } : {}}
        />

        {/* Dark theme image */}
        <img
          className={`banner-image banner-image-dark ${isDarkMode ? "visible" : ""}`}
          src={props.darkImageUrl}
          alt={props.altText}
          style={props.maxHeightPx ? { maxHeight: `${props.maxHeightPx}px` } : {}}
        />

        {/* Transition gradient at the bottom*/}
        <div className="banner-transition-gradient" />

        {/* Children elements to be rendered inside the banner */}
        <div className="banner-children-container">{props.children ?? ""}</div>

        {/* Optional scroll hint component */}
        {props.showScrollHint && (
          <div className="banner-scroll-hint">
            <ScrollDownHint
              targetId={props.scrollHintTargetId}
              hideOnScroll={props.hideScrollHintOnScroll}
            />
          </div>
        )}
      </div>
    );
  }

  // Fallback for single image or generic imageUrl
  return (
    // Overall container for the banner
    <div className="banner-container">
      {/* Image element with dynamic source and optional max height */}
      <img
        className="banner-image"
        src={determineImageUrl(props, isDarkMode)}
        alt={props.altText}
        style={props.maxHeightPx ? { maxHeight: `${props.maxHeightPx}px` } : {}}
      />

      {/* Children elements to be rendered inside the banner */}
      <div className="banner-children-container">{props.children ?? ""}</div>

      {/* Optional scroll hint component */}
      {props.showScrollHint && (
        <div className="banner-scroll-hint">
          <ScrollDownHint
            targetId={props.scrollHintTargetId}
            hideOnScroll={props.hideScrollHintOnScroll}
          />
        </div>
      )}
    </div>
  );
}
