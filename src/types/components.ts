/* ═══════════════════════════════════════════
   Component Registry Types
   Defines how components are described for the builder UI
   ═══════════════════════════════════════════ */

export type ComponentCategory =
  | "sections"
  | "content"
  | "text"
  | "media"
  | "interactive"
  | "data"
  | "utility";

export interface ComponentDefinition {
  /** Unique type key (e.g., "GenericSection") — matches ComponentInstance.type */
  type: string;
  /** Human-friendly name shown in the component palette */
  displayName: string;
  /** Brief description for the component palette tooltip */
  description: string;
  /** Category for grouping in the palette */
  category: ComponentCategory;
  /** Icon identifier for the block representation */
  icon: string;
  /** Whether this component can contain nested children */
  acceptsChildren: boolean;
  /** If set, only these component types can be nested inside */
  allowedChildren?: string[];
  /** If set, this component can only be placed inside these parent types */
  allowedParents?: string[];
  /** Editable property definitions */
  props: PropDefinition[];
}

export interface PropDefinition {
  /** Prop key name (matches the React component's prop name) */
  name: string;
  /** Human-friendly label shown in the inspector */
  displayName: string;
  /** Tooltip / help text */
  description?: string;
  /** Input control type and constraints */
  type: PropType;
  /** Default value when component is first added */
  defaultValue?: unknown;
  /** Whether this prop must have a value */
  required: boolean;
  /** Inspector section grouping (e.g., "Layout", "Content", "Style") */
  group?: string;
}

export type PropType =
  | { kind: "string" }
  | { kind: "text" }
  | { kind: "markdown" }
  | { kind: "number"; min?: number; max?: number; step?: number }
  | { kind: "boolean" }
  | { kind: "select"; options: SelectOption[] }
  | { kind: "image" }
  | { kind: "color" }
  | { kind: "url" }
  | { kind: "array"; itemSchema: PropDefinition[] };

export interface SelectOption {
  label: string;
  value: string;
}
