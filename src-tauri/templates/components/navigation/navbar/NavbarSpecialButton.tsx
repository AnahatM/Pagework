import { useNavigationButton } from "@/hooks/useNavigation.ts";
import type { NavigationSpecialButtonProps } from "@components/navigation/types/NavigationTypes.ts";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import "./NavigationButton.css";

/**
 * Renders a custom variant of a navigation button that does not support sub-navigation,
 * and is used for special navigation items like "About Me" or "Contact".
 * It is just a link with an icon and label, without any popover functionality.
 * Has outline styling for the button in the CSS.
 *
 * @param props - The properties object for the button.
 *
 * @returns JSX element representing the navigation button.
 */
export default function NavigationSpecialButton(props: NavigationSpecialButtonProps): JSX.Element {
  // Use shared navigation hook
  const { getIconPath } = useNavigationButton();

  return (
    <Link
      to={props.url}
      className={`outline-nav-button navigation-button ${props.isActive ? "active" : ""}`}
    >
      {/* Navigation Link Icon */}
      {props.icon && (
        <img src={getIconPath(props.icon)} alt="" className="navigation-button-icon" />
      )}

      {/* Text Label for Nav Link */}
      <span className="navigation-button-label">{props.label}</span>
    </Link>
  );
}
