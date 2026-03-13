import {
  useNavigationButton,
  useNavigationPopover,
} from "@/hooks/useNavigation.ts";
import type { NavigationButtonProps } from "@components/navigation/types/NavigationTypes.ts";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import "./NavigationButton.css";

/**
 * Renders a navigation button that can display a popover with sub-navigation items.
 *
 * @param props - The properties object.
 *
 * @returns JSX element representing the navigation button.
 */
export default function NavigationButton(
  props: NavigationButtonProps,
): JSX.Element {
  // Use shared navigation hooks
  const { getIconPath, getButtonClasses, getExpandArrowPath } =
    useNavigationButton();
  const {
    isOpen: popoverOpen,
    handleMouseEnter,
    handleMouseLeave,
  } = useNavigationPopover();

  // Only activate popover for items with sub-pages
  const shouldShowPopover = props.hasSubPages && props.subPages;
  const popoverMouseEnter = shouldShowPopover
    ? handleMouseEnter
    : (): void => {};
  const popoverMouseLeave = shouldShowPopover
    ? handleMouseLeave
    : (): void => {};

  return (
    // Container for the navigation button, with mouse event handlers for popover visibility
    <div
      className="navbar-button-container"
      onMouseEnter={popoverMouseEnter}
      onMouseLeave={popoverMouseLeave}
    >
      {/* Actual Link Object */}
      <Link
        to={props.url}
        className={getButtonClasses(
          props.isActive,
          props.clickable,
          props.isSubPage,
          props.colorOnHover,
          props.coloredByDefault,
        )}
        tabIndex={props.clickable ? 0 : -1}
        aria-disabled={!props.clickable}
      >
        {/* Navigation Link Icon */}
        {props.icon && (
          <img
            src={getIconPath(props.icon)}
            alt=""
            className="navigation-button-icon"
          />
        )}

        {/* Text Label for Nav Link */}
        <span className="navigation-button-label">{props.label}</span>

        {/* Expand Arrow for Sub-Pages */}
        {props.hasSubPages && (
          <FontAwesomeIcon
            icon={popoverOpen ? faChevronUp : faChevronDown}
            className="navigation-button-expand-arrow"
          />
        )}
      </Link>

      {/* Popover menu for subpages when expand is hovered */}
      {props.hasSubPages && props.subPages && (
        <div className={`navbar-popover${popoverOpen ? " open" : ""}`}>
          <ul className="navbar-popover-list">
            {/* For every subpage create a list item with that nav button */}
            {props.subPages.map((sub) => (
              <li key={sub.path}>
                <NavigationButton
                  label={sub.linkName}
                  icon={sub.linkIcon}
                  url={sub.path}
                  clickable={true}
                  isActive={false}
                  isSubPage={true}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
