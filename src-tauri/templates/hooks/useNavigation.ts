/**
 * Navigation hooks and utilities
 * Shared logic for navigation components including icon handling,
 * active state management, and common event handlers.
 */

import { ASSET_PATHS } from "@routes/AssetPathHandler";
import { useState } from "react";

/**
 * Hook for managing navigation button state and logic
 * Provides common functionality for all navigation button components
 */
export function useNavigationButton(): {
  isHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  getIconPath: (icon?: string) => string;
  getButtonClasses: (
    isActive: boolean,
    isClickable?: boolean,
    isSubPage?: boolean,
    colorOnHover?: boolean,
    coloredByDefault?: boolean,
    additionalClasses?: string
  ) => string;
  getExpandArrowPath: (isExpanded: boolean) => string;
} {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Handles mouse enter event for navigation buttons
   */
  const handleMouseEnter = (): void => {
    setIsHovered(true);
  };

  /**
   * Handles mouse leave event for navigation buttons
   */
  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  /**
   * Generates the complete icon path for navigation buttons
   * @param icon - The icon filename without path
   * @returns The complete asset path for the icon
   */
  const getIconPath = (icon?: string): string => {
    if (!icon) return "";
    return ASSET_PATHS.ICONS + icon;
  };

  /**
   * Generates CSS classes for navigation button styling
   * @param isActive - Whether the button represents the current page
   * @param isClickable - Whether the button is clickable
   * @param isSubPage - Whether this is a sub-navigation item
   * @param colorOnHover - Whether icon should be colored only on hover
   * @param coloredByDefault - Whether icon should be colored by default
   * @param additionalClasses - Any additional CSS classes
   * @returns Combined CSS class string
   */
  const getButtonClasses = (
    isActive: boolean,
    isClickable?: boolean,
    isSubPage?: boolean,
    colorOnHover?: boolean,
    coloredByDefault?: boolean,
    additionalClasses?: string
  ): string => {
    const classes = [
      "navigation-button",
      isActive ? "active" : "",
      isClickable ? "clickable" : "",
      isSubPage ? "is-sub-page" : "",
      colorOnHover ? "color-on-hover" : "",
      coloredByDefault ? "colored-by-default" : "",
      additionalClasses || ""
    ];

    return classes.filter(Boolean).join(" ");
  };

  /**
   * Generates the path for expand/collapse arrow graphics
   * @param isExpanded - Whether the element is currently expanded
   * @returns The asset path for the appropriate arrow graphic
   */
  const getExpandArrowPath = (isExpanded: boolean): string => {
    return ASSET_PATHS.GRAPHICS + (isExpanded ? "collapse.png" : "expand.png");
  };

  return {
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    getIconPath,
    getButtonClasses,
    getExpandArrowPath
  };
}

/**
 * Hook for managing popover state in navigation buttons
 * Handles showing/hiding of dropdown menus and sub-navigation
 */
export function useNavigationPopover(): {
  isOpen: boolean;
  openPopover: () => void;
  closePopover: () => void;
  togglePopover: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
} {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Opens the popover
   */
  const openPopover = (): void => {
    setIsOpen(true);
  };

  /**
   * Closes the popover
   */
  const closePopover = (): void => {
    setIsOpen(false);
  };

  /**
   * Toggles the popover state
   */
  const togglePopover = (): void => {
    setIsOpen((prev) => !prev);
  };

  /**
   * Handles mouse enter for popover activation
   */
  const handleMouseEnter = (): void => {
    openPopover();
  };

  /**
   * Handles mouse leave for popover deactivation
   */
  const handleMouseLeave = (): void => {
    closePopover();
  };

  return {
    isOpen,
    openPopover,
    closePopover,
    togglePopover,
    handleMouseEnter,
    handleMouseLeave
  };
}

/**
 * Hook for managing expandable navigation sections (sidebar)
 * Handles expand/collapse state for navigation items with sub-pages
 */
export function useNavigationExpand(): {
  isExpanded: boolean;
  toggleExpanded: () => void;
  handleExpandClick: (e: React.MouseEvent) => void;
  handleExpandKeyDown: (e: React.KeyboardEvent) => void;
} {
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Toggles the expanded state
   */
  const toggleExpanded = (): void => {
    setIsExpanded((prev) => !prev);
  };

  /**
   * Handles click events for expand/collapse
   * @param e - The mouse event
   */
  const handleExpandClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    toggleExpanded();
  };

  /**
   * Handles keyboard events for expand/collapse
   * @param e - The keyboard event
   */
  const handleExpandKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      toggleExpanded();
    }
  };

  return {
    isExpanded,
    toggleExpanded,
    handleExpandClick,
    handleExpandKeyDown
  };
}

/**
 * Common asset path constants for navigation components
 */
export const NAVIGATION_ASSETS = {
  ICONS_PATH: "/assets/icons/",
  GRAPHICS_PATH: "/assets/graphics/",
  HAMBURGER_ICON: "hamburger.png",
  CLOSE_ICON: "close.png",
  EXPAND_ICON: "expand.png",
  COLLAPSE_ICON: "collapse.png"
} as const;
