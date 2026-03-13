import type { SidebarButtonProps } from "@components/navigation/types/NavigationTypes.ts";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type JSX } from "react";
import "./SidebarOpenButton.css";

/**
 * Renders a hamburger menu button that toggles the mobile sidebar.
 */
export default function SidebarOpenButton({
  isOpen,
  onClick,
}: SidebarButtonProps): JSX.Element {
  return (
    <button
      className={`sidebar-button${isOpen ? " open" : ""}`}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      onClick={onClick}
      type="button"
    >
      <FontAwesomeIcon icon={faBars} className="sidebar-button-hamburger" />
    </button>
  );
}
