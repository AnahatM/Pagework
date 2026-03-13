import assetPath from "@routes/AssetPathHandler";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import "./LinkButton.css";

/**
 * This interface defines the properties that can be passed to the LinkButton component.
 */
interface LinkButtonProps {
  /** The type of background for the button. */
  backgroundType: "primary" | "secondary" | "transparent";
  /** The type of font for the button. Defaults to "normal". */
  fontType?: "normal" | "display";
  /** The type of outline for the button. Defaults to "none". */
  outlineType?: "none" | "normal" | "primary";
  /** The URL the button links to. */
  href: string;
  /** If true, the link opens in a new tab. Defaults to false. */
  openInNewTab?: boolean;
  /** Optional icon path to display next to the link text. */
  iconPath?: string;
  /** Alt text for the optional icon. Defaults to "Link Icon". */
  iconAlt?: string;
  /** The text to display for the link. */
  linktext: string;
  /** If true, the button width fits to text content. Defaults to false. */
  fitToText?: boolean;
  /** Optional CSS class name for additional styling. */
  className?: string;
}

/**
 * Renders a customizable link button component.
 *
 * @property {string} href - The target URL.
 * @property {boolean} openInNewTab - If true, the link opens in a new tab.
 * @property {string} iconPath - Optional icon path.
 * @property {string} iconAlt - Alt text for the optional icon.
 * @property {string} linktext - The link text.
 * @property {boolean} fitToText - If true, button width fits to text content.
 * @property backgroundType - Background style for the button; "primary" | "secondary" | "transparent"
 * @property fontType - Font style; "normal" | "display"
 * @property outlineType - Outline style; "none" | "normal" | "primary"
 *
 * @returns {JSX.Element} The rendered LinkButton component.
 */
export default function LinkButton(props: LinkButtonProps): JSX.Element {
  const fontType = props.fontType || "normal";
  const outlineType = props.outlineType || "none";

  const classNames = [
    "link-button",
    `background-${props.backgroundType}`,
    `font-${fontType}`,
    `outline-${outlineType}`,
    props.fitToText ? "fit-to-text" : "",
    props.className ?? ""
  ].join(" ");

  return (
    // Clickable link that looks like a button
    <Link to={props.href} className={classNames} target={props.openInNewTab ? "_blank" : undefined}>
      {props.iconPath && (
        // Optional icon displayed next to the link text
        <img
          src={assetPath(props.iconPath)}
          alt={props.iconAlt || "Link Icon"}
          className="link-button-icon"
        />
      )}
      {props.linktext}
    </Link>
  );
}
