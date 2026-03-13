import type { SidebarProps } from "@components/navigation/types/NavigationTypes.ts";
import { type JSX } from "react";
import "./Sidebar.css";
import SidebarCloseButton from "./SidebarCloseButton.tsx";
import SidebarNavButton from "./SidebarNavButton.tsx";

/**
 * Renders a mobile navigation sidebar that slides in from the right.
 * This component provides navigation functionality when the main navbar
 * is hidden on mobile devices. It includes both main navigation items
 * and additional pages with proper organization and styling.
 *
 * Features:
 * - Slides in from the right with smooth animations
 * - Backdrop overlay that closes the sidebar when clicked
 * - Displays main navigation items with sub-page support
 * - Separates main navigation from additional pages
 * - Supports expandable sub-navigation items
 * - Uses navbar color variables for consistent theming
 * - Proper accessibility with focus management
 *
 * @param props - The properties object.
 *
 * @returns JSX element representing the mobile sidebar.
 */
export default function Sidebar(props: SidebarProps): JSX.Element {
  return (
    <aside className={`sidebar${props.isOpen ? " open" : ""}`}>
      {/* Backdrop overlay */}
      <div className="sidebar-backdrop" onClick={props.onClose} aria-hidden="true" />

      {/* Main sidebar content panel */}
      <nav className="sidebar-content" role="navigation" aria-label="Mobile navigation">
        {/* Close button at the top of sidebar */}
        <div className="sidebar-header">
          <h1 className="sidebar-header-title">Menu</h1>
          <SidebarCloseButton onClose={props.onClose} />
        </div>

        <ul className="sidebar-nav-list" role="list">
          {/* Main navigation items with sub-pages */}
          {props.navItems.map((item) => (
            <li key={item.path} role="listitem">
              <SidebarNavButton
                label={item.linkName}
                icon={item.linkIcon}
                url={item.path}
                isActive={props.isActive(item.path)}
                subPages={item.subPages?.map((sub) => ({
                  label: sub.linkName,
                  icon: sub.linkIcon,
                  url: sub.path,
                  isActive: props.isActive(sub.path),
                  subPages: sub.subPages?.map((ssub) => ({
                    label: ssub.linkName,
                    icon: ssub.linkIcon,
                    url: ssub.path,
                    isActive: props.isActive(ssub.path)
                  }))
                }))}
              />
            </li>
          ))}

          {/* Additional pages links */}
          {props.otherPages.map((item) => (
            <li key={item.path} role="listitem">
              <SidebarNavButton
                label={item.linkName}
                icon={item.linkIcon}
                url={item.path}
                isActive={props.isActive(item.path)}
                subPages={item.subPages?.map((sub) => ({
                  label: sub.linkName,
                  icon: sub.linkIcon,
                  url: sub.path,
                  isActive: props.isActive(sub.path)
                }))}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
