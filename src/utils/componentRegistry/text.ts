import type { ComponentDefinition } from "@/types/components";
import { prop, requiredProp } from "./helpers";

export const TextParagraph: ComponentDefinition = {
  type: "TextParagraph",
  displayName: "Text Paragraph",
  description: "Rich text paragraph with markdown support.",
  category: "text",
  icon: "text",
  acceptsChildren: false,
  props: [
    requiredProp("text", "Text", { kind: "markdown" }, { group: "Content" }),
    prop(
      "highlight",
      "Highlight",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
    prop(
      "bold",
      "Bold",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
    prop(
      "centered",
      "Centered",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
    prop(
      "italic",
      "Italic",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
    prop(
      "uppercase",
      "Uppercase",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
    prop(
      "maxWidth",
      "Max Width (px)",
      { kind: "number", min: 100 },
      { defaultValue: 650, group: "Layout" },
    ),
    prop(
      "fullWidth",
      "Full Width",
      { kind: "boolean" },
      { defaultValue: true, group: "Layout" },
    ),
    prop(
      "spaceAfter",
      "Space After",
      { kind: "boolean" },
      { defaultValue: false, group: "Layout" },
    ),
    prop(
      "heading",
      "Heading Level",
      {
        kind: "select",
        options: [
          { label: "None", value: "none" },
          { label: "H1", value: "h1" },
          { label: "H2", value: "h2" },
          { label: "H3", value: "h3" },
        ],
      },
      { defaultValue: "none", group: "Style" },
    ),
    prop(
      "borderBottom",
      "Border Bottom",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
  ],
};

export const LargeText: ComponentDefinition = {
  type: "LargeText",
  displayName: "Large Text",
  description: "Large styled display text.",
  category: "text",
  icon: "large-text",
  acceptsChildren: false,
  props: [
    requiredProp("text", "Text", { kind: "string" }, { group: "Content" }),
    prop(
      "textAlign",
      "Alignment",
      {
        kind: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
      { defaultValue: "left", group: "Style" },
    ),
    prop(
      "fontSizePx",
      "Font Size (px)",
      { kind: "number", min: 12, max: 200 },
      { defaultValue: 30, group: "Style" },
    ),
    prop(
      "fontWeight",
      "Font Weight",
      {
        kind: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Bold", value: "bold" },
          { label: "Black", value: "black" },
          { label: "Lighter", value: "lighter" },
        ],
      },
      { defaultValue: "normal", group: "Style" },
    ),
    prop(
      "fontType",
      "Font Type",
      {
        kind: "select",
        options: [
          { label: "Normal", value: "normal" },
          { label: "Display", value: "display" },
        ],
      },
      { defaultValue: "normal", group: "Style" },
    ),
  ],
};

export const CopyCodeBox: ComponentDefinition = {
  type: "CopyCodeBox",
  displayName: "Copy Code Box",
  description: "Text block with copy-to-clipboard button.",
  category: "text",
  icon: "code",
  acceptsChildren: false,
  props: [
    requiredProp("text", "Text", { kind: "text" }, { group: "Content" }),
    requiredProp("label", "Label", { kind: "string" }, { group: "Content" }),
    prop(
      "copiedMessage",
      "Copied Message",
      { kind: "string" },
      { defaultValue: "Copied to clipboard.", group: "Content" },
    ),
  ],
};
