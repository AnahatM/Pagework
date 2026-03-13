/**
 * Shared navigation-related type definitions
 * This file centralizes all interfaces used across navigation components
 * to eliminate duplication and ensure consistency.
 */

/**
 * Interface for navigation item structure
 * Used across navbar, sidebar, and other navigation components
 */
export interface NavItem {
  /** The name of the link to display */
  linkName: string;
  /** The URL path for the link */
  path: string;
  /** Optional icon filename without path */
  linkIcon?: string;
  /** Optional array of sub-navigation items */
  subPages?: NavItem[];
}

/**
 * Interface for navigation button properties
 * Base interface for all navigation button components
 */
export interface BaseNavigationButtonProps {
  /** The text label for the button */
  label: string;
  /** Optional icon filename without path */
  icon?: string;
  /** The URL the button navigates to */
  url: string;
  /** Whether the button represents the current active page */
  isActive: boolean;
}

/**
 * Extended navigation button properties for main navbar
 * Includes additional properties specific to desktop navbar buttons
 */
export interface NavigationButtonProps extends BaseNavigationButtonProps {
  /** Whether the button is clickable */
  clickable: boolean;
  /** Whether the button has sub-navigation items */
  hasSubPages?: boolean;
  /** Whether this button is a sub-navigation item */
  isSubPage?: boolean;
  /** Optional array of sub-navigation items */
  subPages?: NavItem[];
  /** Whether the popover is currently open */
  popoverOpen?: boolean;
  /** Whether the icon should be colored by default, not grayscale */
  coloredByDefault?: boolean;
  /** Whether the icon should only be colored on hover */
  colorOnHover?: boolean;
  /** Function to control popover state */
  setPopoverOpen?: (open: boolean) => void;
}

/**
 * Navigation button properties for sidebar/mobile navigation
 * Optimized for vertical mobile layout
 */
export interface SidebarNavButtonProps extends BaseNavigationButtonProps {
  /** Optional array of sub-navigation items */
  subPages?: SidebarNavButtonProps[];
}

/**
 * Special navigation button properties
 * For special navigation items like "About Me" or "Contact"
 * Uses only base properties, no additional features
 */
export type NavigationSpecialButtonProps = BaseNavigationButtonProps;

/**
 * Sidebar component properties
 */
export interface SidebarProps {
  /** Array of main navigation items from navConfig */
  navItems: NavItem[];
  /** Array of additional pages from navConfig */
  otherPages: NavItem[];
  /** Whether the sidebar is currently open */
  isOpen: boolean;
  /** Function called when the sidebar should be closed */
  onClose: () => void;
  /** Function to determine if a path is currently active */
  isActive: (path: string) => boolean;
}

/**
 * Sidebar button (hamburger menu) properties
 */
export interface SidebarButtonProps {
  /** Whether the sidebar is currently open */
  isOpen: boolean;
  /** Function called when the button is clicked to toggle the sidebar */
  onClick: () => void;
}

/**
 * Sidebar close button properties
 */
export interface SidebarCloseButtonProps {
  /** Function called when the close button is clicked */
  onClose: () => void;
}
