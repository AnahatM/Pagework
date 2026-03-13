import ThemeSwitch from "@components/other/ThemeSwitch.tsx";
import SizedBox from "@components/utils/SizedBox.tsx";
import type { JSX } from "react";
import "./FooterArea.css";
import SocialLinks from "./SocialLinks.tsx";

/**
 * Renders the footer's main content, including the site name, social links, and navigation buttons.
 *
 * HOW TO EDIT THE FOOTER AREA:
 * ────────────────────────────
 * - Change "Kyle" below to your name
 * - The NavigationSpecialButton components add quick-links in the footer
 * - ThemeSwitch lets visitors toggle dark/light mode
 * - Update the copyright text at the bottom with your name
 *
 * @returns {JSX.Element} The rendered footer area.
 */
export default function FooterArea(): JSX.Element {
  return (
    <div className="footer-container">
      {/* EDIT: Change this to your name */}
      <p className="footer-name">Kyle</p>

      {/* Social Links Horizontal Row Display */}
      <SocialLinks />

      {/* EDIT: Quick-link buttons in the footer. Change labels and URLs as needed. */}
      <div className="footer-buttons-container">
        <ThemeSwitch />
      </div>

      {/* Spacing after the footer buttons before copyright */}
      <SizedBox height={20} />

      {/* EDIT: Change this copyright text to your name */}
      <p>&copy; {new Date().getFullYear()} Kyle. All rights reserved.</p>
    </div>
  );
}
