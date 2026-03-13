import assetPath from "@routes/AssetPathHandler";
import { type JSX } from "react";

/**
 * Interface for the properties of the SocialIcon component.
 */
interface SocialIconProps {
  /** The URL that the icon links to. */
  url: string;
  /** The path to the icon image. */
  imgSrc: string;
  /** The alternative text for the image for accessibility. */
  alt: string;
  /** Whether to invert the icon colors in dark mode, default is true. */
  invertOnDarkMode?: boolean;
}

/**
 * A React component that renders a social icon as a clickable image link to an external URL.
 *
 * @param props - The properties for the social icon.
 *
 * @returns A JSX element representing the social icon link.
 */
export default function SocialIcon(props: SocialIconProps): JSX.Element {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`social-link ${props.invertOnDarkMode ? "invert-on-dark" : "no-invert"}`}
    >
      <img src={assetPath(props.imgSrc)} alt={props.alt} />
    </a>
  );
}
