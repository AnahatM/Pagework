/* ═══════════════════════════════════════════
   Component Registry
   All component definitions available for the builder
   ═══════════════════════════════════════════ */

import type {
  ComponentCategory,
  ComponentDefinition,
  PropDefinition,
} from "@/types/components";

/* ── Helper to reduce boilerplate ────────── */

function prop(
  name: string,
  displayName: string,
  type: PropDefinition["type"],
  opts: Partial<Omit<PropDefinition, "name" | "displayName" | "type">> = {},
): PropDefinition {
  return { name, displayName, type, required: false, ...opts };
}

function requiredProp(
  name: string,
  displayName: string,
  type: PropDefinition["type"],
  opts: Partial<Omit<PropDefinition, "name" | "displayName" | "type">> = {},
): PropDefinition {
  return { name, displayName, type, required: true, ...opts };
}

/* ══════════════════════════════════════════════
   Section Components
   ══════════════════════════════════════════════ */

const GenericSection: ComponentDefinition = {
  type: "GenericSection",
  displayName: "Section",
  description: "Simple content wrapper with panel styling.",
  category: "sections",
  icon: "section",
  acceptsChildren: true,
  props: [],
};

const InvisibleSection: ComponentDefinition = {
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

const SplitSection: ComponentDefinition = {
  type: "SplitSection",
  displayName: "Split Section",
  description: "Two-column equal-width layout. Stacks on mobile.",
  category: "sections",
  icon: "columns",
  acceptsChildren: true,
  props: [],
};

const SectionWithImage: ComponentDefinition = {
  type: "SectionWithImage",
  displayName: "Section with Image",
  description: "Two-column layout: content on one side, image on the other.",
  category: "sections",
  icon: "image-section",
  acceptsChildren: true,
  props: [
    requiredProp("imageUrl", "Image", { kind: "image" }, { group: "Image" }),
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

const DynamicSectionRow: ComponentDefinition = {
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

const ScrollableContainer: ComponentDefinition = {
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

/* ══════════════════════════════════════════════
   Content Components
   ══════════════════════════════════════════════ */

const Banner: ComponentDefinition = {
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

const BannerHeader: ComponentDefinition = {
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

const SectionHeader: ComponentDefinition = {
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

const ImageCarousel: ComponentDefinition = {
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

const NumberDisplay: ComponentDefinition = {
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

/* ══════════════════════════════════════════════
   Text Components
   ══════════════════════════════════════════════ */

const TextParagraph: ComponentDefinition = {
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

const LargeText: ComponentDefinition = {
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

const CopyCodeBox: ComponentDefinition = {
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

/* ══════════════════════════════════════════════
   Media Components
   ══════════════════════════════════════════════ */

const SectionImage: ComponentDefinition = {
  type: "SectionImage",
  displayName: "Image",
  description: "Image with optional caption.",
  category: "media",
  icon: "image",
  acceptsChildren: false,
  props: [
    requiredProp("imagePath", "Image", { kind: "image" }, { group: "Content" }),
    prop("caption", "Caption", { kind: "string" }, { group: "Content" }),
    prop("altText", "Alt Text", { kind: "string" }, { group: "Content" }),
    prop(
      "widthPercent",
      "Width (%)",
      { kind: "number", min: 1, max: 100 },
      { defaultValue: 100, group: "Layout" },
    ),
    prop(
      "disableClick",
      "Disable Click to Open",
      { kind: "boolean" },
      { defaultValue: false, group: "Behavior" },
    ),
  ],
};

const VideoEmbed: ComponentDefinition = {
  type: "VideoEmbed",
  displayName: "Video Embed",
  description: "Embedded video (YouTube, Vimeo, or direct URL).",
  category: "media",
  icon: "video",
  acceptsChildren: false,
  props: [
    requiredProp(
      "videoUrl",
      "Video URL",
      { kind: "url" },
      { group: "Content" },
    ),
    prop(
      "title",
      "Title",
      { kind: "string" },
      { defaultValue: "Video", group: "Content" },
    ),
    prop(
      "aspectRatio",
      "Aspect Ratio",
      {
        kind: "select",
        options: [
          { label: "16:9", value: "16:9" },
          { label: "4:3", value: "4:3" },
          { label: "1:1", value: "1:1" },
        ],
      },
      { defaultValue: "16:9", group: "Layout" },
    ),
  ],
};

/* ══════════════════════════════════════════════
   Interactive Components
   ══════════════════════════════════════════════ */

const LinkButton: ComponentDefinition = {
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

const CustomButton: ComponentDefinition = {
  type: "CustomButton",
  displayName: "Button",
  description: "Interactive button for forms or actions.",
  category: "interactive",
  icon: "button",
  acceptsChildren: false,
  props: [
    requiredProp("text", "Label", { kind: "string" }, { group: "Content" }),
    prop(
      "variant",
      "Variant",
      {
        kind: "select",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
          { label: "Positive", value: "positive" },
          { label: "Warning", value: "warning" },
          { label: "Negative", value: "negative" },
        ],
      },
      { defaultValue: "primary", group: "Style" },
    ),
    prop(
      "style",
      "Fill Style",
      {
        kind: "select",
        options: [
          { label: "Solid", value: "solid" },
          { label: "Translucent", value: "translucent" },
        ],
      },
      { defaultValue: "solid", group: "Style" },
    ),
    prop(
      "fontStyle",
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
      "disabled",
      "Disabled",
      { kind: "boolean" },
      { defaultValue: false, group: "Behavior" },
    ),
  ],
};

/* ══════════════════════════════════════════════
   Data Components
   ══════════════════════════════════════════════ */

const Table: ComponentDefinition = {
  type: "Table",
  displayName: "Table",
  description: "Data table with columns and rows.",
  category: "data",
  icon: "table",
  acceptsChildren: false,
  props: [
    requiredProp(
      "columns",
      "Columns",
      {
        kind: "array",
        itemSchema: [
          requiredProp("header", "Header", { kind: "string" }),
          requiredProp("key", "Key", { kind: "string" }),
        ],
      },
      { defaultValue: [], group: "Content" },
    ),
    requiredProp(
      "data",
      "Rows",
      {
        kind: "array",
        itemSchema: [],
      },
      {
        defaultValue: [],
        group: "Content",
        description: "Row data objects matching column keys.",
      },
    ),
    prop(
      "showBorders",
      "Show Borders",
      { kind: "boolean" },
      { defaultValue: true, group: "Style" },
    ),
    prop(
      "alternatingRows",
      "Alternating Row Colors",
      { kind: "boolean" },
      { defaultValue: true, group: "Style" },
    ),
  ],
};

const DecoratedList: ComponentDefinition = {
  type: "DecoratedList",
  displayName: "Decorated List",
  description: "Styled list with titles and descriptions.",
  category: "data",
  icon: "list",
  acceptsChildren: false,
  props: [
    requiredProp(
      "items",
      "Items",
      {
        kind: "array",
        itemSchema: [
          requiredProp("title", "Title", { kind: "string" }),
          requiredProp("description", "Description", { kind: "text" }),
          prop(
            "showBulletDot",
            "Show Bullet",
            { kind: "boolean" },
            { defaultValue: true },
          ),
        ],
      },
      { defaultValue: [], group: "Content" },
    ),
  ],
};

const Collapsible: ComponentDefinition = {
  type: "Collapsible",
  displayName: "Collapsible",
  description: "Expandable/collapsible section.",
  category: "data",
  icon: "collapse",
  acceptsChildren: true,
  props: [
    requiredProp("title", "Title", { kind: "string" }, { group: "Content" }),
    prop(
      "defaultExpanded",
      "Start Expanded",
      { kind: "boolean" },
      { defaultValue: false, group: "Behavior" },
    ),
  ],
};

/* ══════════════════════════════════════════════
   Utility Components
   ══════════════════════════════════════════════ */

const SizedBox: ComponentDefinition = {
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

const FlexRow: ComponentDefinition = {
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

/* ══════════════════════════════════════════════
   Design Components
   ══════════════════════════════════════════════ */

const GridBackground: ComponentDefinition = {
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

/* ══════════════════════════════════════════════
   Registry
   ══════════════════════════════════════════════ */

/** All available components keyed by type */
export const COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
  // Sections
  GenericSection,
  InvisibleSection,
  SplitSection,
  SectionWithImage,
  DynamicSectionRow,
  ScrollableContainer,
  // Content
  Banner,
  BannerHeader,
  SectionHeader,
  ImageCarousel,
  NumberDisplay,
  // Text
  TextParagraph,
  LargeText,
  CopyCodeBox,
  // Media
  SectionImage,
  VideoEmbed,
  // Interactive
  LinkButton,
  CustomButton,
  // Data
  Table,
  DecoratedList,
  Collapsible,
  // Utility
  SizedBox,
  FlexRow,
  // Design
  GridBackground,
};

/** Components grouped by category for the palette UI */
export function getComponentsByCategory(): Record<
  ComponentCategory,
  ComponentDefinition[]
> {
  const groups: Record<ComponentCategory, ComponentDefinition[]> = {
    sections: [],
    content: [],
    text: [],
    media: [],
    interactive: [],
    data: [],
    utility: [],
    design: [],
  };

  for (const def of Object.values(COMPONENT_REGISTRY)) {
    groups[def.category].push(def);
  }

  return groups;
}

/** Find a component definition by type string */
export function getComponentDefinition(
  type: string,
): ComponentDefinition | undefined {
  return COMPONENT_REGISTRY[type];
}

/** Category display names for the palette */
export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  sections: "Sections",
  content: "Content",
  text: "Text",
  media: "Media",
  interactive: "Interactive",
  data: "Data",
  utility: "Utility",
  design: "Design",
};
