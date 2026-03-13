import { type JSX } from "react";
import "./LargeText.css";

/**
 * LargeText component props.
 */
interface LargeTextProps {
  /** Text content to display */
  text: string;
  /** Alignment */
  textAlign?: "left" | "center" | "right";
  /** Font size */
  fontSizePx?: number;
  /** Color, CSS variable or hex code or RGB */
  color?: string;
  /** Font Weight */
  fontWeight?: "normal" | "bold" | "black" | "lighter";
  /** Font Type */
  fontType?: "normal" | "display";
}

/**
 * Get the numeric value for font weight based on the string input.
 * @param fontWeight - The font weight as a string.
 * @returns The numeric value for the font weight.
 */
function getFontWeightValue(fontWeight: string): string | number {
  switch (fontWeight) {
    case "normal":
      return 400;
    case "bold":
      return "bold";
    case "black":
      return 900;
    case "lighter":
      return "lighter";
    default:
      return 400; // Default to normal if not recognized
  }
}

/**
 * LargeText component to display large text content.
 *
 * @property text - The text content to display.
 * @property textAlign - The alignment of the text (default: "center").
 * @property fontSizePx - The font size in pixels (default: 30).
 * @property color - The color of the text (default: "var(--text)").
 * @property fontWeight - The weight of the font (default: "normal").
 * @property fontType - The type of font to use (default: "normal").
 *
 * @returns JSX.Element - The rendered large text component.
 */
export default function LargeText(props: LargeTextProps): JSX.Element {
  const {
    text,
    textAlign = "center",
    fontSizePx = 30,
    color = "var(--text",
    fontWeight = "normal",
    fontType = "normal"
  } = props;

  return (
    <p
      className="large-text"
      style={{
        textAlign: textAlign,
        fontSize: `${fontSizePx}px`,
        color: color,
        fontWeight: getFontWeightValue(fontWeight),
        fontFamily: `var(--font-${fontType})`
      }}
    >
      {text}
    </p>
  );
}
