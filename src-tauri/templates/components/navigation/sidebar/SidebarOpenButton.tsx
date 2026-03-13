import type { SidebarButtonProps } from "@components/navigation/types/NavigationTypes.ts";
import { ASSET_PATHS } from "@routes/AssetPathHandler";
import { type JSX } from "react";
import "./SidebarOpenButton.css";

/**
 * Renders a hamburger menu button that toggles the mobile sidebar.
 * This button is only visible on mobile viewports and provides access
 * to the navigation menu when the main navbar links are hidden.
 *
 * Features:
 * - Displays a hamburger menu icon
 * - Visual feedback for open/closed states
 * - Smooth animations and hover effects
 * - Accessibility support with proper ARIA labels
 * - Uses navbar color variables for consistent theming
 *
 * @param props - The properties object.
 *
 * @returns JSX element representing the sidebar toggle button.
 */
export default function SidebarOpenButton({ isOpen, onClick }: SidebarButtonProps): JSX.Element {
  return (
    // Button that toggles the sidebar
    <button
      className={`sidebar-button${isOpen ? " open" : ""}`}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      onClick={onClick}
      type="button"
    >
      {/* Hamburger icon image */}
      <img
        src={ASSET_PATHS.GRAPHICS + "hamburger.png"}
        alt="menu"
        className="sidebar-button-hamburger"
      />
    </button>
  );
}
