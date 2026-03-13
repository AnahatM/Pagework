import type { ComponentDefinition } from "@/types/components";
import { prop, requiredProp } from "./helpers";

export const Table: ComponentDefinition = {
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

export const DecoratedList: ComponentDefinition = {
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

export const Collapsible: ComponentDefinition = {
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
