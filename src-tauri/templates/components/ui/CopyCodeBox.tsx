import { useState, type JSX } from "react";
import "./CopyCodeBox.css";

/**
 * Props for the CopyCodeBox component
 */
interface CopyOutputBoxProps {
  /** Text to display and copy */
  text: string;
  /** Label for the output box */
  label: string;
  /** Text shown when successfully copied */
  copiedMessage?: string;
}

/**
 * A component that displays a text output with a copy button.
 * When the button is clicked, the text is copied to the clipboard.
 *
 * @param props - The properties for the component
 * @param props.text - The text to display and copy
 * @param props.label - The label for the output box
 * @param props.copiedMessage - The message shown when text is copied (default: "Copied to clipboard.")
 *
 * @returns JSX Element
 */
export default function CopyCodeBox(props: CopyOutputBoxProps): JSX.Element {
  const { text, label, copiedMessage = "Copied to clipboard." } = props;

  const [copied, setCopied] = useState(false);

  const handleCopy = (): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="copy-code-box">
      <div className="copy-code-label">{label}</div>
      <div className="copy-code-container">
        <div className="copy-code-text">{text}</div>
        <button className="copy-button" onClick={handleCopy} aria-label="Copy to clipboard">
          Copy
        </button>
      </div>
      {copied && <div className="copy-code-success">{copiedMessage}</div>}
    </div>
  );
}
