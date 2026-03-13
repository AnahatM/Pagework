import React, { type JSX } from "react";

interface FlexRowProps {
  /** The content to be displayed in the FlexRow */
  children?: React.ReactNode;
  /**  Gap between items in the FlexRow */
  gap?: string | number;
  /**  Alignment of items in the FlexRow */
  alignItems?: "flex-start" | "center" | "flex-end";
  /** Justify content of items in the FlexRow */
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  /** Flex direction of the FlexRow */
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  /** Flex wrap behavior of the FlexRow */
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  /** Whether it is full width */
  fullWidth?: boolean;
}

export default function FlexRow(props: FlexRowProps): JSX.Element {
  const {
    children,
    gap = "10px",
    alignItems = "center",
    justifyContent = "flex-start",
    flexDirection = "row",
    wrap = "wrap",
    fullWidth = false
  } = props;

  return (
    <div
      style={{
        display: "flex",
        gap,
        flexWrap: wrap,
        justifyContent,
        alignItems,
        flexDirection,
        width: fullWidth ? "100%" : "auto"
      }}
    >
      {children}
    </div>
  );
}
