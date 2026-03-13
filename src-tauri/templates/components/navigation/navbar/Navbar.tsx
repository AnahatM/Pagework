import {
  useNavigationViewport,
  useOptimizedScroll,
} from "@/hooks/useWindowEvents.ts";
import Sidebar from "@components/navigation/sidebar/Sidebar.tsx";
import SidebarOpenButton from "@components/navigation/sidebar/SidebarOpenButton.tsx";
import type { NavItem } from "@components/navigation/types/NavigationTypes.ts";
import ThemeSwitch from "@components/other/ThemeSwitch.tsx";
import navConfig from "@routes/NavigationConfiguration.json";
import { useEffect, useRef, useState, type JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import NavigationButton from "./NavigationButton.tsx";

/**
 * Checks if the given path is active (i.e., matches the current URL).
 *
 * @param path - The path to check against the current URL.
 * @returns True if the path is active, false otherwise.
 */
const isActive = (path: string): boolean => {
  // Get the base path from Vite/Router
  const basePath = import.meta.env.BASE_URL || "/";
  // Remove basePath from the start of the current pathname if present
  let currentPath = window.location.pathname;
  // Ensure currentPath starts with a leading slash
  if (basePath !== "/" && currentPath.startsWith(basePath)) {
    currentPath = currentPath.slice(
      basePath.length - (basePath.endsWith("/") ? 1 : 0),
    );
    if (!currentPath.startsWith("/")) currentPath = "/" + currentPath;
  }
  if (path === "/") return currentPath === "/";
  return currentPath.startsWith(path);
};

/**
 * The `Navbar` component renders a responsive navigation bar with a logo, navigation links,
 * and a collapsible sidebar for mobile devices. It includes functionality for detecting
 * active links and managing window resize events to adapt to mobile viewports.
 *
 * Features:
 * - Displays a logo and navigation links
 * - The `navConfig.json` file is used to load navigation items dynamically
 * - Supports dropdown menus for navigation categories
 * - Note that subpages are supported for just one level deep
 * - Optional icons for navigation items
 * - Highlights the active link based on the current URL
 * - Toggles a sidebar menu for mobile devices with hamburger icon
 * - Dynamically adjusts to mobile or desktop view based on window width
 * - Adds a `scrolled` class to the navbar when scrolling down
 *
 * @returns {JSX.Element} The rendered `Navbar` component
 */
export default function Navbar(): JSX.Element {
  // Use custom hooks for window events
  const { isMobile } = useNavigationViewport();
  const { isScrolled } = useOptimizedScroll(50);

  // State to manage sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isNavigatingRef = useRef(false);

  // Store the navigation items and other pages from the configuration
  const navItems: NavItem[] = navConfig.navItems;
  const otherPages: NavItem[] = navConfig.otherPages;

  // Track route changes to prevent navbar state reset during navigation
  useEffect(() => {
    isNavigatingRef.current = true;
    const timeoutId = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200); // Give time for scroll reset to complete
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Return the Navbar component JSX
  return (
    <nav
      className={`navbar ${isScrolled ? "scrolled" : ""} ${isMobile ? "mobile" : "desktop"}`}
    >
      {/* Logo with Link to Homepage */}
      <Link to="/" className="navbar-logo-link">
        <span className="navbar-logo-text">Home</span>
      </Link>

      {/* Navigation Links Loaded from Nav Config */}
      {!isMobile && (
        <div className="navbar-center-links">
          <>
            {/* Map through navItems to create NavigationButton components */}
            {navItems.map((item) => (
              <NavigationButton
                key={item.path}
                label={item.linkName}
                icon={item.linkIcon}
                url={item.path}
                clickable={true}
                isActive={isActive(item.path)}
                hasSubPages={!!item.subPages}
                isSubPage={false}
                subPages={item.subPages}
                colorOnHover={false}
                coloredByDefault={false}
              />
            ))}

            {/* More Pages Button — only show when there are extra pages */}
            {otherPages.length > 0 && (
              <NavigationButton
                label="More"
                url="#"
                clickable={false}
                isActive={false}
                hasSubPages={true}
                isSubPage={false}
                subPages={otherPages}
                colorOnHover={false}
                coloredByDefault={false}
              />
            )}
          </>
        </div>
      )}

      {!isMobile && (
        <div className="navbar-right-ui">
          {/* Theme Switch for Desktop */}
          <ThemeSwitch />
        </div>
      )}

      {isMobile && (
        <div className="navbar-right-ui">
          {/* Theme Switch for Mobile */}
          <ThemeSwitch />
          {/* Hamburger button for mobile view */}
          <SidebarOpenButton
            isOpen={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
          />
        </div>
      )}

      {/* Sidebar */}
      {isMobile && (
        <Sidebar
          navItems={navItems}
          otherPages={otherPages}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isActive={isActive}
        />
      )}
    </nav>
  );
}
