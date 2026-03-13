import type { JSX } from "react";

/**
 * Loading fallback component for lazy-loaded routes
 * Displays while the component is being loaded
 */
export default function LoadingFallback(): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100hw",
        height: "100vh",
        fontSize: "16px",
        color: "var(--text)",
        background: "var(--page-background)"
      }}
    >
      Loading...
    </div>
  );
}
