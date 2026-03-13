import type { JSX } from "react";
import { useEffect, useState } from "react";
import "./NavbarPaddingScaler.css";

/**
 * NavbarPaddingScaler component that dynamically measures the navbar height
 * and provides appropriate top padding for page content.
 *
 * This ensures that content is never hidden behind the fixed navbar,
 * regardless of screen size or navbar state (desktop floating vs scrolled).
 * It uses ResizeObserver to handle dynamic changes in navbar height,
 * such as when the navbar changes its height on scroll or due to responsive design.
 *
 * @returns {JSX.Element} The rendered padding element that scales with navbar height
 */
export default function NavbarPaddingScaler(): JSX.Element {
  // Default fallback height
  const [navbarHeight, setNavbarHeight] = useState(100);

  // Additional padding beyond navbar height
  const [extraPadding] = useState(70);

  // Track window width for responsive behavior
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Effect to measure the navbar height and update padding dynamically
  useEffect(() => {
    const measureNavbarHeight = (): void => {
      const navbar = document.querySelector("nav.navbar");
      if (navbar) {
        const height = navbar.getBoundingClientRect().height;
        setNavbarHeight(height);
      }
    };

    const updateWindowWidth = (): void => {
      setWindowWidth(window.innerWidth);
    };

    // Initial measurement with a small delay to ensure navbar is rendered
    const initialTimeout = setTimeout(() => {
      measureNavbarHeight();
      updateWindowWidth();
    }, 100);

    // Measure on window resize to handle responsive changes
    const handleResize = (): void => {
      measureNavbarHeight();
      updateWindowWidth();
    };

    // Use ResizeObserver to detect navbar size changes if available
    let resizeObserver: ResizeObserver | null = null;
    const navbar = document.querySelector("nav.navbar");

    if (navbar && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        measureNavbarHeight();
      });
      resizeObserver.observe(navbar);
    }

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // Apply extra padding only on screens wider than 820px
  const responsiveExtraPadding = windowWidth > 820 ? extraPadding : 0;
  const totalPadding = navbarHeight + responsiveExtraPadding;

  return (
    <div
      className="navbar-padding-scaler"
      style={{
        height: `${totalPadding}px`,
        width: "100%",
        flexShrink: 0 // Prevent this element from shrinking in flex layouts
      }}
      aria-hidden="true" // Hide from screen readers as it's just spacing
    />
  );
}
