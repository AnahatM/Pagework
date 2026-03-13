import { useEffect, useState } from "react";

/**
 * Custom hook to detect the current theme
 * Watches for changes to the data-theme attribute on the document element
 * and returns whether dark mode is currently active
 *
 * @returns {boolean} - True if dark mode is active, false otherwise
 */
export function useTheme(): boolean {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  useEffect(() => {
    // Function to update theme state based on document attribute
    const updateTheme = (): void => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    };

    // Initial theme detection
    updateTheme(); // Create observer to watch for theme changes
    const observer = new MutationObserver((mutations): void => {
      mutations.forEach((mutation): void => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          updateTheme();
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    // Cleanup observer on unmount
    return (): void => observer.disconnect();
  }, []);

  return isDarkMode;
}
