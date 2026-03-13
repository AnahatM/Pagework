import { useTheme } from "@/hooks/useTheme.ts";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialDarkMode = savedTheme
      ? savedTheme === "dark"
      : systemPrefersDark;

    if (!savedTheme) {
      updateTheme(initialDarkMode);
    }
  }, []);

  const handleThemeToggle = (): void => {
    const newDarkMode = !isDarkMode;
    updateTheme(newDarkMode);
  };

  const altText = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      onClick={handleThemeToggle}
      aria-label={altText}
      title={altText}
      className="theme-switch-button"
    >
      <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
    </button>
  );
}
