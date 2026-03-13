import type { ComponentDefinition } from "@/types/components";
import { prop } from "./helpers";

export const GridBackground: ComponentDefinition = {
  type: "GridBackground",
  displayName: "Grid Background",
  description: "Animated canvas grid with glow effects.",
  category: "design",
  icon: "grid-bg",
  acceptsChildren: false,
  props: [
    prop(
      "gridSize",
      "Grid Size",
      { kind: "number", min: 10, max: 200 },
      { defaultValue: 50, group: "Style" },
    ),
    prop(
      "showGrid",
      "Show Grid",
      { kind: "boolean" },
      { defaultValue: true, group: "Style" },
    ),
    prop(
      "enableRipples",
      "Enable Ripples",
      { kind: "boolean" },
      { defaultValue: true, group: "Style" },
    ),
  ],
};
