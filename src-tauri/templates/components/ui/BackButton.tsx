import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BackButton.css";

interface BackButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * BackButton component to navigate back to the previous page or up one level.
 */
export default function BackButton(props: BackButtonProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = (): void => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);

    if (pathSegments.length > 1) {
      const parentPath = "/" + pathSegments.slice(0, -1).join("/");
      navigate(parentPath);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleBackClick}
      aria-label="Go back to previous page"
      type="button"
      style={props.style}
      className={`back-button ${props.className || ""}`}
    >
      <FontAwesomeIcon icon={faArrowLeft} className="back-button-icon" />
      <span className="back-button-text">Back</span>
    </button>
  );
}
