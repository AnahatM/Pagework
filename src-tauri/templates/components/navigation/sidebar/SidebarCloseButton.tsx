import type { SidebarCloseButtonProps } from "@components/navigation/types/NavigationTypes.ts";
import { ASSET_PATHS } from "@routes/AssetPathHandler";
import type { JSX } from "react";
import "./SidebarCloseButton.css";

/**
 * Renders a close button for the mobile sidebar.
 * This button is used to close the sidebar when it is open.
 *
 * Features:
 * - Displays a close icon
 * - Accessible with proper ARIA labels
 * - Uses consistent styling with the sidebar
 *
 * @param props - The properties object.
 *
 * @returns JSX element representing the sidebar close button.
 */
export default function SidebarCloseButton(props: SidebarCloseButtonProps): JSX.Element {
  return (
    // Button that closes the sidebar
    <button
      className="sidebar-close-button"
      onClick={props.onClose}
      aria-label="Close navigation menu"
      type="button"
    >
      {/* Close icon image */}
      <img
        src={ASSET_PATHS.GRAPHICS + "close.png"}
        alt="close"
        className="sidebar-close-button-icon"
      />
    </button>
  );
}
