import type { ComponentDefinition } from "@/types/components";
import { prop, requiredProp } from "./helpers";

export const Banner: ComponentDefinition = {
  type: "Banner",
  displayName: "Banner",
  description: "Full-width image banner with optional overlay content.",
  category: "content",
  icon: "banner",
  acceptsChildren: true,
  props: [
    prop(
      "lightImageUrl",
      "Light Theme Image",
      { kind: "image" },
      { group: "Images" },
    ),
    prop(
      "darkImageUrl",
      "Dark Theme Image",
      { kind: "image" },
      { group: "Images" },
    ),
    prop("imageUrl", "Fallback Image", { kind: "image" }, { group: "Images" }),
    requiredProp(
      "altText",
      "Alt Text",
      { kind: "string" },
      { defaultValue: "Banner", group: "Images" },
    ),
    prop(
      "maxHeightPx",
      "Max Height (px)",
      { kind: "number", min: 50 },
      { group: "Layout" },
    ),
    prop(
      "showScrollHint",
      "Show Scroll Hint",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
    prop(
      "hideScrollHintOnScroll",
      "Hide Hint on Scroll",
      { kind: "boolean" },
      { defaultValue: false, group: "Style" },
    ),
  ],
};

export const BannerHeader: ComponentDefinition = {
  type: "BannerHeader",
  displayName: "Banner Header",
  description: "Text overlay for use inside a Banner.",
  category: "content",
  icon: "heading",
  acceptsChildren: false,
  allowedParents: ["Banner"],
  props: [
    prop(
      "preHeadingText",
      "Pre-heading Text",
      { kind: "string" },
      { group: "Content" },
    ),
    requiredProp(
      "titleText",
      "Title",
      { kind: "string" },
      { group: "Content" },
    ),
    prop("subtitleText", "Subtitle", { kind: "string" }, { group: "Content" }),
  ],
};

export const SectionHeader: ComponentDefinition = {
  type: "SectionHeader",
  displayName: "Section Header",
  description: "Section title with optional subtitle and link button.",
  category: "content",
  icon: "heading",
  acceptsChildren: false,
  props: [
    requiredProp("title", "Title", { kind: "string" }, { group: "Content" }),
    prop("subtitle", "Subtitle", { kind: "string" }, { group: "Content" }),
    prop("preHeading", "Pre-heading", { kind: "string" }, { group: "Content" }),
    prop(
      "align",
      "Alignment",
      {
        kind: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
        ],
      },
      { defaultValue: "left", group: "Layout" },
    ),
    prop("linkButtonUrl", "Button URL", { kind: "url" }, { group: "Button" }),
    prop(
      "linkButtonText",
      "Button Text",
      { kind: "string" },
      { group: "Button" },
    ),
    prop(
      "linkButtonAlwaysBelow",
      "Button Below",
      { kind: "boolean" },
      { defaultValue: false, group: "Button" },
    ),
  ],
};

export const ImageCarousel: ComponentDefinition = {
  type: "ImageCarousel",
  displayName: "Image Carousel",
  description: "Slideshow with navigation controls.",
  category: "content",
  icon: "carousel",
  acceptsChildren: false,
  props: [
    requiredProp(
      "images",
      "Images",
      {
        kind: "array",
        itemSchema: [
          requiredProp("path", "Image", { kind: "image" }),
          prop("caption", "Caption", { kind: "string" }),
          prop("alt", "Alt Text", { kind: "string" }),
        ],
      },
      { defaultValue: [], group: "Content" },
    ),
    prop(
      "autoScroll",
      "Auto Scroll",
      { kind: "boolean" },
      { defaultValue: false, group: "Behavior" },
    ),
    prop(
      "autoScrollTimeMS",
      "Scroll Delay (ms)",
      { kind: "number", min: 500 },
      { defaultValue: 3000, group: "Behavior" },
    ),
  ],
};

export const NumberDisplay: ComponentDefinition = {
  type: "NumberDisplay",
  displayName: "Number Display",
  description: "Large number with descriptive label.",
  category: "content",
  icon: "number",
  acceptsChildren: false,
  props: [
    requiredProp(
      "displayNumber",
      "Number",
      { kind: "string" },
      { group: "Content" },
    ),
    requiredProp(
      "numberLabel",
      "Label",
      { kind: "string" },
      { group: "Content" },
    ),
    prop("miniText", "Mini Text", { kind: "string" }, { group: "Content" }),
  ],
};
