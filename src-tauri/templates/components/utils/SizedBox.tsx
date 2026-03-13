import type { JSX } from "react";

/**
 * Interface for the SizedBox component props
 */
interface SizedBoxProps {
  /** The width of the div. Numbers and plain number strings are treated as pixels, strings with % are percentages, strings with px are pixels. */
  width?: string | number;
  /** The height of the div. Numbers and plain number strings are treated as pixels, strings with % are percentages, strings with px are pixels. */
  height?: string | number;
}

/**
 * Converts a width/height value to a CSS-compatible string.
 * @param value - The value to convert (number, string with px, string with %, or plain number string)
 * @returns CSS-compatible string value
 */
function formatDimension(value: string | number): string {
  if (typeof value === "number") {
    return `${value}px`;
  }

  if (typeof value === "string") {
    // If it ends with %, keep as is
    if (value.endsWith("%")) {
      return value;
    }

    // If it ends with px, keep as is
    if (value.endsWith("px")) {
      return value;
    }

    // If it's a plain number string, treat as pixels
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && value.trim() === numValue.toString()) {
      return `${numValue}px`;
    }

    // Otherwise, return as is (for other units like em, rem, etc.)
    return value;
  }

  return value as string;
}

/**
 * A functional component that renders a div with the specified width and height.
 *
 * @param {Object} props - The component props.
 * @param {string|number} [props.width] - The width of the div. Numbers and plain number strings are interpreted as pixels.
 * @param {string|number} [props.height] - The height of the div. Numbers and plain number strings are interpreted as pixels.
 *
 * @returns {JSX.Element} The rendered div element.
 */
export default function SizedBox({ width, height }: SizedBoxProps): JSX.Element {
  const style: React.CSSProperties = {
    width: width !== undefined ? formatDimension(width) : undefined,
    height: height !== undefined ? formatDimension(height) : undefined
  };

  return <div style={style} />;
}
