import { parseFormattedText } from "@/utils/TextUtils";
import { type JSX } from "react";
import "./TextParagraph.css";

interface TextParagraphProps {
  /** The text content to display, can include markdown-style links like "View [link text](https://example.com)" */
  text: string;
  /** Whether to use highlight color styling */
  highlight?: boolean;
  /** Whether to make the text bold */
  bold?: boolean;
  /** Whether to center the text */
  centered?: boolean;
  /** Whether to use italic styling */
  italic?: boolean;
  /** Whether to use uppercase styling */
  uppercase?: boolean;
  /** Whether the text paragraph has a max width */
  maxWidth?: number;
  /** Whether it is full width */
  fullWidth?: boolean;
  /** Add space after the paragraph */
  spaceAfter?: boolean;
  /** Whether to get heading font size */
  heading?: "h1" | "h2" | "h3" | undefined;
  /** Whether to show a bottom border */
  borderBottom?: boolean;
}

/**
 * TextParagraph component for displaying styled text paragraphs.
 *
 * Supports markdown-style links, bold, italic, and underline text.
 * Handles newlines and preserves formatting.
 *
 * @param props - The props for the component.
 * @returns The rendered component.
 */
export default function TextParagraph(props: TextParagraphProps): JSX.Element {
  // Destructure props with default values
  const {
    text,
    highlight = false,
    bold = false,
    centered = false,
    italic = false,
    uppercase = false,
    fullWidth = true,
    maxWidth = 650,
    spaceAfter = false,
    heading = undefined,
    borderBottom = false
  } = props;

  // Build class names based on props
  const classNames = [
    "text-paragraph",
    highlight ? "highlight" : "",
    bold ? "bold" : "",
    centered ? "centered" : "",
    italic ? "italic" : "",
    uppercase ? "uppercase" : "",
    spaceAfter ? "space-after" : "",
    heading ? `heading-${heading}` : "",
    borderBottom ? "border-bottom" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const inlineStyles: React.CSSProperties = fullWidth ? { width: "100%" } : {};

  return (
    <p
      className={classNames}
      style={{ ...inlineStyles, maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
    >
      {parseFormattedText(text)}
    </p>
  );
}
