import { type JSX } from "react";
import "./NumberDisplay.css";

/**
 * Props interface for the NumberDisplay component.
 */
interface NumberDisplayProps {
  /** The number to display, can be a string or a number */
  displayNumber: string | number;
  /** The label for the number, typically a unit or description */
  numberLabel: string;
  /** Optional mini text to display below the number */
  miniText?: string;
}

/**
 * NumberDisplay component for displaying a number with a label and optional mini text.
 *
 * @param props - The props for the component.
 * @returns The rendered component.
 */
export default function NumberDisplay(props: NumberDisplayProps): JSX.Element {
  return (
    <div className="number-display">
      <span className="display-number">{props.displayNumber}</span>
      <span className="number-label">{props.numberLabel}</span>
      {props.miniText && <span className="mini-text">{props.miniText}</span>}
    </div>
  );
}
