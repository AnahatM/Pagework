import Footer from "@components/navigation/footer/Footer.tsx";
import Navbar from "@components/navigation/navbar/Navbar.tsx";
import NavbarPaddingScaler from "@components/navigation/navbar/NavbarPaddingScaler";
import type { JSX } from "react";
import { Outlet } from "react-router-dom";

/**
 * The Layout component serves as a persistent shell around the changing page content.
 * It includes elements that should appear on every page, like the navigation bar and footer.
 * The Outlet component is where the specific page content will be rendered.
 *
 * @returns {JSX.Element} The complete layout structure including navbar, main content area, and footer.
 */
export default function Layout(): JSX.Element {
  return (
    // Overall container for the app layout
    <div className="app-container">
      {/* Navbar */}
      <Navbar />

      {/* Main content area where the specific page content will be rendered */}
      <div className="page-container" style={{ minHeight: "calc(100vh - 400px)" }}>
        {/* Dynamic padding to account for fixed navbar */}
        <NavbarPaddingScaler />

        {/* Outlet is where the specific page content will be injected */}
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
