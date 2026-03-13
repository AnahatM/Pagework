import { useNavigationButton, useNavigationExpand } from "@/hooks/useNavigation.ts";
import type { SidebarNavButtonProps } from "@components/navigation/types/NavigationTypes.ts";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import "./SidebarNavButton.css";

/**
 * Renders a navigation button for the mobile sidebar that can display sub-navigation items.
 * Follows the same pattern as NavigationButton but optimized for vertical mobile layout.
 *
 * Features:
 * - Displays icon, label, and optional expand/collapse arrow
 * - Supports expandable sub-navigation items
 * - Highlights active page
 * - Smooth animations for expand/collapse
 * - Accessibility support with proper ARIA attributes
 *
 * @param props - The properties object.
 *
 * @returns JSX element representing the sidebar navigation button.
 */
export default function SidebarNavButton(props: SidebarNavButtonProps): JSX.Element {
  // Use shared navigation hooks
  const { getIconPath, getExpandArrowPath } = useNavigationButton();
  const { isExpanded: expanded, handleExpandClick, handleExpandKeyDown } = useNavigationExpand();

  const hasSubPages = props.subPages && props.subPages.length > 0;

  return (
    <div
      className={`sidebar-nav-button${props.isActive ? " active" : ""}${
        hasSubPages ? " has-subpages" : ""
      }${expanded ? " expanded" : ""}`}
    >
      {/* Main navigation link */}
      <Link
        to={props.url}
        className="sidebar-nav-button-main"
        tabIndex={0}
        aria-current={props.isActive ? "page" : undefined}
        aria-expanded={hasSubPages ? expanded : undefined}
      >
        {/* Navigation button icon */}
        {props.icon && (
          <img src={getIconPath(props.icon)} alt="" className="sidebar-nav-button-icon" />
        )}
        {/* Text label for navigation button */}
        <span className="sidebar-nav-button-label">{props.label}</span>
        {/* Expand/collapse arrow for sub-pages */}
        {hasSubPages && (
          <div
            className="sidebar-nav-button-expand-container"
            onClick={handleExpandClick}
            onKeyDown={handleExpandKeyDown}
            tabIndex={0}
            role="button"
            aria-label={expanded ? "Collapse submenu" : "Expand submenu"}
          >
            <img
              src={getExpandArrowPath(expanded)}
              alt=""
              className="sidebar-nav-button-expand-arrow"
            />
          </div>
        )}
      </Link>

      {/* Sub-navigation items when expanded */}
      {hasSubPages && (
        <div className="sidebar-nav-button-subpages">
          {props.subPages!.map((sub) => (
            <SidebarNavButton key={sub.url} {...sub} />
          ))}
        </div>
      )}
    </div>
  );
}
