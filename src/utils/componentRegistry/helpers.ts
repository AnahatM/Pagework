import type { PropDefinition } from "@/types/components";

export function prop(
  name: string,
  displayName: string,
  type: PropDefinition["type"],
  opts: Partial<Omit<PropDefinition, "name" | "displayName" | "type">> = {},
): PropDefinition {
  return { name, displayName, type, required: false, ...opts };
}

export function requiredProp(
  name: string,
  displayName: string,
  type: PropDefinition["type"],
  opts: Partial<Omit<PropDefinition, "name" | "displayName" | "type">> = {},
): PropDefinition {
  return { name, displayName, type, required: true, ...opts };
}
