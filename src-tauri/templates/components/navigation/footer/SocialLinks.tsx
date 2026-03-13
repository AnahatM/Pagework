import { socialLinks } from "@routes/FooterConfiguration.ts";
import type { JSX } from "react";
import SocialIcon from "./SocialIcon.tsx";
import "./SocialLinks.css";

/**
 * Props for the SocialLinks component.
 */
interface SocialLinksProps {
  /** Makes the links container full width */
  fullWidth?: boolean;
  /** Justify of the links container */
  justifyContent?: "flex-start" | "center" | "flex-end";
}

/**
 * Renders social icons from the generated FooterConfiguration.
 */
export default function SocialLinks(props: SocialLinksProps): JSX.Element {
  const { fullWidth = undefined, justifyContent = "center" } = props;

  if (socialLinks.length === 0) return <></>;

  return (
    <div
      className="social-links"
      style={{
        width: fullWidth ? "100%" : "",
        justifyContent: justifyContent || "center",
      }}
    >
      {socialLinks.map((link) => (
        <SocialIcon
          key={link.platform}
          url={link.url}
          platform={link.platform}
          alt={link.platform}
        />
      ))}
    </div>
  );
}
