import type { ComponentDefinition } from "@/types/components";
import { prop } from "./helpers";

export const GenericSection: ComponentDefinition = {
  type: "GenericSection",
  displayName: "Section",
  description: "Simple content wrapper with panel styling.",
  category: "sections",
  icon: "section",
  acceptsChildren: true,
  props: [],
};

export const InvisibleSection: ComponentDefinition = {
  type: "InvisibleSection",
  displayName: "Invisible Section",
  description: "Content wrapper without visible panel styling.",
  category: "sections",
  icon: "invisible",
  acceptsChildren: true,
  props: [
    prop(
      "blur",
      "Blur Background",
      { kind: "boolean" },
      { defaultValue: false },
    ),
  ],
};

export const SplitSection: ComponentDefinition = {
  type: "SplitSection",
  displayName: "Split Section",
  description: "Two-column equal-width layout. Stacks on mobile.",
  category: "sections",
  icon: "columns",
  acceptsChildren: true,
  props: [],
};

export const SectionWithImage: ComponentDefinition = {
  type: "SectionWithImage",
  displayName: "Section with Image",
  description: "Two-column layout: content on one side, image on the other.",
  category: "sections",
  icon: "image-section",
  acceptsChildren: true,
  props: [
    prop("imageUrl", "Image", { kind: "image" }, { group: "Image" }),
    prop(
      "altText",
      "Alt Text",
      { kind: "string" },
      { defaultValue: "", group: "Image" },
    ),
    prop(
      "imagePosition",
      "Image Position",
      {
        kind: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
      { defaultValue: "right", group: "Layout" },
    ),
    prop(
      "imageStyle",
      "Image Style",
      {
        kind: "select",
        options: [
          { label: "Floating", value: "floating" },
          { label: "Stretch to Edge", value: "stretchToEdge" },
        ],
      },
      { defaultValue: "floating", group: "Image" },
    ),
    prop(
      "minImageHeight",
      "Min Image Height (px)",
      {
        kind: "number",
        min: 100,
      },
      { defaultValue: 200, group: "Image" },
    ),
    prop(
      "tintImage",
      "Tint Image",
      { kind: "boolean" },
      { defaultValue: false, group: "Effects" },
    ),
    prop(
      "removeTintOnHover",
      "Remove Tint on Hover",
      { kind: "boolean" },
      { defaultValue: false, group: "Effects" },
    ),
    prop(
      "brightenImageOnHover",
      "Brighten on Hover",
      { kind: "boolean" },
      { defaultValue: false, group: "Effects" },
    ),
  ],
};

export const DynamicSectionRow: ComponentDefinition = {
  type: "DynamicSectionRow",
  displayName: "Dynamic Section Row",
  description: "Flexible grid of section panels that auto-wrap.",
  category: "sections",
  icon: "grid",
  acceptsChildren: true,
  props: [
    prop(
      "gap",
      "Gap (px)",
      { kind: "number", min: 0 },
      { defaultValue: 20, group: "Layout" },
    ),
    prop(
      "minSectionWidth",
      "Min Section Width (px)",
      { kind: "number", min: 50 },
      { defaultValue: 280, group: "Layout" },
    ),
    prop(
      "equalWidth",
      "Equal Width",
      { kind: "boolean" },
      { defaultValue: true, group: "Layout" },
    ),
  ],
};

export const ScrollableContainer: ComponentDefinition = {
  type: "ScrollableContainer",
  displayName: "Scrollable Container",
  description: "Vertically scrollable area with optional scroll hint.",
  category: "sections",
  icon: "scroll",
  acceptsChildren: true,
  props: [
    prop(
      "maxHeight",
      "Max Height",
      { kind: "string" },
      { defaultValue: "600px", group: "Layout" },
    ),
    prop(
      "enableBorder",
      "Show Border",
      { kind: "boolean" },
      { defaultValue: true, group: "Style" },
    ),
    prop(
      "showScrollHint",
      "Show Scroll Hint",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
  ],
};
