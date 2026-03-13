import type { ComponentDefinition } from "@/types/components";
import { prop, requiredProp } from "./helpers";

export const SectionImage: ComponentDefinition = {
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

export const VideoEmbed: ComponentDefinition = {
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
