import { footerColumns } from "@routes/FooterConfiguration.ts";
import type { JSX } from "react";
import FooterLink from "./FooterLink.tsx";
import "./FooterLinks.css";

/**
 * Renders a collection of footer links grouped into columns.
 *
 * @returns {JSX.Element} A JSX element representing the footer links.
 */
export default function FooterLinks(): JSX.Element {
  return (
    <div className="footer-links">
      {/* Render each column of links */}
      {footerColumns.map((column, columnIndex) => (
        <ul key={columnIndex} className="footer-links-column">
          {/* Render column header */}
          <li className="footer-links-header">
            <h3>{column.header}</h3>
          </li>

          {/* Render each link in the column */}
          {column.links.map((link) => (
            <li key={link.url}>
              <FooterLink
                label={link.label}
                url={link.url}
                openInNewTab={link.openInNewTab}
                tooltip={link.tooltip}
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
