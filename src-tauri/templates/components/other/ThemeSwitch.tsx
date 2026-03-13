import { useTheme } from "@/hooks/useTheme.ts";
import assetPath, { ASSET_PATHS } from "@routes/AssetPathHandler";
import type { JSX } from "react";
import { useEffect } from "react";
import "./ThemeSwitch.css";

/**
 * Updates the data-theme attribute on the document element and saves to localStorage
 */
const updateTheme = (darkMode: boolean): void => {
  const theme = darkMode ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

/**
 * ThemeSwitch component that toggles between light and dark themes
 * Shows sun icon in dark mode (to switch to light) and moon icon in light mode (to switch to dark)
 * Uses localStorage to persist theme preference across sessions
 * Uses the useTheme hook to stay synchronized across multiple instances
 *
 * @returns {JSX.Element} The rendered theme switch button
 */
export default function ThemeSwitch(): JSX.Element {
  const isDarkMode = useTheme();

  // Initialize theme on component mount
  useEffect(() => {
    // Check if theme is already set in localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialDarkMode = savedTheme ? savedTheme === "dark" : systemPrefersDark;

    // Only update if there's no saved theme (first visit)
    if (!savedTheme) {
      updateTheme(initialDarkMode);
    }
  }, []);

  /**
   * Handles theme toggle when button is clicked
   */
  const handleThemeToggle = (): void => {
    const newDarkMode = !isDarkMode;
    updateTheme(newDarkMode);
  };

  // Show sun icon in dark mode (clicking will switch to light)
  // Show moon icon in light mode (clicking will switch to dark)
  const iconSrc = isDarkMode
    ? assetPath(`${ASSET_PATHS.GRAPHICS}sun.png`)
    : assetPath(`${ASSET_PATHS.GRAPHICS}moon.png`);

  const altText = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    // Theme toggle button
    <button
      onClick={handleThemeToggle}
      aria-label={altText}
      title={altText}
      className="theme-switch-button"
    >
      {/* Icon representing the other theme */}
      <img src={iconSrc} alt={altText} />
    </button>
  );
}
