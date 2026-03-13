import type {
  ComponentCategory,
  ComponentDefinition,
} from "@/types/components";

import {
  Banner,
  BannerHeader,
  ImageCarousel,
  NumberDisplay,
  SectionHeader,
} from "./content";
import { Collapsible, DecoratedList, Table } from "./data";
import { GridBackground } from "./design";
import { LinkButton } from "./interactive";
import { SectionImage, VideoEmbed } from "./media";
import {
  DynamicSectionRow,
  GenericSection,
  InvisibleSection,
  ScrollableContainer,
  SectionWithImage,
  SplitSection,
} from "./sections";
import { CopyCodeBox, LargeText, TextParagraph } from "./text";
import { FlexRow, SizedBox } from "./utility";

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
