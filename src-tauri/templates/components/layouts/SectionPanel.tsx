import type { JSX } from "react";
import "./SectionPanel.css";

/**
 * Props interface for the SectionPanel component.
 */
interface SectionPanelProps {
  /** The content to be displayed within the panel */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the panel for styling */
  className?: string;
}

/**
 * SectionPanel component that wraps its children in a styled panel.
 * This component is used to contain content for all section layouts.
 * It helps in maintaining a uniform design and structure across different parts of the application.
 *
 * @param {Object} props - The properties for the SectionPanel component.
 * @param {React.ReactNode} props.children - The content to be displayed within the panel
 * @param {string} props.className - Additional CSS classes to apply to the panel for styling.
 *
 * @returns {JSX.Element} The rendered SectionPanel component.
 */
export default function SectionPanel(props: SectionPanelProps): JSX.Element {
  return <section className={`section-panel ${props.className}`}>{props.children}</section>;
}
