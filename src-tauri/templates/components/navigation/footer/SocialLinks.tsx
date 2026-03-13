import { ASSET_PATHS } from "@routes/AssetPathHandler.ts";
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
 * Renders a set of social icons linking to various social platforms.
 *
 * HOW TO EDIT YOUR SOCIAL LINKS:
 * ──────────────────────────────
 * Each <SocialIcon> below represents one social media icon in the footer.
 *
 * To ADD a social link:
 *   1. Add an icon image to public/assets/socials/ (e.g., "github.png")
 *   2. Copy one of the <SocialIcon> blocks below
 *   3. Change the url, imgSrc, and alt values
 *
 * To REMOVE a social link:
 *   Simply delete the entire <SocialIcon ... /> block
 *
 * Properties:
 *   - url:              The link to your profile
 *   - imgSrc:           Path to the icon image (in public/assets/socials/)
 *   - alt:              Description text for accessibility
 *   - invertOnDarkMode: Set to true so the icon is visible in dark mode
 *
 * @param {SocialLinksProps} props - The properties for the social links component.
 * @returns {JSX.Element} The rendered social links.
 */
export default function SocialLinks(props: SocialLinksProps): JSX.Element {
  const { fullWidth = undefined, justifyContent = "center" } = props;

  return (
    <div
      className="social-links"
      style={{
        width: fullWidth ? "100%" : "",
        justifyContent: justifyContent || "center",
      }}
    >
      {/* ────────────────────────────────────────────── */}
      {/* EDIT: Replace these placeholder social links  */}
      {/* with your own profiles and icon images.       */}
      {/* ────────────────────────────────────────────── */}

      {/* GitHub - EDIT: Change url to your GitHub profile */}
      <SocialIcon
        url="https://github.com/yourusername"
        imgSrc={`${ASSET_PATHS.SOCIALS}github.png`}
        alt="GitHub"
        invertOnDarkMode={true}
      />

      {/* LinkedIn - EDIT: Change url to your LinkedIn profile */}
      <SocialIcon
        url="https://www.linkedin.com/in/yourusername"
        imgSrc={`${ASSET_PATHS.SOCIALS}linkedin.png`}
        alt="LinkedIn"
        invertOnDarkMode={true}
      />

      {/* 
        ADD MORE SOCIAL LINKS HERE — copy the pattern above:
        
        <SocialIcon
          url="https://twitter.com/yourusername"
          imgSrc={`${ASSET_PATHS.SOCIALS}twitter.png`}
          alt="Twitter"
          invertOnDarkMode={true}
        />
      */}
    </div>
  );
}
