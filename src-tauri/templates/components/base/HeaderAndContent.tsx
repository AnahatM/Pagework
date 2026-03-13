import Banner from "@components/content/Banner";
import InvisibleSection from "@components/layouts/InvisibleSection";
import BackgroundGradientTransition from "@components/utils/BackgroundGradientTransition";
import React, { type JSX } from "react";
import BaseHeader, { type BaseHeaderProps } from "./BaseHeader";
import "./HeaderAndContent.css";

/**
 * Interface for the HeaderAndContent component props.
 */
interface HeaderAndContentProps extends BaseHeaderProps {
  /** Children */
  children: React.ReactNode;
  /** Banner Image URL */
  bannerImageUrl?: string;
  /** Whether or not to blur content background */
  blurContentBackground?: boolean;
  /** Image Gallery URLs */
  imageGallery?: string[];
}

/**
 * HeaderAndContent component to display a header with content.
 * It can be used to show a pre-heading, title, subtitle, and an optional link button.
 *
 * @param props - The properties for the HeaderAndContent component.
 * @returns JSX.Element - The rendered header and content.
 */
export default function HeaderAndContent(props: HeaderAndContentProps): JSX.Element {
  return (
    <>
      <BackgroundGradientTransition direction="bottom" />

      {props.bannerImageUrl && (
        <Banner
          lightImageUrl={props.bannerImageUrl}
          altText={`${props.titleText} Banner`}
          showScrollHint={false}
        />
      )}

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

      {/* Content Section with optional Image Gallery */}
      <InvisibleSection blur={props.blurContentBackground}>
        {props.imageGallery && props.imageGallery.length > 0 ? (
          <div className="content-with-gallery">
            {/* Image Gallery - vertical column on desktop, horizontal row on mobile */}
            <div className="image-gallery">
              {props.imageGallery.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="gallery-image"
                  onClick={() => window.open(imageUrl, "_blank")}
                />
              ))}
            </div>

            {/* Main Content */}
            <div className="main-content">{props.children}</div>
          </div>
        ) : (
          props.children
        )}
      </InvisibleSection>
    </>
  );
}
