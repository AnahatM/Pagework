import SizedBox from "@components/utils/SizedBox.tsx";
import type { JSX } from "react";
import "./Footer.css";
import FooterArea from "./FooterArea.tsx";
import FooterLinks from "./FooterLinks.tsx";

/**
 * Renders the footer of the website.
 *
 * @returns {JSX.Element} Rendered Footer component with UI and social links.
 */
function Footer(): JSX.Element {
  return (
    <>
      {/* Unused Background Gradient Transition */}
      {/* <BackgroundGradientTransition direction="top" /> */}

      <SizedBox height={50} />

      <footer className="footer">
        {/* Footer UI and Socials Container */}
        <FooterArea />

        {/* Footer Links List */}
        <FooterLinks />
      </footer>
    </>
  );
}

export default Footer;
