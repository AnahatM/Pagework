import type { ComponentDefinition } from "@/types/components";
import { prop } from "./helpers";

export const SizedBox: ComponentDefinition = {
  type: "SizedBox",
  displayName: "Spacer",
  description: "Empty spacing element.",
  category: "utility",
  icon: "spacer",
  acceptsChildren: false,
  props: [
    prop(
      "height",
      "Height (px)",
      { kind: "number", min: 0 },
      { defaultValue: 20, group: "Layout" },
    ),
    prop(
      "width",
      "Width",
      { kind: "string" },
      { group: "Layout", description: "CSS width value (e.g. 100px, 50%)" },
    ),
  ],
};

export const FlexRow: ComponentDefinition = {
  type: "FlexRow",
  displayName: "Flex Row",
  description: "Horizontal flex container.",
  category: "utility",
  icon: "row",
  acceptsChildren: true,
  props: [
    prop(
      "gap",
      "Gap (px)",
      { kind: "number", min: 0 },
      { defaultValue: 10, group: "Layout" },
    ),
    prop(
      "alignItems",
      "Align Items",
      {
        kind: "select",
        options: [
          { label: "Start", value: "flex-start" },
          { label: "Center", value: "center" },
          { label: "End", value: "flex-end" },
        ],
      },
      { defaultValue: "center", group: "Layout" },
    ),
    prop(
      "justifyContent",
      "Justify Content",
      {
        kind: "select",
        options: [
          { label: "Start", value: "flex-start" },
          { label: "Center", value: "center" },
          { label: "End", value: "flex-end" },
          { label: "Space Between", value: "space-between" },
          { label: "Space Around", value: "space-around" },
        ],
      },
      { defaultValue: "flex-start", group: "Layout" },
    ),
    prop(
      "wrap",
      "Wrap",
      {
        kind: "select",
        options: [
          { label: "No Wrap", value: "nowrap" },
          { label: "Wrap", value: "wrap" },
          { label: "Wrap Reverse", value: "wrap-reverse" },
        ],
      },
      { defaultValue: "nowrap", group: "Layout" },
    ),
    prop(
      "fullWidth",
      "Full Width",
      { kind: "boolean" },
      { defaultValue: false, group: "Layout" },
    ),
  ],
};
