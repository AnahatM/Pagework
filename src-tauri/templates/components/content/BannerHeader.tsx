import type { JSX } from "react";
import "./BannerHeader.css";

/**
 * This interface defines the expected props for the BannerHeader component
 */
interface BannerHeaderProps {
  /** Optional pre-heading text */
  preHeadingText?: string;
  /** Main title text required */
  titleText: string;
  /** Optional subtitle text */
  subtitleText?: string;
}

/**
 * Renders a banner header component.
 *
 * @param props - Props that define the banner header content.
 *
 * @returns A JSX element representing the banner header.
 */
export default function BannerHeader(props: BannerHeaderProps): JSX.Element {
  return (
    // Panel container for the banner header UI
    <div className="banner-header-container">
      {/* Conditionally render pre-heading if provided */}
      {props.preHeadingText && (
        <h2 className="banner-header-pre-heading">{props.preHeadingText}</h2>
      )}

      {/* Main title of the banner header */}
      <h1 className="banner-header-title">{props.titleText}</h1>

      {/* Conditionally render subtitle if provided */}
      {props.subtitleText && <p className="banner-header-subtitle">{props.subtitleText}</p>}
    </div>
  );
}
