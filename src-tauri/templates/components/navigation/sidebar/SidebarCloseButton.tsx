import type { SidebarCloseButtonProps } from "@components/navigation/types/NavigationTypes.ts";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { JSX } from "react";
import "./SidebarCloseButton.css";

/**
 * Renders a close button for the mobile sidebar.
 */
export default function SidebarCloseButton(
  props: SidebarCloseButtonProps,
): JSX.Element {
  return (
    <button
      className="sidebar-close-button"
      onClick={props.onClose}
      aria-label="Close navigation menu"
      type="button"
    >
      <FontAwesomeIcon icon={faXmark} className="sidebar-close-button-icon" />
    </button>
  );
}
