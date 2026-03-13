import Tooltip from "@components/ui/Tooltip.tsx";
import type { JSX } from "react";
import { Link } from "react-router-dom";

/**
 * Interface for the properties of the FooterLink component.
 */
interface FooterLinkProps {
  /** The text to display for the link */
  label: string;
  /** The URL or path to navigate to */
  url: string;
  /** Whether to open the link in a new tab */
  openInNewTab?: boolean;
  /** Optional tooltip text to display on hover */
  tooltip?: string;
}

/**
 * FooterLink Component
 * Renders a single footer link that can either be an internal route (using React Router Link)
 * or an external link (using a regular anchor tag).
 *
 * @param props - The properties object.
 * @param props.label - The text to display for the link.
 * @param props.url - The URL or path to navigate to.
 * @param props.openInNewTab - Whether to open the link in a new tab (default: false).
 * @param props.tooltip - Optional tooltip text to display on hover.
 *
 * @returns {JSX.Element} The rendered footer link.
 */
export default function FooterLink(props: FooterLinkProps): JSX.Element {
  // Check if the URL is external (starts with http/https)
  const isExternalLink = props.url.startsWith("http://") || props.url.startsWith("https://");

  // Delay for tooltip in milliseconds
  const tooltipDelayMS = 300;

  // Create the appropriate link element
  let linkElement: JSX.Element;

  // If it's an external link or should open in a new tab, use Link with target="_blank"
  if (isExternalLink || props.openInNewTab) {
    linkElement = (
      <Link
        to={props.url}
        target={props.openInNewTab ? "_blank" : "_self"}
        rel={props.openInNewTab ? "noopener noreferrer" : undefined}
      >
        {props.label}
      </Link>
    );
  } else {
    // Otherwise, use React Router's Link for internal navigation
    linkElement = <Link to={props.url}>{props.label}</Link>;
  }

  // Wrap with tooltip if provided
  if (props.tooltip) {
    return (
      <Tooltip content={props.tooltip} delay={tooltipDelayMS}>
        {linkElement}
      </Tooltip>
    );
  }

  // Return the link element directly if no tooltip is provided
  return linkElement;
}
