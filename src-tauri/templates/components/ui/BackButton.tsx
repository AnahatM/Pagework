import { ASSET_PATHS } from "@routes/AssetPathHandler";
import { type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BackButton.css";

interface BackButtonProps {
  /** Optional class name for additional styling */
  className?: string;
  /** Optional style object for inline styles */
  style?: React.CSSProperties;
}

/**
 * BackButton component to navigate back to the previous page or up one level in the URL hierarchy.
 * It is used to provide a consistent way to go back in the application.
 *
 * @returns JSX.Element - The rendered back button.
 */
export default function BackButton(props: BackButtonProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles the back button click to navigate up one level
   * For example: /games/scrambled-eggs -> /games
   */
  const handleBackClick = (): void => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);

    if (pathSegments.length > 1) {
      // Remove the last segment to go up one level
      const parentPath = "/" + pathSegments.slice(0, -1).join("/");
      navigate(parentPath);
    } else {
      // If we're already at a top-level path, go to home
      navigate("/");
    }
  };

  // Render the back button
  return (
    <button
      onClick={handleBackClick}
      aria-label="Go back to previous page"
      type="button"
      style={props.style}
      className={`back-button ${props.className || ""}`}
    >
      <img
        src={ASSET_PATHS.GRAPHICS + "expand.png"}
        alt="Back arrow"
        className="back-button-icon"
      />
      <span className="back-button-text">Back</span>
    </button>
  );
}
