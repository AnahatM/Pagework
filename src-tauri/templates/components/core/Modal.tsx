import type { JSX, ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

/**
 * Modal component interface defining the props for the modal
 */
interface ModalProps {
  /** Whether the modal is open or closed */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Content to display inside the modal */
  children: ReactNode;
  /** Width of the modal (default: "500px") */
  width?: string;
  /** Height of the modal (default: "auto") */
  height?: string;
  /** Maximum width of the modal (default: "90vw") */
  maxWidth?: string;
  /** Maximum height of the modal (default: "90vh") */
  maxHeight?: string;
  /** Whether to show the close button (default: true) */
  showCloseButton?: boolean;
  /** Custom class name for additional styling */
  className?: string;
}

/**
 * Modal component that displays a centered modal window overlay.
 * Supports customizable size, close functionality, and keyboard interactions.
 *
 * @param props - The modal properties
 * @returns {JSX.Element | null} The modal component or null if not open
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  width = "500px",
  height = "auto",
  maxWidth = "90vw",
  maxHeight = "90vh",
  showCloseButton = true,
  className = ""
}: ModalProps): JSX.Element | null {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  // Create modal content
  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-content"
    >
      <div
        className={`modal-container ${className}`}
        style={{
          width,
          height,
          maxWidth,
          maxHeight
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        )}

        {/* Modal content */}
        <div className="modal-content" id="modal-content">
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal using portal to document body
  return createPortal(modalContent, document.body);
}
