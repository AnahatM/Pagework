import type { ComponentDefinition } from "@/types/components";
import { prop, requiredProp } from "./helpers";

export const LinkButton: ComponentDefinition = {
  type: "LinkButton",
  displayName: "Link Button",
  description: "Styled navigation button/link.",
  category: "interactive",
  icon: "button",
  acceptsChildren: false,
  props: [
    requiredProp(
      "linktext",
      "Button Text",
      { kind: "string" },
      { group: "Content" },
    ),
    requiredProp("href", "URL", { kind: "url" }, { group: "Content" }),
    prop(
      "backgroundType",
      "Style",
      {
        kind: "select",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
          { label: "Transparent", value: "transparent" },
        ],
      },
      { defaultValue: "primary", group: "Style" },
    ),
    prop(
      "fontType",
      "Font",
      {
        kind: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Display", value: "display" },
        ],
      },
      { defaultValue: "normal", group: "Style" },
    ),
    prop(
      "outlineType",
      "Outline",
      {
        kind: "select",
        options: [
          { label: "None", value: "none" },
          { label: "Normal", value: "normal" },
          { label: "Primary", value: "primary" },
        ],
      },
      { defaultValue: "none", group: "Style" },
    ),
    prop(
      "openInNewTab",
      "Open in New Tab",
      { kind: "boolean" },
      { defaultValue: false, group: "Behavior" },
    ),
    prop("iconPath", "Icon", { kind: "image" }, { group: "Icon" }),
    prop("iconAlt", "Icon Alt Text", { kind: "string" }, { group: "Icon" }),
    prop(
      "fitToText",
      "Fit to Text",
      { kind: "boolean" },
      { defaultValue: false, group: "Layout" },
    ),
  ],
};
