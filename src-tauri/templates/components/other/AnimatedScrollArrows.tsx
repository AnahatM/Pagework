import assetPath, { ASSET_PATHS } from "@routes/AssetPathHandler";
import type { JSX } from "react";
import "./AnimatedScrollArrows.css";

/**
 * AnimatedScrollArrows component that displays animated downward-pointing arrows
 * to indicate scrollable content below
 *
 * @returns {JSX.Element} The animated scroll arrows component
 */
export default function AnimatedScrollArrows(): JSX.Element {
  return (
    <div className="animated-scroll-arrows">
      <img
        src={assetPath(`${ASSET_PATHS.GRAPHICS}expand.png`)}
        alt="Scroll down arrow"
        className="arrow-image arrow-1"
      />
      <img
        src={assetPath(`${ASSET_PATHS.GRAPHICS}expand.png`)}
        alt="Scroll down arrow"
        className="arrow-image arrow-2"
      />
      <img
        src={assetPath(`${ASSET_PATHS.GRAPHICS}expand.png`)}
        alt="Scroll down arrow"
        className="arrow-image arrow-3"
      />
    </div>
  );
}
