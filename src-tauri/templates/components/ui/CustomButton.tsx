import React, { type JSX } from "react";
import "./CustomButton.css";

interface ButtonProps {
  /** Button text content */
  children: React.ReactNode;
  /** Color variant of the button */
  variant?: "primary" | "secondary" | "positive" | "warning" | "negative";
  /** Style of the button (solid or translucent) */
  style?: "solid" | "translucent";
  /** Button type attribute */
  type?: "button" | "submit" | "reset";
  /** Font Style */
  fontStyle?: "normal" | "display";
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Additional CSS class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export default function CustomButton(props: ButtonProps): JSX.Element {
  const {
    children,
    variant = "primary",
    style = "solid",
    type = "button",
    onClick,
    className = "",
    disabled = false,
    fontStyle = "normal"
  } = props;

  const buttonClasses = [
    "button",
    `button-${variant}`,
    `button-${style} button-${fontStyle}`,
    className
  ].join(" ");

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
