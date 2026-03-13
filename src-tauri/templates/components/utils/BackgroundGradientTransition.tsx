import { type JSX } from "react";

/**
 * Properties for the BackgroundGradientTransition component.
 */
interface BackgroundGradientTransitionProps {
  /**
   * The direction of the gradient transition.
   * Can be "left", "right", "top", or "bottom".
   */
  direction?: "left" | "right" | "top" | "bottom";
}

/**
 * Background gradient transition effect for page sections.
 *
 * @param props - The properties for the gradient transition.
 * @returns The JSX element for the background gradient transition.
 */
export default function BackgroundGradientTransition(
  props: BackgroundGradientTransitionProps
): JSX.Element {
  return (
    <>
      <div className="background-gradient-transition"></div>
      <style>
        {`.background-gradient-transition {
                background: linear-gradient(to ${props.direction}, var(--page-background), transparent);
                height: 50px;
            }`}
      </style>
    </>
  );
}
